---
title: Rewrite getStudioBySlug to perform a database query
---

## Initial User Prompt

Rewrite getStudioBySlug to perform a database query
* File: src/db/queries.ts
* Current: loads all studios into memory using findMany(), then .find() in JS
* Needed: add a slug field to the Prisma schema and query using findFirst({ where: { slug } })

# Description

> **Required Skill**: You MUST use and analyse `prisma-slug-field` skill before doing any modification to task file or starting implementation of it!
>
> Skill location: `.claude/skills/prisma-slug-field/SKILL.md`

The `getStudioBySlug` function currently loads all studio records (with their associated halls) from the database into application memory, then iterates through the entire collection to find a match by computing slugs on-the-fly from localized studio names across three locales (ro, ru, en). This O(N) in-memory filtering pattern is inefficient: it transfers all rows from the database when only one is needed, consumes server memory proportional to the total number of studios, and spends CPU cycles computing slugs for every record on every request.

This refactor promotes the slug from a runtime-computed derived value to a persisted, indexed field on the Studio data model. With the slug stored directly in the database, the function can issue a targeted query that retrieves at most one record, reducing database bandwidth, memory usage, and CPU overhead. This directly improves page load times for users visiting studio pages via slug-based or convenience URLs, and positions the system for scalability as the studio catalog grows.

The change requires a schema migration to add the slug field, a data migration to populate slug values for all existing studios using the current slugification logic, and a rewrite of the `getStudioBySlug` function to query by the new field. The function's signature and return shape must remain identical so that existing callers in the page component continue to work without modification.

**Important behavioral change**: This refactor changes slug matching from multi-locale (currently checking slugs derived from ro, ru, and en names) to single canonical slug matching. [NEEDS CLARIFICATION: Which locale's studio name should be used to derive the canonical slug value -- Romanian (the default locale), English, or should multiple slug values be stored to preserve multi-locale matching?]

**Scope**:
- Included: Adding a slug field to the Studio data model, creating a database index on the slug field, running a data migration to populate slug values for all existing studio records, rewriting `getStudioBySlug` to query by slug field directly, maintaining backward-compatible function signature and return shape
- Excluded: Changes to URL routing or page component logic, slug fields on other models (e.g., Hall), slug management UI or admin tools, slug history or redirect tracking for renamed studios, unique constraint enforcement on slugs, changes to other query functions (listHalls, getStudioById, listHallRouteEntries)

**User Scenarios**:
1. **Primary Flow**: A user visits a studio page via a slug-based URL; the system queries the database directly for the matching slug and returns the studio with its halls, delivering faster page load than the current full-table-load approach.
2. **Alternative Flow**: A user visits with a slug that does not match any studio record; the function returns null and the caller handles the not-found case (no change in behavior from current implementation).
3. **Error Handling**: If the data migration encounters studios with names that produce identical slugs (collision) or empty/fallback slugs (e.g., Cyrillic-only names), the migration handles these gracefully without failing. For slug collisions at query time, the first matching record is returned.

---

## Acceptance Criteria

### Functional Requirements

- [ ] **Slug field on Studio model**: The Studio data model includes a persisted slug field that stores a pre-computed, URL-safe string value.
  - Given: The schema migration has been applied
  - When: A studio record is examined in the database
  - Then: It contains a slug field with a non-empty string value

- [ ] **Direct database query**: The `getStudioBySlug` function queries the database directly by slug value instead of loading all records into memory.
  - Given: A slug string is passed to the function
  - When: The function executes
  - Then: It issues a single targeted query filtering by the slug field, retrieving at most one studio record (not loading all studios)

- [ ] **Backward-compatible return shape**: The refactored function returns the same data structure as the current implementation.
  - Given: A valid slug and locale are provided to `getStudioBySlug`
  - When: The function finds a matching studio
  - Then: The returned object contains the studio with localized name and address fields, plus an array of halls each with localized name fields -- identical in structure to the current return value

- [ ] **Null for non-matching slug**: The function returns null when no studio matches the given slug.
  - Given: A slug value that does not correspond to any studio in the database
  - When: `getStudioBySlug` is called with that slug
  - Then: The function returns null

- [ ] **Data migration populates existing records**: All existing studio records have their slug field populated after migration.
  - Given: The database contains existing studio records without slug values
  - When: The data migration is executed
  - Then: Every studio record has a non-empty slug value derived from its name using the existing slugification logic

- [ ] **Database index on slug field**: The slug field is indexed for efficient lookups.
  - Given: The schema migration has been applied
  - When: The database index structure is inspected
  - Then: An index exists on the slug field of the Studio table

- [ ] **Existing callers unaffected**: The page component that calls `getStudioBySlug` continues to work without any modifications.
  - Given: The refactored function is deployed
  - When: A user accesses a studio page via a slug-based URL
  - Then: The page renders correctly with the expected studio data, and redirect logic functions as before

### Non-Functional Requirements

- [ ] **Query efficiency**: The slug-based lookup retrieves at most one studio record from the database per call, not the full table of studios
- [ ] **Data integrity**: After migration, no studio record has an empty or null slug value

### Definition of Done

- [ ] All acceptance criteria pass
- [ ] Slug field added to schema with database index
- [ ] Data migration tested against existing records
- [ ] Tests written and passing for the refactored function (happy path, null return, return shape)
- [ ] Existing page component verified to work without changes
- [ ] Code reviewed
