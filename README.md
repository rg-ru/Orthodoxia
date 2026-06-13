
# Orthodoxia

Orthodoxia is a calm digital Orthodox companion for prayer, reading, learning, and spiritual growth.

Live site:

https://rg-ru.github.io/Orthodoxia/

## Version 1.0 Direction

This repository follows the non-negotiable product rules:

- Orthodoxia is not a social media app.
- Every screen must help the user pray, learn, read, or grow spiritually.
- Content comes first, design second, technology third.
- No social feed, likes, followers, streaks, leaderboards, achievements, ads, or manipulative engagement patterns.

## Design System

- Typography: Inter
- Primary inspiration: Notion
- Secondary inspiration: Apple Books, Apple Settings, Headspace
- Light theme: white background, warm surface, black primary text, muted secondary text, blue accent
- Dark theme: near-black background, dark surface, white primary text, muted secondary text, blue accent
- Spacing uses the Orthodoxia scale: 4, 8, 12, 16, 24, 32, 48, 64
- Cards use 12px radius, large padding, clear hierarchy, and a soft shadow
- Icons use Material Symbols only

## Architecture

Features are organized feature-first:

```text
src/features/<feature>/
  presentation/
  domain/
  data/
```

The current online build is a static PWA prototype. Local data is intentionally small and should be reviewed by an Orthodox content owner before production use.

## Local Checks

```bash
npm test
npm run build
```

## Backend Foundation

Supabase database and connection-layer setup lives in `supabase/` and `src/features/backend/`.

- SQL migration: `supabase/migrations/20260613000000_initial_schema.sql`
- Auth connection layer: `src/features/auth/data/AuthRepository.js`
- Supabase client: `src/shared/supabaseClient.js`

Only publishable Supabase browser keys belong in client configuration. Never add a service role key to this repository or the shipped app.

## Deployment

The app deploys to GitHub Pages through `.github/workflows/pages.yml` on every push to `main`.
