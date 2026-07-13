# Nexus Wave Technologies

A company website for Nexus Wave Technologies — an innovative tech company building accessible, high-performance digital solutions and mobile apps. Features a public site, blog, contact form, admin panel, Google Sign-In authentication, and real-time notifications.

## Run & Operate

- Workflows manage both services automatically (web on port 22333, API on port 8080)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string (auto-provisioned)

## Stack

- pnpm workspaces, Node.js 22, TypeScript 5.9
- Frontend: Vite + React + Tailwind CSS v4 + wouter (routing) + React Query
- API: Express 5 + Drizzle ORM + PostgreSQL
- Auth: Firebase / Google Sign-In (JWT-based)
- Validation: Zod, drizzle-zod
- API codegen: Orval (from OpenAPI spec in `lib/api-spec/openapi.yaml`)
- Build: esbuild (for API server)

## Where things live

- `artifacts/web/src/pages/` — all page components (Home, About, Apps, Blog, Contact, Admin, Tools, Login, legal/*)
- `artifacts/web/src/components/` — shared UI (Layout, Navbar, Footer, ChatbotWidget, etc.)
- `artifacts/web/src/context/AuthContext.tsx` — Firebase auth context
- `artifacts/api-server/src/routes/` — Express routes (auth, blog, contact, admin, notifications, etc.)
- `lib/api-spec/openapi.yaml` — single source of truth for API contracts
- `lib/db/src/schema/` — Drizzle schema (users, blog-posts, contact-messages, notifications, etc.)

## Architecture decisions

- Firebase Auth used for Google Sign-In on both web and mobile apps
- WebSocket at `/api/ws/notifications` for real-time push to mobile apps
- Public config endpoint (`/api/public-config`) returns company info + app list, safe to call without auth
- All secrets (Firebase service account, JWT secret) must be set as Replit Secrets

## Product

Nexus Wave Technologies website with: landing page, blog with categories/search, contact form, app showcase (Nexus Plus + Geeta Nexus), admin panel (manage blog/contacts/notifications), user auth via Google Sign-In, chatbot widget, devotional banner, and dark mode support.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Firebase Admin SDK needs `FIREBASE_SERVICE_ACCOUNT` (JSON string) as a Replit Secret
- JWT auth needs `JWT_SECRET` as a Replit Secret
- Run `pnpm --filter @workspace/db run push` after schema changes
- `.migration-backup/` artifacts are auto-discovered but should not be started — only `artifacts/*` are the live ones

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
