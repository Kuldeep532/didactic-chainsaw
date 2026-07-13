---
name: Zod in api-server
description: How to correctly use zod in the api-server package
---

# Zod in api-server

## The rule
`zod` must be added as a direct dependency to `@workspace/api-server`. It is NOT transitive from `@workspace/api-zod`.

**Why:** pnpm hoisting does not guarantee transitive access. TypeScript module resolution fails with "Cannot find module 'zod'" if it's not in the package's own deps.

## How to apply
Run: `pnpm --filter @workspace/api-server add zod`

Then import as: `import { z } from "zod/v4";` (the v4 compat layer in zod 3.25+)

**v3 compat gotcha:** `z.record(z.unknown())` takes ONE argument in v4 but TWO in v3: `z.record(z.string(), z.unknown())`. Always use the two-argument form in api-server routes.
