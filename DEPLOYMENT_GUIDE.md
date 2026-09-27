# Nexus Wave Technologies — Deployment Guide

This repository contains the Nexus Wave Technologies website and supporting API code.

## Website

The production website is a Vite/React application under `artifacts/web`.

Build commands:

```bash
pnpm --filter @workspace/web run typecheck
pnpm --filter @workspace/web run build
```

## Supabase authentication

The website login and registration flow uses the existing Supabase project rather than Firebase.

Configure these variables in the Vercel project:

```text
VITE_SUPABASE_URL=https://cpbwiarqlvtlnwbkmpws.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<Supabase publishable key>
```

Do not commit the publishable key into source control. Configure it as a Vercel environment variable for Preview and Production.

The browser authentication flow uses Supabase Auth for email/password registration, sign-in, session refresh and sign-out.

## PayU readiness

The website publishes customer-facing product information and the following legal pages:

- `/legal/privacy`
- `/legal/terms`
- `/legal/refund`
- `/legal/disclaimer`
- `/legal/accessibility`

The refund page includes the refund request process and a stated review timeframe. Before a production payment launch, make sure the live payment provider account, website/domain details and legal/business information are consistent with the information submitted to the payment provider.

## Vercel

Keep the existing Vercel routing for the Vite SPA and API server. After deployment, verify:

1. The home page loads without a blank screen.
2. `/apps`, `/utilities`, `/login` and all legal pages open directly.
3. Supabase sign-in and registration work using the configured environment variables.
4. Direct refresh on a nested route still serves the SPA.
5. The final public domain is the same domain submitted to the payment provider.

## Security

- Never commit secrets, service-role keys, database passwords or API provider secrets.
- Only the Supabase publishable key belongs in the browser application.
- Keep Row Level Security enabled for user-specific Supabase tables.
- Use server-side verification for payment status and paid feature activation.
