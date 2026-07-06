---
name: Admin Route Protection Pattern
description: Correct way to protect admin routes — per-route middleware, not router.use()
---

# Admin Route Protection

## The rule
Apply `attachAuth` and `requireAdmin` as **per-route middleware tuples**, not as `router.use()`.

**Why:** When `router.use(requireAdmin)` is used at the router level and the router is mounted without a path prefix (`router.use(adminRouter)`), the requireAdmin middleware runs for EVERY request entering the router — including requests destined for other routers mounted after it — because Express passes the request through before route matching. This caused the public gateway to return 401.

## How to apply
```typescript
const guard = [attachAuth, requireAdmin] as const;

router.get("/admin/contact-messages", ...guard, async (req, res) => { ... });
router.post("/admin/scrape-blog", ...guard, async (req, res) => { ... });
```

Alternative: mount the admin router under a path prefix (`router.use("/admin", adminRouter)`) and strip `/admin` from all route paths. Either approach works; per-route is more explicit.
