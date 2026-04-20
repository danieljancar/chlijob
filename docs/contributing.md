# Contributing

## Branching

| Branch                  | Purpose                                                     |
| ----------------------- | ----------------------------------------------------------- |
| `develop`               | Default branch — all feature/fix PRs target here            |
| `master`                | Production — promoted from `develop` when ready for release |
| `feature/<description>` | New features                                                |
| `fix/<description>`     | Bug fixes                                                   |

## Workflow

1. Branch off `develop`
2. Make your changes
3. Open a PR against `develop`
4. CI runs lint, tests, and a production build check
5. Merge after review
6. When ready to release, open a PR from `develop` → `master`

Merging to `master` triggers the Supabase GitHub Integration (runs DB migrations) and the `release.yml` workflow (creates a GitHub release).

## Database changes

Always use migrations — never modify the DB directly.

```bash
supabase migration new <descriptive-name>
# Edit the generated file in supabase/migrations/
npm run db:reset       # apply locally and reset seed data
npm run db:types       # regenerate TypeScript types
```

Commit migration files alongside the code changes that require them.

## Code style

- Angular: standalone components, `OnPush` change detection, signals — no `ngModel`, no `async` pipe
- SCSS: component-scoped styles; global styles in `src/styles.scss`
- i18n: all user-visible strings go through `TranslatePipe` with `de-CH.json` keys
- No secrets in source code — use `.env.local` for local dev, `environment.prod.ts` for production

## Commit messages

Follows [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add image carousel to job cards
fix: profile data not saved on registration
chore: update Angular to 21.3
```

Enforced by commitlint on commit.
