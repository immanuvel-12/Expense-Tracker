# Agent rules
- All frontend auth and data calls go through `src/lib/backend.ts`; pages never import the Supabase client directly. Why: lets `VITE_BACKEND` switch between Lovable Cloud and the Express/MongoDB API without touching UI.
- The Express/MongoDB API lives in `server/` and is deployed outside Lovable; secrets only in server env vars. Why: Lovable hosts only the frontend.
- Sessions use a JWT in an HttpOnly cookie; frontend fetches use `credentials: "include"`. Why: tokens stay out of JavaScript.
