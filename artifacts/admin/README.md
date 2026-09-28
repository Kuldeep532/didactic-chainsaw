# Nexus Private Admin

The private admin source is part of the same repository/project as the public website. It is intentionally kept out of the public website navigation.

For production, expose the admin experience through a separate hostname/path in the same Vercel project, for example:

- Public: `https://nexusweb.co.in`
- Private: `https://admin.nexusweb.co.in`

The repository contains the admin app under `artifacts/admin`. The routing/build configuration must serve that app under the private hostname without exposing it in public navigation.

## Environment

- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Never expose the Supabase service-role key in browser code.

## Security

The hostname/path is not the security boundary. Supabase Auth, RLS, RPCs and Edge Functions must enforce every privileged operation.
