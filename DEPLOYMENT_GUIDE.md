# Nexus Wave Technologies — Vercel Deployment Guide

The website is an Astro application under `artifacts/web`. It uses Supabase directly from the browser for the website account flow, so do not place a Supabase service-role key or database password in Vercel browser-visible environment variables.

## Vercel project settings

Keep the Vercel **Root Directory** at the repository root.

Repository configuration currently uses:

- Install Command: `cd artifacts/web && npm install --no-package-lock`
- Build Command: `cd artifacts/web && npm run build`
- Output Directory: `artifacts/web/dist`

Automatic Git deployments are currently disabled in `vercel.json` while the Astro migration is being stabilized. Re-enable deployment only after a successful build has been verified.

## Vercel Environment Variables

For the website project, configure these public variables for Production, Preview and Development:

```text
PUBLIC_SUPABASE_URL=https://cpbwiarqlvtlnwbkmpws.supabase.co
PUBLIC_SUPABASE_PUBLISHABLE_KEY=<your Supabase publishable key>
```

Astro exposes `PUBLIC_*` variables to browser code. Never put a Supabase service-role key, database password, JWT secret, payment secret, or another private credential in a `PUBLIC_*` variable.

The website does not need Firebase environment variables.

## Routes

Astro generates real static routes for pages such as:

- `/community`
- `/join-team`
- `/account`
- `/legal/privacy`
- `/legal/terms`
- `/legal/refund`
- `/legal/disclaimer`
- `/legal/accessibility`

## Community audio

Community content includes a **Listen** control using the browser/device speech engine. This does not require an external audio API key.

## Production checks

After the Astro build is verified and deployment is re-enabled, test the home page, all primary navigation routes, legal routes, account authentication, and the community Listen control. Use the final Vercel URL later when the Android apps are connected.
