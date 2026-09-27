# Nexus Web Technology — Vercel Deployment Guide

The website is a Vite/React application under `artifacts/web`. The website frontend uses Supabase directly from the browser, so the frontend project does not need a database password or Supabase service-role key.

## Vercel project settings

Keep the Vercel **Root Directory** at the repository root.

Use:

- Framework Preset: **Vite**
- Install Command: `corepack enable && corepack prepare pnpm@10.18.0 --activate && pnpm install --frozen-lockfile`
- Build Command: `pnpm --filter @workspace/web run build`
- Output Directory: `artifacts/web/dist/public`

The repository already contains these settings in `vercel.json`.

## Vercel Environment Variables

For the website project, add these two variables for Production, Preview and Development:

```text
VITE_SUPABASE_URL=https://cpbwiarqlvtlnwbkmpws.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<your Supabase publishable key>
```

Get the publishable key from the Supabase project API settings.

Important: the `VITE_` prefix means the value is exposed to browser code during the Vite build. Never put a Supabase service-role key, database password, JWT secret, payment secret or other private credential in a `VITE_` variable.

The website frontend does not need Firebase environment variables.

## SPA routing

Vercel rewrites application routes to `/index.html`, so direct navigation works for routes such as:

- `/community`
- `/join-team`
- `/account`
- `/team-admin`
- `/legal/privacy`
- `/legal/terms`
- `/legal/refund`

## Website features backed by Supabase

The website uses Supabase for:

- email/password sign-in and registration
- team applications
- approved team membership
- community post publishing
- community post listing
- main-admin access

The database, not the browser, is the final authorization layer for admin actions.

## Community audio

Community posts have a **Listen** button. It uses the browser/device speech engine, so no audio API key or audio file service is required for this feature.

## Production checks

After deployment, verify:

1. Home page loads without a blank screen.
2. `/community` shows approved free posts.
3. The Listen button reads a post aloud.
4. Sign-in and account creation work.
5. `/join-team` stores applications in Supabase.
6. `/team-admin` is available only to the main Supabase account.
7. Nested routes open correctly after a direct refresh.
8. The final Vercel URL is the URL used later when connecting the Android apps.
