# Local Development

## Prerequisites

- **Node.js** 20+ (use [nvm](https://github.com/nvm-sh/nvm))
- **npm** 10+
- **Docker Desktop** (running)
- **Supabase CLI** — `brew install supabase/tap/supabase`
- **Angular CLI** — `npm install -g @angular/cli`

## First-time setup

```bash
bash scripts/setup-local.sh
```

This installs dependencies and starts the local Supabase stack. After it runs, `supabase start` prints something like:

```
╭─────────────┬──────────────────────────╮
│ Publishable │ sb_publishable_XXXXXXXXX │
│ Secret      │ sb_secret_XXXXXXXXXXXXXXX│
╰─────────────┴──────────────────────────╯
```

Copy the **Publishable key** into `apps/web/src/environments/environment.ts`:

```typescript
supabasePublishableKey: 'sb_publishable_XXXXXXXXX',
```

> The **Secret key** is the equivalent of the old `service_role` key — never put it in the frontend.

## Daily workflow

```bash
supabase start              # start local stack (if not running)
npm start --prefix apps/web # Angular dev server
```

| Service         | URL                    |
| --------------- | ---------------------- |
| App             | http://localhost:4200  |
| Supabase Studio | http://127.0.0.1:54323 |
| Supabase API    | http://127.0.0.1:54321 |

## Working with the database

```bash
# Apply pending migrations
supabase migration up

# Reset DB completely (re-runs all migrations + seed.sql)
supabase db reset

# Create a new migration
supabase migration new <descriptive-name>
# Edit supabase/migrations/<timestamp>_<name>.sql, then:
supabase migration up

# Regenerate TypeScript types from local schema
bash scripts/generate-types.sh
```

## Check current keys

```bash
supabase status
```

## Stopping

```bash
supabase stop
```
