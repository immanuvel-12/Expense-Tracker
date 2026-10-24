import { beforeAll, afterAll, beforeEach, describe, it, expect } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { createApp } from "./app.js";

let mongo, app;
beforeAll(async () => {
  process.env.JWT_SECRET = "test-secret-test-secret-test-secret-1234";
  process.env.CLIENT_ORIGIN = "http://localhost:8080";
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
  app = createApp();
}, 120000);
afterAll(async () => { await mongoose.disconnect(); await mongo.stop(); });
beforeEach(async () => { await mongoose.connection.db.dropDatabase(); });

const signup = (agent, email = "a@test.com") =>
  agent.post("/api/auth/register").send({ email, password: "secret123", full_name: "A" });

describe("auth", () => {
  it("signup sets an HttpOnly cookie and /me returns the user", async () => {
    const agent = request.agent(app);
    const r = await signup(agent);
    expect(r.status).toBe(201);
    expect(r.headers["set-cookie"][0]).toMatch(/HttpOnly/);
    const me = await agent.get("/api/auth/me");
    expect(me.body.user.email).toBe("a@test.com");
  });
  it("rejects duplicate signup", async () => {
    await signup(request(app));
    const r = await signup(request(app));
    expect(r.status).toBe(409);
    expect(r.body.error).toBe("User already registered");
  });
  it("rejects passwords shorter than 6 characters", async () => {
    const r = await request(app).post("/api/auth/register").send({ email: "b@t.com", password: "123", full_name: "B" });
    expect(r.status).toBe(400);
  });
  it("rejects wrong password", async () => {
    await signup(request(app));
    const r = await request(app).post("/api/auth/login").send({ email: "a@test.com", password: "wrong" });
    expect(r.status).toBe(401);
    expect(r.body.error).toBe("Invalid login credentials");
  });
  it("logout ends the session", async () => {
    const agent = request.agent(app);
    await signup(agent);
    await agent.post("/api/auth/logout");
    expect((await agent.get("/api/auth/me")).status).toBe(401);
  });
});

describe("transactions", () => {
  const tx = { type: "expense", amount: 50, category: "food", description: "lunch", date: "2026-10-13", month: "October" };
  it("adds, lists latest first, deletes and clears", async () => {
    const agent = request.agent(app);
    await signup(agent);
    await agent.post("/api/transactions").send({ ...tx, date: "2026-10-01" });
    const created = await agent.post("/api/transactions").send(tx);
    expect(created.status).toBe(201);
    const list = await agent.get("/api/transactions");
    expect(list.body.transactions.map((t) => t.date)).toEqual(["2026-10-13", "2026-10-01"]);
    expect((await agent.delete(`/api/transactions/${created.body.transaction.id}`)).status).toBe(200);
    await agent.delete("/api/transactions");
    expect((await agent.get("/api/transactions")).body.transactions).toHaveLength(0);
  });
  it("one user cannot see or delete another user's transactions", async () => {
    const a = request.agent(app); await signup(a, "a@test.com");
    const b = request.agent(app); await signup(b, "b@test.com");
    const created = await a.post("/api/transactions").send(tx);
    expect((await b.get("/api/transactions")).body.transactions).toHaveLength(0);
    expect((await b.delete(`/api/transactions/${created.body.transaction.id}`)).status).toBe(404);
    expect((await a.get("/api/transactions")).body.transactions).toHaveLength(1);
  });
  it("requires login", async () => {
    expect((await request(app).get("/api/transactions")).status).toBe(401);
  });
});
