# StudiosMD

Catalog of photo studio halls in Chisinau.

## Requirements
- Node.js 20+ (LTS recommended)
- npm 9+

## Local setup
```bash
npm i
npm run prisma:generate

# Use migrate dev for local development (creates/updates migration history)
# or run deploy-style migrations if you want to mirror production.
# Local dev:
npx prisma migrate dev
# Production-like:
npm run db:migrate

# Seed data (WARNING: may overwrite data)
npm run db:seed

npm run dev
```

## Quality and build
```bash
npm run lint
npm run build
```

`npm run build` runs lint first and then Next.js production build.

## Production
```bash
npm start
```

## Prisma notes
- `prisma migrate dev` is for local development. It creates new migrations and applies them to your local database.
- `prisma migrate deploy` is for production. It applies existing migrations without creating new ones.

## Routes
- `/` — landing (locale switch + CTA)
- `/ru`
- `/ro`
- `/en`
- `/{locale}/studios/[id]`

## Railway deploy
- Environment variables:
  - `DATABASE_URL` (required)
  - `NEXT_PUBLIC_SITE_URL` (optional)
  - `NEXT_PUBLIC_KOFI_URL` (optional)
- Build command: `npm run build`
- Start command: `npm start`
- Migrations: run `npm run db:migrate` during deploy (or manually)
- Seed: run `npm run db:seed` only when you need demo data (it may overwrite data)
