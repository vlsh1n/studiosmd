-- Enable unaccent extension for diacritic stripping
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Add nullable first to allow backfill
ALTER TABLE "Studio" ADD COLUMN "slug" TEXT;

-- Backfill from ro locale name, replicating slugifyStudioName JS logic:
--   1. trim
--   2. translate: explicit mapping for Romanian comma-below chars (ș/ț and their
--      cedilla look-alikes) which are absent from PostgreSQL's default unaccent.rules
--   3. lower
--   4. unaccent (strips remaining combining marks: ă→a, â→a, î→i, etc.)
--   5. replace non-alphanumeric runs with hyphen
--   6. strip leading hyphens (separate call — 'g' + '$' anchor is unreliable in PG)
--   7. strip trailing hyphens (separate call)
--   8. collapse repeated hyphens
--   9. fallback to 'studio' if result is empty
UPDATE "Studio"
SET "slug" = COALESCE(
  NULLIF(
    regexp_replace(
      regexp_replace(
        regexp_replace(
          regexp_replace(
            unaccent(lower(translate(
              trim("name_i18n"->>'ro'),
              'șȘțȚşŞţŢ',
              'sStTsStT'
            ))),
            '[^a-z0-9]+', '-', 'g'
          ),
          '^-+', ''
        ),
        '-+$', ''
      ),
      '-{2,}', '-', 'g'
    ),
    ''
  ),
  'studio'
);

-- Enforce NOT NULL and UNIQUE
ALTER TABLE "Studio" ALTER COLUMN "slug" SET NOT NULL;
CREATE UNIQUE INDEX "Studio_slug_key" ON "Studio"("slug");
