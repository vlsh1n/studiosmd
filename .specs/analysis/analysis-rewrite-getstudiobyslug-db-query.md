---
title: Codebase Impact Analysis - Rewrite getStudioBySlug to perform a database query
task_file: .specs/tasks/draft/rewrite-getstudiobyslug-db-query.refactor.md
scratchpad: .specs/scratchpad/6b845624.md
created: 2026-03-15
status: complete
---

# Codebase Impact Analysis: Rewrite getStudioBySlug to perform a database query

## Summary

- **Files to Modify**: 4 files
- **Files to Create**: 1 migration file
- **Files to Delete**: 0 files
- **Test Files Affected**: 0 (no test infrastructure exists)
- **Risk Level**: Medium — requires a schema migration with backfill of existing data

---

## Files to be Modified/Created

### Primary Changes

```
prisma/
├── schema.prisma                          # UPDATE: add slug field to Studio model + index
├── migrations/
│   └── <timestamp>_add_studio_slug/
│       └── migration.sql                  # NEW: ALTER TABLE + backfill + unique index
└── seed.ts                                # UPDATE: StudioSeed type + studio.create data

src/
└── db/
    └── queries.ts                         # UPDATE: rewrite getStudioBySlug body
```

### Secondary Changes

```
src/
└── app/
    └── [locale]/
        └── studios/
            └── [studioSlug]/
                └── page.tsx               # REVIEW: resolveStudioRoute() callers may need
                                           # slug normalization before calling the new function
```

---

## Useful Resources for Implementation

### Pattern References

```
src/
└── db/
    └── queries.ts
        ├── getStudioById (lines 172-205)   # Direct DB lookup pattern to replicate exactly
        └── getStudioBySlug (lines 207-250) # Current implementation to replace
```

---

## Key Interfaces & Contracts

### Functions/Methods to Modify

| Location | Name | Current Signature | Change Required |
|----------|------|-------------------|-----------------|
| `src/db/queries.ts:207` | `getStudioBySlug` | `async (slug: string, locale: Locale): Promise<...>` | Replace `findMany()` + JS `.find()` with `prisma.studio.findFirst({ where: { slug } })` |

### Classes/Components Affected

| Location | Name | Description | Change Required |
|----------|------|-------------|-----------------|
| `prisma/schema.prisma:24` | `Studio` model | Prisma model definition | Add `slug String @unique` field and `@@index([slug])` |
| `prisma/seed.ts:25` | `StudioSeed` | Type definition for seed data | Add `slug: string` field |
| `prisma/seed.ts:410` | `prisma.studio.create` | Studio seed creation loop | Add `slug` value to each studio's data object |

### Types/Interfaces to Update

| Location | Name | Fields Affected | Change Required |
|----------|------|-----------------|-----------------|
| `prisma/schema.prisma:24-38` | `Studio` Prisma model | New field | Add `slug String @unique` |
| `prisma/seed.ts:25-36` | `StudioSeed` | New field | Add `slug: string` |

---

## Integration Points

| File | Relationship | Impact | Action Needed |
|------|--------------|--------|---------------|
| `src/app/[locale]/studios/[studioSlug]/page.tsx:264-332` | Calls `getStudioBySlug` at lines 286 and 305 | High | Verify that the slug string passed in matches what will be stored in the DB. If storing only the ro-locale slug, callers may need to normalize to ro before querying. |
| `src/seo/studio.ts:3-13` | `slugifyStudioName` used both to compute slugs and in current runtime matching | Medium | Will be used at write time (seed/migration backfill) rather than read time. No interface change needed but behavior dependency shifts. |

### Critical Design Decision

The current `getStudioBySlug` implementation tries ro, ru, and en slug variants in-memory (lines 227-234). With a single `slug String @unique` column, only one value is stored per studio. Two valid approaches:

**Option A — Single String (matches task wording exactly)**:
- Store the Romanian (default locale) slug: `slug = slugifyStudioName(name_i18n.ro)`
- Query: `prisma.studio.findFirst({ where: { slug } })`
- Callers at page.tsx:286 and page.tsx:305 must pass a slug derived from the ro locale name, or the calling code must be updated to try the ro-normalized form
- Simplest schema; risk: existing cross-locale fallback URLs using ru/en slugs would stop working

