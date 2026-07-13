---
name: Migration-backup artifacts auto-discovered
description: Replit auto-registers artifact.toml files inside .migration-backup/ as separate artifacts, creating duplicate workflows.
---

When the pnpm_workspace scaffold is applied during a Vercel import, the backup folder (`.migration-backup/`) contains artifact.toml files. Replit's artifact scanner auto-discovers these and registers them as live artifacts with their own managed workflows (e.g. `.migration-backup/artifacts/web: web`).

**Why:** The scanner walks all `.replit-artifact/artifact.toml` files in the repl, including inside `.migration-backup/`.

**How to apply:** These backup workflows will appear as NOT_STARTED and are safe to leave alone — never start them. The real services are always under `artifacts/*`. If confusing, the backup dir can be deleted after the port is verified complete.
