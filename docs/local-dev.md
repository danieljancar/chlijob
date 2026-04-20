# Local Development

## Prerequisites

- **Node.js** 20+ (use [nvm](https://github.com/nvm-sh/nvm))
- **npm** 10+
- **Docker Desktop** (running)
- **Supabase CLI** — `brew install supabase/tap/supabase`
- **Angular CLI** — `npm install -g @angular/cli`

## First-time setup

```bash
npm run setup
```

This installs dependencies and starts the local Supabase Docker stack. Once it completes:

1. Copy the example env file:
   ```bash
   cp apps/web/.env.example apps/web/.env.local
   ```
2. Run `supabase status` (or check the output of `supabase start`) and copy the **Publishable key** into `.env.local`:
   ```
   SUPABASE_URL=http://127.0.0.1:54321
   SUPABASE_PUBLISHABLE_KEY=sb_publishable_XXXXXXXXX
   ```
3. Start the dev server:
   ```bash
   npm start
   ```

> The **Secret key** (`sb_secret_...`) is the equivalent of `service_role` — never put it in the frontend.

`environment.ts` is auto-generated from `.env.local` each time `npm start` runs (via `apps/web/scripts/set-env.js`). Do not edit it manually.

## Daily workflow

```bash
supabase start   # start local stack (if not running)
npm start        # Angular dev server
```

| Service         | URL                    |
| --------------- | ---------------------- |
| App             | http://localhost:4200  |
| Supabase Studio | http://127.0.0.1:54323 |
| Supabase API    | http://127.0.0.1:54321 |

## Pointing dev at the remote Supabase project

To develop against the production Supabase project instead of the local Docker stack, update `.env.local` with the remote values from Supabase dashboard → Project Settings → API:

```
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_PUBLISHABLE_KEY=eyJ...
```

Then run `npm start` as usual. The local Docker stack does not need to be running.

## Working with the database

```bash
# Apply pending migrations to the local DB
supabase migration up

# Reset local DB completely (re-runs all migrations + seed.sql)
npm run db:reset

# Create a new migration
supabase migration new <descriptive-name>
# Edit supabase/migrations/<timestamp>_<name>.sql, then:
supabase migration up

# Regenerate TypeScript types from local schema
npm run db:types
```

Always create a migration file for every schema change — never modify the DB directly.
Migration files must be committed alongside the code that depends on them.

## Useful commands

```bash
npm run supabase:status   # show local URLs and keys
npm run supabase:stop     # stop local Supabase stack
```
