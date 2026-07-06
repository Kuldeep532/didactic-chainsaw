---
name: DATABASE_URL
description: How DATABASE_URL is provided in this project
---

# DATABASE_URL

## The rule
`DATABASE_URL` is a **runtime-managed** Replit secret. Do not set it with `setEnvVars()` — it will be rejected. Do not request it from the user.

**Why:** Replit provisions PostgreSQL automatically for every project and injects DATABASE_URL at runtime. `viewEnvVars()` will not show it in the list (it's in `runtimeManaged`), but it IS available in all workflows and shell commands.

## How to apply
- To verify it's available: `echo $DATABASE_URL` in shell — you'll see `postgresql://postgres:password@...`
- To push schema: `pnpm --filter @workspace/db run push` (uses DATABASE_URL automatically)
- In code: `process.env.DATABASE_URL` — always defined at runtime
- The `.env.example` documents it as a required var for other environments (Vercel, local dev)
