# ChliJob

Swiss mini-job platform — Angular + Supabase monorepo.

## Stack

- **Frontend:** Angular 21 + Angular Material + ngx-translate
- **Backend:** Supabase (Postgres, Auth, Storage)
- **CI/CD:** GitHub Actions + Supabase GitHub Integration

## Quick start

```bash
# First-time setup (installs deps, starts local Supabase Docker stack)
npm run setup

# Start dev server
npm start
```

App → http://localhost:4200
Supabase Studio → http://localhost:54323

See [Local development](docs/local-dev.md) for the full workflow.

## Scripts

| Command                   | Description                             |
| ------------------------- | --------------------------------------- |
| `npm start`               | Start Angular dev server (local)        |
| `npm run setup`           | First-time local setup                  |
| `npm run build`           | Build (development)                     |
| `npm run build:prod`      | Build for production                    |
| `npm run db:reset`        | Reset local DB (migrations + seed)      |
| `npm run db:types`        | Regenerate TypeScript types from schema |
| `npm run supabase:start`  | Start local Supabase stack              |
| `npm run supabase:stop`   | Stop local Supabase stack               |
| `npm run supabase:status` | Show local Supabase URLs and keys       |

## Branches

| Branch    | Purpose                                  | Default |
| --------- | ---------------------------------------- | ------- |
| `develop` | Active development — all PRs target here | Yes     |
| `master`  | Production — promoted from `develop`     | No      |

**Flow:** `develop` → `master`

## CI/CD

### CI — runs on every PR to `develop` or `master`

lint → test → build (production config)

### On push to `master`

| What           | How                                                            |
| -------------- | -------------------------------------------------------------- |
| DB migrations  | Supabase GitHub Integration (configured in Supabase dashboard) |
| GitHub release | `release.yml` — creates a release tagged `v{version}`          |

Version is read from `apps/web/package.json`. Release notes are auto-generated from commit history.

## Docs

- [Architecture](docs/architecture.md)
- [Local development](docs/local-dev.md)
- [Deployment](docs/deployment.md)
- [Contributing](docs/contributing.md)