**Option B — String Array**:
- Store all locale slugs: `slugs String[]` with GIN index
- Query: `prisma.studio.findFirst({ where: { slugs: { has: slug } } })`
- Preserves current cross-locale slug matching
- More complex schema but zero behavior regression

The task description says `findFirst({ where: { slug } })` using a single `slug` variable, indicating Option A is the intent.

---

## Similar Implementations

### Pattern: getStudioById

- **Location**: `src/db/queries.ts:172-205`
- **Why relevant**: Already uses `findUnique({ where: { id } })` with halls included — the exact structural pattern to replicate for slug-based lookup
- **Key files**:
  - `src/db/queries.ts:172-205` — copy the include/orderBy/mapping structure verbatim; swap `findUnique` for `findFirst` and `where: { id }` for `where: { slug } `

---

## Test Coverage

### Existing Tests to Update

None — the project has no test files outside `node_modules`.

### New Tests Needed

| Test Type | Location | Coverage Target |
|-----------|----------|-----------------|
| Integration | `src/db/queries.test.ts` (new) | `getStudioBySlug` returns correct studio for stored slug; returns null for unknown slug |

---

## Risk Assessment

### High Risk Areas

| Area | Risk | Mitigation |
|------|------|------------|
| Migration backfill | Existing Studio rows have no `slug` value. If `slug` is `NOT NULL UNIQUE`, migration must populate values before applying constraint. Slug computation in SQL must match `slugifyStudioName` JS logic. | Generate slug values in the migration SQL using `regexp_replace` + `lower()` chain, or use a temporary nullable column, populate, then add constraint. |
| Unique constraint collision | Two studios might have identical slugs (e.g., same name in different locales). | Verify seed data and existing data for duplicates before applying `UNIQUE`. |
| Caller behavior change | `resolveStudioRoute` at page.tsx:286 passes the raw URL segment to `getStudioBySlug`. If segment was previously matched by an ru/en slug, it will now return null. | Decide whether cross-locale slug fallback must be preserved; if yes, use Option B (String array). |

---

## Recommended Exploration

Before implementation, developer should read:

1. `/Users/the.voloshin/VSCode/studiosmd/src/db/queries.ts` lines 172-250 — compare `getStudioById` (target pattern) with current `getStudioBySlug` (to be replaced)
2. `/Users/the.voloshin/VSCode/studiosmd/src/seo/studio.ts` lines 1-14 — understand `slugifyStudioName` exactly, needed to replicate the transformation in migration SQL
3. `/Users/the.voloshin/VSCode/studiosmd/src/app/[locale]/studios/[studioSlug]/page.tsx` lines 264-332 — understand how both call sites use `getStudioBySlug` to assess whether caller updates are needed
4. `/Users/the.voloshin/VSCode/studiosmd/prisma/seed.ts` lines 25-36 and 397-427 — understand the StudioSeed type and studio create loop that must include the new slug field
5. `/Users/the.voloshin/VSCode/studiosmd/prisma/migrations/20260305005500_make_hall_price_nullable_and_restore_indexes/migration.sql` — reference for migration file style used in this project

---

## Verification Summary

| Check | Status | Notes |
|-------|--------|-------|
| All affected files identified | ✅ | 4 modify + 1 create |
| Integration points mapped | ✅ | 2 call sites in page.tsx + slugifyStudioName dependency |
| Similar patterns found | ✅ | `getStudioById` at queries.ts:172 is the direct reference pattern |
| Test coverage analyzed | ✅ | No tests exist in project |
| Risks assessed | ✅ | Migration backfill, unique collision, cross-locale behavior change |

Limitations/Caveats: The design decision between single-slug (String) and multi-slug (String[]) storage is not resolved by the codebase — it is a product/implementation decision. The task wording implies single String; the existing runtime behavior implies multi-value. This must be explicitly decided before implementation begins.
