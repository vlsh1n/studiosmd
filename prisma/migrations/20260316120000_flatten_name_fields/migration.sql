-- Add flat string columns
ALTER TABLE "Studio" ADD COLUMN "name" TEXT;
ALTER TABLE "Studio" ADD COLUMN "address" TEXT;
ALTER TABLE "Studio" ADD COLUMN "working_hours" TEXT;
ALTER TABLE "Hall" ADD COLUMN "name" TEXT;

-- Backfill from en locale of JSON fields
UPDATE "Studio" SET
  "name"          = COALESCE(NULLIF(trim("name_i18n"->>'en'), ''), "name_i18n"->>'ro'),
  "address"       = COALESCE(NULLIF(trim("address_i18n"->>'en'), ''), "address_i18n"->>'ro'),
  "working_hours" = NULLIF(COALESCE(NULLIF(trim("working_hours_i18n"->>'en'), ''), NULLIF(trim("working_hours_i18n"->>'ro'), '')), '');

UPDATE "Hall" SET
  "name" = COALESCE(NULLIF(trim("name_i18n"->>'en'), ''), "name_i18n"->>'ro');

-- Set NOT NULL after backfill
ALTER TABLE "Studio" ALTER COLUMN "name" SET NOT NULL;
ALTER TABLE "Studio" ALTER COLUMN "address" SET NOT NULL;
ALTER TABLE "Hall" ALTER COLUMN "name" SET NOT NULL;

-- Recalculate Studio.slug from English name
UPDATE "Studio" SET "slug" = regexp_replace(
  regexp_replace(
    regexp_replace(lower(trim("name")), '[^a-z0-9]+', '-', 'g'),
    '^-+', ''
  ),
  '-+$', ''
);

-- Drop old i18n JSON columns
ALTER TABLE "Studio" DROP COLUMN "name_i18n";
ALTER TABLE "Studio" DROP COLUMN "address_i18n";
ALTER TABLE "Studio" DROP COLUMN "working_hours_i18n";
ALTER TABLE "Hall" DROP COLUMN "name_i18n";
