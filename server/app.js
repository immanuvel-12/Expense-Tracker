import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { z } from "zod";
import { User, Transaction } from "./models.js";

const COOKIE = "expensio_token";
const WEEK = 7 * 24 * 60 * 60 * 1000;

export function createApp() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) throw new Error("JWT_SECRET must be set (32+ chars)");
  const isProd = process.env.NODE_ENV === "production";
  const origins = (process.env.CLIENT_ORIGIN || "http://localhost:5173,http://localhost:8080")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const app = express();
  app.set("trust proxy", 1);
  app.use(helmet());
  app.use(cors({ origin: origins, credentials: true }));
  app.use(express.json({ limit: "20kb" }));
  app.use(cookieParser());

  const cookieOpts = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
  };

  const setSession = (res, user) => {
    const token = jwt.sign({ sub: user._id.toString(), role: user.role }, secret, { expiresIn: "7d" });
    res.cookie(COOKIE, token, { ...cookieOpts, maxAge: WEEK });
  };

  const publicUser = (u) => ({ id: u._id.toString(), email: u.email, full_name: u.name, role: u.role });

  const requireAuth = (req, res, next) => {
    const token = req.cookies[COOKIE];
    if (!token) return res.status(401).json({ error: "Not authenticated" });
    try {
      const p = jwt.verify(token, secret);
      req.userId = p.sub;
      req.role = p.role;
      next();
    } catch (e) {
      res.clearCookie(COOKIE, cookieOpts);
      const expired = e.name === "TokenExpiredError";
      res.status(401).json({ error: expired ? "Session expired. Please log in again." : "Not authenticated", expired });
    }
  };

  const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 100, standardHeaders: true, legacyHeaders: false });

  const registerSchema = z.object({
    email: z.string().trim().email("Invalid email address").max(255),
    password: z.string().min(6, "Password should be at least 6 characters").max(128),
    full_name: z.string().trim().min(1, "Please fill in all fields").max(100),
  });
  const loginSchema = z.object({
    email: z.string().trim().email("Invalid email address"),
    password: z.string().min(1),
  });
  const txSchema = z.object({
    type: z.enum(["income", "expense"]),
    amount: z.number().positive().max(1e12),
    category: z.string().max(50).optional().nullable(),
    description: z.string().max(500).optional().default(""),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
    month: z.string().max(20).optional().nullable(),
  });
  const updateTxSchema = txSchema.partial();
  const bad = (res, err) => res.status(400).json({ error: err.issues[0]?.message || "Invalid input" });

  app.get("/api/health", (_req, res) => res.json({ ok: true }));

  app.post("/api/auth/register", authLimiter, async (req, res, next) => {
    try {
      const parsed = registerSchema.safeParse(req.body);
      if (!parsed.success) return bad(res, parsed.error);
      const { email, password, full_name } = parsed.data;
      if (await User.exists({ email: email.toLowerCase() })) return res.status(409).json({ error: "User already registered" });
      const user = await User.create({ email, name: full_name, passwordHash: await bcrypt.hash(password, 12) });
      setSession(res, user);
      res.status(201).json({ user: publicUser(user) });
    } catch (e) { next(e); }
  });

  app.post("/api/auth/login", authLimiter, async (req, res, next) => {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: "Invalid login credentials" });
      const user = await User.findOne({ email: parsed.data.email.toLowerCase() });
      if (!user || !(await bcrypt.compare(parsed.data.password, user.passwordHash)))
        return res.status(401).json({ error: "Invalid login credentials" });
      setSession(res, user);
      res.json({ user: publicUser(user) });
    } catch (e) { next(e); }
  });

  app.post("/api/auth/logout", (_req, res) => {
    res.clearCookie(COOKIE, cookieOpts);
    res.json({ ok: true });
  });

  app.get("/api/auth/me", requireAuth, async (req, res, next) => {
    try {
      const user = await User.findById(req.userId);
      if (!user) return res.status(401).json({ error: "Not authenticated" });
      res.json({ user: publicUser(user) });
    } catch (e) { next(e); }
  });

  const toTx = (t) => ({
    id: t._id.toString(),
    type: t.type,
    amount: t.amount,
    category: t.category ?? null,
    description: t.description,
    date: t.date,
    month: t.month ?? null,
  });

  app.get("/api/transactions", requireAuth, async (req, res, next) => {
    try {
      const list = await Transaction.find({ userId: req.userId }).sort({ date: -1, createdAt: -1 });
      res.json({ transactions: list.map(toTx) });
    } catch (e) { next(e); }
  });

  app.post("/api/transactions", requireAuth, async (req, res, next) => {
    try {
      const parsed = txSchema.safeParse(req.body);
      if (!parsed.success) return bad(res, parsed.error);
      const t = await Transaction.create({ ...parsed.data, userId: req.userId });
      res.status(201).json({ transaction: toTx(t) });
    } catch (e) { next(e); }
  });

  app.put("/api/transactions/:id", requireAuth, async (req, res, next) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ error: "Not found" });
      const parsed = updateTxSchema.safeParse(req.body);
      if (!parsed.success) return bad(res, parsed.error);
      const updated = await Transaction.findOneAndUpdate(
        { _id: req.params.id, userId: req.userId },
        { $set: parsed.data },
        { new: true, runValidators: true }
      );
      if (!updated) return res.status(404).json({ error: "Not found" });
      res.json({ transaction: toTx(updated) });
    } catch (e) { next(e); }
  });

  app.delete("/api/transactions/:id", requireAuth, async (req, res, next) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ error: "Not found" });
      const r = await Transaction.deleteOne({ _id: req.params.id, userId: req.userId });
      if (r.deletedCount === 0) return res.status(404).json({ error: "Not found" });
      res.json({ ok: true });
    } catch (e) { next(e); }
  });

  app.delete("/api/transactions", requireAuth, async (req, res, next) => {
    try {
      await Transaction.deleteMany({ userId: req.userId });
      res.json({ ok: true });
    } catch (e) { next(e); }
  });

  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: "An unexpected error occurred" });
  });

  return app;
}
