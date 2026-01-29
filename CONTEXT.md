# Project Context — studiosmd

## What this is
A multilingual (RU/RO/EN) directory for photo studios in Chișinău.
Studios have multiple halls (rooms) with different prices. MVP focuses on search/filter and studio pages.

## Stack
- Next.js (App Router) + TypeScript + Tailwind
- Prisma ORM + PostgreSQL
- Local dev: macOS
- Deployment later: Railway + Postgres

## i18n
Locales: ru, ro, en
Routing: locale is the first URL segment: /ru, /ro, /en

## Database (local)
PostgreSQL via Homebrew:
- Service: `brew services start postgresql@15`
- psql: `/opt/homebrew/opt/postgresql@15/bin/psql`
Local database name: `studios`
Local connection (no password): `postgresql://localhost:5432/studios`

IMPORTANT:
- `.env` is local only (never committed)
- `.env.example` is committed

## Prisma
Schema: `prisma/schema.prisma`
Commands:
- Format schema: `npx prisma format`
- Validate schema: `npx prisma validate`
- Run migration (creates tables): `npx prisma migrate dev --name init`
- Open DB UI: `npx prisma studio`

## Current state (end of Prompt B)
- Prisma + PostgreSQL datasource configured
- Models: `Studio`, `Hall`
- IDs are String with `cuid()`
- Enum: `DistrictKey` (botanica, ciocana, centru, buiucani, riscani)
- `.env` was removed from repo (should exist locally only)

## Working rules for Codex
- Always read this file first: `CONTEXT.md`
- Always show a plan first; do not apply changes until I confirm
- Keep changes minimal; no refactors unless requested
- No UI work during data-layer steps unless explicitly asked
