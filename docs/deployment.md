# Deployment

> CD is not configured yet. This document describes the intended setup for when it is added.

## Branch → Environment mapping

| Branch / Trigger         | Environment | Supabase project                 |
| ------------------------ | ----------- | -------------------------------- |
| `develop`                | Local / dev | Docker (`localhost:54321`)       |
| `master`                 | Staging     | Cloud project (to be configured) |
| Git tag `v*` on `master` | Production  | Cloud project (to be configured) |

## Planned CI/CD setup

When CD is added, the workflows will:

1. **Staging** — trigger on push to `master`, inject secrets, build with `--configuration=staging`, push DB migrations, deploy to hosting
2. **Production** — trigger on tag `v*`, inject secrets, build with `--configuration=production`, push DB migrations, deploy to hosting

Environment variables (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, etc.) will be stored as
GitHub Actions secrets scoped to their respective GitHub Environments (`staging`, `production`).

## Manual builds

```bash
npm run build:staging   # build with staging config
npm run build:prod      # build with production config
```

## Hosting provider

> [!WARNING]
> Add the deploy step to `.github/workflows/deploy-staging.yml` and `deploy-production.yml` when ready.
