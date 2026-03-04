# studiosmap

Multilingual catalog of photo studios and halls in Chișinău.

`studiosmap` helps users find a hall by photos, price, district, and options, then open the studio page with the selected hall in focus.

## Features

- Locales: `ro` (default), `ru`, `en`
- Landing page on `/` with locale selector and CTA
- Catalog page with search, filters, sorting, and pagination
- Studio page with hall cards, gallery zoom, and contact CTAs
- Human-readable hall links: `/{locale}/studios/{studioSlug}/{hallSlug}`
- Canonical studio URLs: `/{locale}/studios/{id}-{studio-slug}` with redirect from legacy forms
- SEO metadata: canonical, hreflang, OpenGraph, Twitter
- JSON-LD `LocalBusiness` on studio pages
- GA4 events: `search_used`, `filter_used`, `hall_clicked`, `studio_contact_clicked`
- Middleware rate limiting and locale header propagation (`x-locale`)
- Robots policy with AI crawler blocking list

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

2. Configure environment
```bash
cp .env.example .env
```

3. Generate Prisma client
```bash
npm run prisma:generate
```

4. Apply local migrations
```bash
npx prisma migrate dev
```

5. Seed demo data (optional)
```bash
npm run db:seed
```

6. Start dev server
```bash
npm run dev
```

App runs at `http://localhost:3000`.

## Scripts

- `npm run dev` — local dev server
- `npm run lint` — ESLint
- `npm run build` — lint + production build
- `npm start` — start production server
- `npm run prisma:generate` — regenerate Prisma client
- `npm run db:migrate` — apply committed migrations (`prisma migrate deploy`)
- `npm run db:seed` — seed demo data

## Routes

- `/` — landing page
- `/{locale}` — localized catalog
- `/{locale}/studios/{id}-{studio-slug}` — canonical studio page
- `/{locale}/studios/{studio-slug}/{hall-slug}` — hall-friendly entry URL

Notes:

- Hall-friendly route resolves to the same studio page and focuses a selected hall.
- Hall-friendly URLs are convenience URLs; the canonical target remains the studio URL.

## Environment Variables

Defined in `.env.example`:

- `DATABASE_URL` (required)
- `NEXT_PUBLIC_SITE_URL` (recommended, used by SEO URLs)
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` (optional, enables GA4 script/events)

Also supported by middleware:

- `RATE_LIMIT_WINDOW_MS` (optional, default `60000`)
- `RATE_LIMIT_MAX_REQUESTS` (optional, default `240`)

## SEO Overview

- Root, catalog, and studio pages have localized metadata.
- `x-default` points to Romanian locale (`/ro`).
- `sitemap.xml` contains locale roots and canonical studio URLs.
- `robots.txt` allows regular crawlers and blocks listed AI crawlers.

## Project Structure

```text
src/
  app/
    layout.tsx
    page.tsx
    robots.ts
    sitemap.ts
    og-image/route.tsx
    [locale]/
      layout.tsx
      page.tsx
      CatalogTracking.client.tsx
      HallCardList.client.tsx
      studios/
        [studioSlug]/
          page.tsx
          HallCardList.client.tsx
          HallGalleryZoom.tsx
          StudioContacts.client.tsx
          [hallSlug]/page.tsx
  components/
    HallFocus.tsx
    LocaleSwitcher.tsx
    KofiOverlay.client.tsx
  db/
    prisma.ts
    queries.ts
  domain/
    ui-strings.ts
    dictionaries.ts
  seo/
    site.ts
    studio.ts
  lib/
    analytics.ts
    url.ts
middleware.ts
prisma/
  schema.prisma
  migrations/
  seed.ts
```

## Notes

- Current build passes with lint warnings only (`no-img-element`, unused eslint-disable in Prisma singleton).
- Rate limiting is best-effort in-memory per runtime instance.
- Keep migrations committed together with schema/code changes.
