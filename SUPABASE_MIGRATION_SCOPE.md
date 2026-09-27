# Supabase-only web migration scope

The canonical website is `artifacts/web`.

The website should be deployed as a static Vite/React application on Vercel. Supabase is the browser-facing backend.

## Already migrated
- Supabase Auth is used by `artifacts/web/src/lib/supabase.ts`.
- Community and team flows already use Supabase browser APIs.
- Vercel builds `artifacts/web` directly.

## Still coupled to the legacy API server
- `@workspace/api-client-react` generated client calls `/api/*`.
- Contact, Blog, BlogPost and Admin still reference that generated client.
- ChatbotWidget, DevotionalBanner and GlobalMessageBanner call `VITE_BASE_URL/api/*`.
- Legacy server lives under `artifacts/api-server` and uses Express, Firebase Admin and Drizzle/Postgres.

These web call sites must be migrated to Supabase tables/functions/storage/auth before the legacy API server is deleted.

## Target
Vercel serves only the Vite build. No Express server, Firebase Admin runtime, Drizzle/Postgres runtime, API-server process, or Node backend is required by the website.
