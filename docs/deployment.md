# Deployment

## Branch → environment mapping

| Branch    | Environment | Supabase project              |
| --------- | ----------- | ----------------------------- |
| `develop` | Local / dev | Docker (`localhost:54321`)    |
| `master`  | Production  | Remote Supabase cloud project |

## On push to `master`

### Database migrations — Supabase GitHub Integration

Migrations are applied automatically via the **Supabase GitHub Integration** (configured in Supabase dashboard → Settings → Integrations → GitHub Integration). The `master` branch is connected to the production project — on every push, Supabase runs `supabase db push` automatically. No GitHub Actions secrets or workflow file required.

### GitHub release — `release.yml`

Creates a GitHub release tagged `v{version}` with auto-generated release notes from commit history. Version is read from `apps/web/package.json`.

## Production build

The production Angular build uses `apps/web/src/environments/environment.prod.ts`. Fill in the values from Supabase dashboard → Project Settings → API:

```typescript
export const environment = {
  production: true,
  supabaseUrl: 'https://your-project-ref.supabase.co',
  supabasePublishableKey: 'eyJ...',
};
```

The anon/publishable key is safe to commit — it is a public key by design and is protected by RLS on the database.

```bash
npm run build:prod   # outputs to apps/web/dist/web/
```

## Hosting

No hosting provider is configured yet. The `dist/web/` output is a standard static SPA bundle and can be deployed to any static host (Vercel, Netlify, Cloudflare Pages, etc.).

The host must be configured to serve `index.html` for all routes (SPA fallback).
