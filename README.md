# chlijobs

Angular + Supabase monorepo.

## Stack

- **Frontend:** Angular 21 + Angular Material
- **Backend:** Supabase (Postgres, Auth, Storage, Edge Functions)
- **CI:** GitHub Actions

## Quick start

```bash
# First-time setup (installs deps, starts Supabase Docker stack)
npm run setup

# Start dev server
npm start
```

App → http://localhost:4200
Supabase Studio → http://localhost:54323

## Scripts

| Command                  | Description                             |
| ------------------------ | --------------------------------------- |
| `npm start`              | Start Angular dev server                |
| `npm run setup`          | First-time local setup                  |
| `npm run db:reset`       | Reset DB (migrations + seed)            |
| `npm run db:types`       | Regenerate TypeScript types from schema |
| `npm run supabase:start` | Start local Supabase stack              |
| `npm run supabase:stop`  | Stop local Supabase stack               |
| `npm run build:staging`  | Build for staging                       |
| `npm run build:prod`     | Build for production                    |

## Branches

| Branch    | Purpose                                     | Default |
| --------- | ------------------------------------------- | ------- |
| `develop` | Active development — all PRs target here    | Yes     |
| `staging` | Pre-production / QA — promoted from develop | No      |
| `master`  | Production — promoted from staging          | No      |

**Flow:** `develop` → `staging` → `master`

### CI

Runs on every PR targeting `develop`, `staging`, or `master`: lint → test → build (production).

### Releases

Triggered automatically on push to `staging` or `master`:

| Branch    | Tag                            | Type         |
| --------- | ------------------------------ | ------------ |
| `staging` | `v{version}-beta.{run_number}` | Pre-release  |
| `master`  | `v{version}`                   | Full release |

Version is read from `apps/web/package.json`. Release notes are auto-generated from commit history.

## Docs

- [Architecture](docs/architecture.md)
- [Local development](docs/local-dev.md)
- [Deployment](docs/deployment.md)
- [Contributing](docs/contributing.md)
