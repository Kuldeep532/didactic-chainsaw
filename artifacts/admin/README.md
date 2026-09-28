# Private Nexus Admin

This app lives outside `artifacts/web`, so the public website does not ship the admin workspace.

## Deployment

Deploy `artifacts/admin` as a separate Vercel project, for example at `admin.nexusweb.co.in`.

Environment variables:
- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Do not expose a Supabase service-role key to the browser.

## Security

The UI is only an entry point. Privileged authorization must be enforced in Supabase RLS, RPCs and/or Edge Functions using the administrator role. The public site contains no link to this application.
