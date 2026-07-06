# Nexus Wave Technologies

Public marketing website and backend API for Nexus Wave Technologies (maker of the Nexus Plus and Geeta Nexus apps), with an API designed to be called by both the website and the native mobile apps.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/web run dev` — run the website
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Website: React + Vite (`artifacts/web`)
- API: Express 5 (`artifacts/api-server`), mounted at `/api`
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — source of truth for all API contracts (public config, contact, support)
- `lib/db/src/schema/` — DB tables: `contact-messages.ts`, `support-requests.ts`
- `artifacts/api-server/src/routes/` — `public-config.ts` (company/app info), `contact.ts` (contact + support form handlers)
- `artifacts/web/src/pages/` — website pages (Home, About, Apps, Contact, legal pages)

## Architecture decisions

- The API is action/endpoint-based and intentionally scoped down from the original "Universal Gateway" concept (no AI provider router, no admin panel, no auth) — that full spec is a multi-week build, not a single pass. Current API covers: public config, contact messages, support requests.
- The website deliberately does not expose internal architecture/backend terminology (e.g. no "Universal Gateway" language) in any user-facing copy — this was an explicit user requirement.
- Route handlers are written as plain Express functions with no framework-specific globals, so they can be ported to Vercel serverless functions later with moderate effort (see User preferences below).

## Product

- Public website: Home, About, Apps (Nexus Plus, Geeta Nexus), Contact (backed by a real API + DB), legal pages (Privacy, Terms, Refund, Disclaimer, Accessibility).
- Backend API (`/api`): `GET /public-config`, `POST /contact-messages`, `POST /support-requests` — designed so native mobile apps can call the same endpoints as the website.

## User preferences

- User only knows Kotlin/Compose Multiplatform, not React — user has agreed the website stays React and Replit maintains it; user will not need to edit React code directly.
- User plans to eventually host the backend on Vercel instead of Replit. They asked for backend code to be structured portably (stateless Express handlers, config via env vars) but will handle actual Vercel setup, build config, and secrets themselves outside Replit.
- Do not surface backend/technical implementation details (architecture names, internal platform names) in any public-facing website copy — keep the site purely business-facing.

## Gotchas

- Workflow names shown in `listWorkflows()` are prefixed with the artifact path (e.g. `artifacts/web: web`), not just the service name — use the full prefixed name when restarting.
- After changing `lib/api-spec/openapi.yaml`, always rerun `pnpm --filter @workspace/api-spec run codegen` before using new hooks/schemas in either the server or the website.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
