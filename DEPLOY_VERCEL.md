# Deploying the Intervue frontend to Vercel

No code changes were needed here - `frontend/services/api.ts` already reads the backend URL from
`NEXT_PUBLIC_API_URL`, and `frontend/.env.local.example` already documents it. `node_modules/` and
`.next/` are excluded from this package on purpose; Vercel builds those itself.

## Steps
1. vercel.com -> Add New -> Project -> import your repo.
2. Root Directory: `frontend` (Vercel auto-detects Next.js - no other settings needed).
3. Environment Variables -> add:
       NEXT_PUBLIC_API_URL = https://<your-backend>.onrender.com
   (set this to your Render backend's URL from the backend deploy; redeploy after changing it, since
   NEXT_PUBLIC_* variables are baked in at build time, not read at runtime).
4. Deploy.
5. Copy the resulting Vercel URL (e.g. https://intervue.vercel.app) and set it as `FRONTEND_ORIGIN`
   on the Render backend (see DEPLOY_RENDER.md step 3), then redeploy the backend so CORS allows it.

## Order matters
Deploy the backend first (you need its URL for step 3 above), then the frontend, then go back and
set FRONTEND_ORIGIN on the backend once you know the frontend's final URL. Vercel also creates a
preview-deployment URL for every branch/PR, with a different random subdomain - if you want those to
work against the backend too, add them to FRONTEND_ORIGIN as a comma-separated list (config.py on
the backend already supports multiple origins).
