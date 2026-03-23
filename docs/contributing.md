# Contributing

## Branching

| Branch                  | Purpose                                                     |
| ----------------------- | ----------------------------------------------------------- |
| `develop`               | Default branch — all feature/fix PRs target here            |
| `staging`               | Pre-production — promoted from `develop` when ready for QA  |
| `master`                | Production — promoted from `staging` when ready for release |
| `feature/<description>` | New features                                                |
| `fix/<description>`     | Bug fixes                                                   |

## Workflow

1. Branch off `develop`
2. Make your changes
3. Open a PR against `develop`
4. CI runs lint, tests, and a build check
5. Merge after review
6. When ready to promote to staging, open a PR from `develop` → `master`

## Database changes

Always use migrations — never modify the DB directly.

```bash
supabase migration new <descriptive-name>
# Edit the generated file in supabase/migrations/
supabase db reset              # apply locally
bash scripts/generate-types.sh # update TypeScript types
```

Commit migration files alongside the code changes that require them.

## Code style

- Angular: standalone components, `OnPush` change detection
- SCSS: component-scoped styles, global styles in `src/styles/`
- No secrets in source code — use environment files
