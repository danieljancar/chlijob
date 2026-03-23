# chlijobs — Web

Angular 21 frontend for the chlijobs platform.

## Stack

- **Angular 21** — standalone components, signals, OnPush change detection
- **Angular Material M3** — single-palette theming (`mat.$violet-palette`)
- **Supabase** — Auth, Postgres, Storage
- **@ngx-translate/core** — i18n

## Development

### Prerequisites

- Node.js 20+
- npm

### Install

```bash
npm install
```

### Environment

Local development uses a `.env.local` file that is **gitignored**. Copy the example and fill in your values:

```bash
cp .env.example .env.local
```

Then add your local Supabase credentials (get them from `supabase status`):

```
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_PUBLISHABLE_KEY=<your local publishable key>
```

`npm start` runs `scripts/set-env.js` first, which reads `.env.local` and writes `src/environments/environment.ts`. It fails fast if the file is missing or keys are empty.

Staging and production environment files (`environment.staging.ts`, `environment.prod.ts`) are hardcoded and committed — they are used by CI builds and never contain local credentials.

### Run

```bash
npm start
```

Open `http://localhost:4200`.

### Lint / Test / Build

```bash
npm run lint
npm run test -- --watch=false --browsers=ChromeHeadless
npm run build -- --configuration=production
```

## Project Structure

```
src/app/
├── core/           # Guards, models, services (auth, notification, supabase)
├── layout/
│   ├── public/     # PublicLayoutComponent — navbar + footer wrapping public routes
│   └── app/        # AppLayoutComponent — sidenav shell for authenticated routes
├── pages/
│   ├── public/     # Home, About, Legal (Terms, Privacy)
│   ├── auth/       # Login, Register
│   └── app/        # Dashboard, Jobs, Orders, Search, Profile
└── shared/
    └── components/ # Reusable: UserAvatarComponent, ImageUploaderComponent
```

## Commit Convention

[Conventional Commits](https://www.conventionalcommits.org/) — enforced via commitlint + Husky.

```
feat: add job filter
fix: correct avatar upload path
```
