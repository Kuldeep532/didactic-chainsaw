---
name: Auth Architecture
description: Custom JWT + bcrypt auth decision and implementation details for Nexus Wave Technologies
---

# Auth Architecture

## The rule
Use custom JWT + bcrypt (not Clerk, Firebase, or other managed auth).

**Why:** Already 60% built when the decision was made; free; portable to any hosting platform; works with Vercel serverless without vendor lock-in.

## How to apply
- JWT signing uses `SESSION_SECRET` env var (via `jsonwebtoken`)
- bcrypt via `bcryptjs` package (pure JS — no native build step)
- Token stored in localStorage as `nwt_auth_token`
- Token verified on mount by calling `GET /api/auth/me`
- `googleSub` column is nullable — email-only users have no Google sub

## Timing attack defense
Always use a known-valid bcrypt hash for dummy compares on unknown users, not an arbitrary string. A malformed hash can throw instead of returning false.

Use: `$2a$12$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` (a valid-format hash that will always fail comparison)
