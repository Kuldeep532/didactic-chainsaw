# Nexus Web Technology

Nexus Web Technology develops Nexus Plus and Geeta Nexus, with Nexus Dharma as its dedicated spiritual activity.

## Integration contract

All three products use the same Supabase project:
`cpbwiarqlvtlnwbkmpws`

Shared identity:
- Supabase Auth user UUID
- Email/password and other enabled Supabase Auth providers
- Same privacy, terms and refund policies
- Same team/community backend

Website community:
- `/community`
- `/join-team`
- `/team-admin`

Supabase tables:
- `nexus_team_applications`
- `nexus_team_members`
- `nexus_posts`

The mobile applications should use the Supabase REST/RPC endpoints with the publishable key and the authenticated user's access token. Never ship a Supabase service-role key in either app.

## Suggested app tabs
- Geeta Nexus: Community / Join Our Team
- Nexus Plus: Community / Team status / Teaching
- Website: Community / Join Our Team / Team Admin

## Admin rule
The main admin panel must only be accessible to the configured main Supabase account. Application-level email gating is backed by the database-side `is_nexus_main_admin()` function, so simply changing client-side UI state does not grant admin privileges.
