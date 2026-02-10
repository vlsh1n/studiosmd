# StudiosMD

A multilingual catalog of photo studio halls in Chisinau.

StudiosMD helps users quickly find a hall by price, district, tags, and key hall facts, then jump directly to the studio page with the selected hall in focus.

## What You Get

- Locale-aware UI (`ru`, `ro`, `en`)
- Catalog with search, filters, sorting, and pagination
- Studio page with hall list and deep-link focus (`?hallId=...`)
- Hall gallery (inline carousel + fullscreen modal)
- PostgreSQL + Prisma data layer with production migrations

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS v4
- Prisma + PostgreSQL
- Framer Motion + Embla Carousel

## Requirements

- Node.js 20+
- npm 9+
- PostgreSQL

## Quick Start

1. Install dependencies
```bash
npm i
```

2. Generate Prisma client
```bash
npm run prisma:generate
```

3. Configure environment
```bash
cp .env.example .env
```
Set `DATABASE_URL` in `.env`.

4. Apply local migrations
```bash
npx prisma migrate dev
```

5. Seed demo data (optional)
```bash
npm run db:seed
```

6. Run development server
```bash
npm run dev
```

App will be available at `http://localhost:3000`.

## Scripts

- `npm run dev` — start local dev server
- `npm run lint` — run ESLint
- `npm run build` — run lint and production build
- `npm start` — start production server
- `npm run prisma:generate` — regenerate Prisma client
- `npm run db:migrate` — apply existing migrations (`prisma migrate deploy`)
- `npm run db:seed` — run seed script

## Routes

- `/` — landing page (locale switch + CTA)
- `/ru`, `/ro`, `/en` — localized catalog
- `/{locale}/studios/[id]` — studio details page

## Environment Variables

Defined in `.env.example`:

- `DATABASE_URL` (required)
- `NEXT_PUBLIC_SITE_URL` (optional)

## Database Workflow

### Local development

Use:
```bash
npx prisma migrate dev
```

### Production deployment

Use:
```bash
npm run db:migrate
```
This applies committed migrations without creating new ones.

## Railway Deployment

Recommended settings:

- Build command: `npm run build`
- Start command: `npm start`
- Migration step: `npm run db:migrate`
- Seed: run `npm run db:seed` only when explicitly needed

## Project Structure

```text
src/
  app/
    page.tsx                          # landing
    [locale]/page.tsx                 # catalog
    [locale]/layout.tsx               # locale shell
    [locale]/studios/[id]/page.tsx    # studio page
  db/
    prisma.ts                         # Prisma client singleton
    queries.ts                        # query layer
  domain/
    ui-strings.ts                     # localized UI copy
    dictionaries.ts                   # districts/tags dictionaries
  lib/
    url.ts                            # safeExternalUrl helper
prisma/
  schema.prisma
  migrations/
  seed.ts
```

## Notes

- `npm run build` currently passes with lint warnings (no lint errors).
- If schema changes, always commit migrations together with code.
- For a full technical state snapshot, see `techspec.md`.
