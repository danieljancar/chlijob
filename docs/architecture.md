# Architecture

## Overview

This is a monorepo containing an Angular web application and Supabase backend infrastructure.

## Structure

```
chlijobs/
├── apps/web/        # Angular 21 + Angular Material frontend
├── supabase/        # Database migrations, seed data, edge functions
├── scripts/         # Developer utility scripts
├── docs/            # Project documentation
└── .github/         # CI workflows
```

## Frontend (apps/web)

- **Framework:** Angular 21 (standalone components)
- **UI:** Angular Material
- **Backend client:** `@supabase/supabase-js`
- **Environments:** `local` | `staging` | `production`

### Key files

| File                                        | Purpose                                           |
| ------------------------------------------- | ------------------------------------------------- |
| `src/environments/environment.ts`           | Local dev config                                  |
| `src/environments/environment.staging.ts`   | Staging config (tokens replaced at build time)    |
| `src/environments/environment.prod.ts`      | Production config (tokens replaced at build time) |
| `src/app/core/services/supabase.service.ts` | Singleton Supabase client                         |

## Backend (supabase/)

- **Local dev:** Docker via Supabase CLI (`supabase start`)
- **Staging:** Supabase cloud project
- **Production:** Supabase cloud project (separate project)

Migrations are plain SQL files in `supabase/migrations/`, applied in filename order.
Types are generated from the local schema into `apps/web/src/app/core/database.types.ts`.

## Environments

| Env        | Angular config | Supabase                   | Branch               |
| ---------- | -------------- | -------------------------- | -------------------- |
| Local      | `development`  | Docker (`localhost:54321`) | `develop`            |
| Staging    | `staging`      | Cloud project (TBD)        | `master`             |
| Production | `production`   | Cloud project (TBD)        | tag `v*` on `master` |

CD is not configured yet. See [deployment.md](deployment.md) for the planned setup.
