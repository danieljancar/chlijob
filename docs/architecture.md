# Architecture

## Overview

Monorepo containing an Angular web application and Supabase backend infrastructure.

## Structure

```
chlijobs/
├── apps/web/        # Angular 21 + Angular Material frontend
├── supabase/        # Database migrations, seed data
├── scripts/         # Developer utility scripts
├── docs/            # Project documentation
└── .github/         # CI/CD workflows
```

## Frontend (apps/web)

- **Framework:** Angular 21 (standalone components, `OnPush` change detection throughout)
- **UI:** Angular Material
- **i18n:** `@ngx-translate/core` with `de-CH` locale; category labels use slug-based keys
- **Backend client:** `@supabase/supabase-js` v2
- **Environments:** `local` (`.env.local`) | `production` (`environment.prod.ts`)

### Key files

| File                                        | Purpose                                                        |
| ------------------------------------------- | -------------------------------------------------------------- |
| `src/environments/environment.ts`           | Local dev config — generated from `.env.local` by `set-env.js` |
| `src/environments/environment.prod.ts`      | Production config — fill in remote Supabase URL and anon key   |
| `src/app/core/services/supabase.service.ts` | Singleton Supabase client                                      |
| `src/app/core/services/auth.service.ts`     | Session management, profile loading, auth state                |
| `src/app/core/services/contract.service.ts` | All job/contract/application data access                       |
| `src/app/core/types/`                       | Typed DB schema, domain types, shared constants                |

### Angular patterns

- All components are standalone — no NgModules
- Signals (`signal`, `computed`, `input`, `output`) used throughout; no RxJS in components
- Lazy-loaded routes via `loadComponent`
- `CategoryLabelPipe` resolves category slugs to translated labels; untranslated slugs are hidden
- `ImageCarouselComponent` is an inline component (no separate template/style files)

## Backend (supabase/)

- **Local dev:** Docker via Supabase CLI (`supabase start`)
- **Production:** Single remote Supabase cloud project

Migrations are plain SQL files in `supabase/migrations/`, applied in filename order.
TypeScript types are generated from the local schema into `src/app/core/types/database.types.ts`.

### Key DB design decisions

| Decision                                                    | Reason                                                                                            |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `accept_application` PL/pgSQL function (`security definer`) | Accepts one applicant and rejects others atomically, bypassing RLS for the multi-row update       |
| Profile data passed as `auth.signUp` metadata               | The `handle_new_user` trigger writes all fields atomically; no separate client-side upsert needed |
| `creator:profiles!creator_id(...)` PostgREST syntax         | Disambiguates the dual FK (`creator_id` / `taker_id`) both referencing `profiles`                 |
| Location filtering done client-side                         | `creator.location` is in the joined profile row, not on `contracts`; avoids a subquery            |

## Environments

| Env        | Angular config | Supabase                   | Branch    |
| ---------- | -------------- | -------------------------- | --------- |
| Local      | `development`  | Docker (`localhost:54321`) | `develop` |
| Production | `production`   | Remote cloud project       | `master`  |

To point the local dev server at the remote project instead of Docker, set the remote URL and anon key in `apps/web/.env.local`.
