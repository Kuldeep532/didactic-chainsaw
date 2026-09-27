# Nexus Wave Technologies

Nexus Wave Technologies develops Nexus Plus and Geeta Nexus.

## Integration contract

The website and supported products use the shared Supabase project for services that have been explicitly wired to Supabase.

The website frontend is Astro-based and does not depend on the legacy Express API or Firebase frontend authentication.

## Naming

Use:
- Nexus Wave Technologies
- Nexus Plus
- Geeta Nexus

Do not use the retired company name in new user-facing content.


## Community data model

The Community feature uses one canonical feed contract: `posts`.

Each published post should expose:
- `id`
- `title`
- `content`
- `published_at`
- `author_display_name`
- `post_type`

Recommended `post_type` values:
- `official`: published by an authorized team member.
- `community`: submitted by a verified member and approved by moderation.

Legacy `team_posts` may be retained during migration, but the web feed should read from `posts` once the Supabase migration/backfill is applied. Do not create a second public feed for the same content.

Recommended role values:
- `user`
- `moderator`
- `team_editor`
- `admin`

Privileged publishing and moderation must be enforced with Supabase Row Level Security and/or Edge Functions. A client-side role flag must never grant access.

Recommended community entities:
- `profiles`: public profile fields and role/verification status.
- `friendships`: requester, addressee, status.
- `conversations`: private conversation metadata.
- `conversation_members`: membership boundary for every conversation.
- `messages`: message rows protected by conversation membership.
- `posts`: the canonical community feed and moderation status.
- `verification_requests`: verification state and minimal review metadata.
- `women_safety_reports`: confidential safety submissions.
- `campaign_submissions`: volunteer contributions and evidence-review state.
- `women_safety_heroes`: reviewed monthly recognition records.

For gender-specific community rooms, enforce a membership-category policy at the server boundary rather than arbitrary client-side room selection. Do not infer gender from photographs, voices or biometric analysis. Store the minimum information required to operate the access policy and support an appeal/review path for mistakes.

For chat deletion, distinguish between:
- "delete for me": removes the conversation/message from the user's view where product policy permits.
- "delete for everyone": restricted operation with explicit rules and auditability.

Official publishing must be authorized by server-side role checks, not by hiding a button alone.
