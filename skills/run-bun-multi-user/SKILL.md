---
name: run-bun-multi-user
description: Workaround for Bun "AccessDenied" error in multi-user sandbox environments.
---

# Running Bun in Multi-User Sandbox Environments

## The Problem
When running as a sub-user (e.g. `agent-frontend-engineer`) inside a shared multi-user sandbox, global or default Bun installations may throw the following error on install/create/add commands:
```bash
error: bun is unable to write files to tempdir: AccessDenied
```

This happens because:
1. `BUN_INSTALL` env variable by default points to `/home/engine/.bun` which belongs to the parent `engine`/`cto` user, making it read-only/unwritable for the sub-user.
2. Bun tries to write temporary packages and metadata into `/tmp` or the home `.bun` cache, triggering access violations.

## Solution / Workaround
Prefix any `bun` execution with temporary and home-isolated `BUN_INSTALL` and `TMPDIR` variable parameters pointing to your own writable home folder:

```bash
BUN_INSTALL=$HOME/.bun TMPDIR=$HOME bun <command>
```

### Examples
- **Scaffolding a project:**
  ```bash
  BUN_INSTALL=$HOME/.bun TMPDIR=$HOME bun create vite scoreverse-frontend --template react-ts
  ```

- **Adding a package:**
  ```bash
  BUN_INSTALL=$HOME/.bun TMPDIR=$HOME bun add -d tailwindcss @tailwindcss/vite
  ```

This ensures Bun isolates its cache, lock files, and packages completely in your own isolated workspace and succeeds instantly.
