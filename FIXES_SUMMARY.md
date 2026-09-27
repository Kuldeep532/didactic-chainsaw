# Astro Migration and Stabilization

## Current status

The public website has been migrated from the legacy Vite/React frontend to Astro under `artifacts/web`.

### Website stack

- Astro 5.14.1
- Browser-side Supabase Auth where required
- Static Astro routes for primary pages and legal pages
- Accessible semantic HTML, skip navigation, visible focus states and responsive navigation

### Vercel stabilization

The repository-level `vercel.json` currently keeps automatic Git deployments disabled while the Astro migration is stabilized. This prevents repeated Git-triggered deployments during the cleanup phase.

Current website commands:

```text
Install: cd artifacts/web && npm install --no-package-lock
Build:   cd artifacts/web && npm run build
Output:  artifacts/web/dist
```

### Environment variables

The Astro website expects:

```text
PUBLIC_SUPABASE_URL=https://cpbwiarqlvtlnwbkmpws.supabase.co
PUBLIC_SUPABASE_PUBLISHABLE_KEY=<Supabase publishable key>
```

Never place service-role keys, database passwords, payment secrets, or other private credentials in `PUBLIC_*` variables.

### Migrated routes

- `/`
- `/about`
- `/apps`
- `/utilities`
- `/community`
- `/contact`
- `/join-team`
- `/login`
- `/account`
- `/legal/privacy`
- `/legal/terms`
- `/legal/refund`
- `/legal/disclaimer`
- `/legal/accessibility`

### Legacy cleanup

Legacy Vite configuration and React entry files have been removed from the web application. The obsolete backend and generated workspace code are being retired from the repository migration in this stage; old references in historical documentation are not evidence of active runtime dependencies.

### Important verification note

A successful Vercel deployment has not yet been claimed. The next deployment should be triggered only after the Astro build is independently verified.
