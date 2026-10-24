# Expensio API (Express + MongoDB Atlas)

## 1. MongoDB Atlas
1. Create a free cluster at mongodb.com/atlas.
2. Database Access → add a user with a strong password.
3. Network Access → allow `0.0.0.0/0` (needed for Render/Railway dynamic IPs).
4. Connect → Drivers → copy the URI, put database name `expensio` in it.

## 2. Run locally
```
cd server
cp .env.example .env   # fill in MONGODB_URI and JWT_SECRET (openssl rand -hex 48)
npm install
npm run dev
npm test               # 8 tests: signup, login, logout, session, CRUD, user isolation
```

## 3. Deploy (Render example)
- New Web Service → this repo, Root Directory `server`, Build `npm install`, Start `npm start`.
- Env vars: `MONGODB_URI`, `JWT_SECRET`, `NODE_ENV=production`,
  `CLIENT_ORIGIN=https://leafy-balance.lovable.app,https://id-preview--c2b60721-cd4c-4f11-9dea-49bb54a65577.lovable.app`
- Check `https://<your-service>.onrender.com/api/health` returns `{"ok":true}`.

## 4. Point the frontend at it
In the project root `.env`-style build settings add (public, not secrets):
```
VITE_BACKEND=mongo
VITE_API_URL=https://<your-service>.onrender.com
```
Without `VITE_BACKEND=mongo` the app keeps using Lovable Cloud.

Note: the session cookie is cross-site (SameSite=None; Secure). Browsers that block third-party cookies (Safari) need the API on a subdomain of the frontend's custom domain, e.g. `api.yourdomain.com`.

## 5. After it works
Remove `src/integrations/supabase`, the cloud branches in `src/lib/backend.ts`, and disable Lovable Cloud.
