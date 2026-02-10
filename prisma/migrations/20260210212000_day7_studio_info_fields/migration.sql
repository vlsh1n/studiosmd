-- AlterTable
ALTER TABLE "Studio"
ADD COLUMN "phone" TEXT,
ADD COLUMN "instagram_nickname" TEXT,
ADD COLUMN "google_maps_url" TEXT,
ADD COLUMN "yandex_maps_url" TEXT,
ADD COLUMN "logo_url" TEXT,
ADD COLUMN "working_hours_i18n" JSONB;

-- Migrate existing contacts JSON data into explicit columns
UPDATE "Studio"
SET
  "phone" = NULLIF(TRIM("contacts"->>'phone'), ''),
  "instagram_nickname" = NULLIF(
    TRIM(
      BOTH '@' FROM split_part(
        split_part(
          REGEXP_REPLACE(
            COALESCE("contacts"->>'instagram_nickname', "contacts"->>'instagram', ''),
            '^https?://(www\\.)?instagram\\.com/',
            '',
            'i'
          ),
          '?',
          1
        ),
        '/',
        1
      )
    ),
    ''
  ),
  "google_maps_url" = NULLIF(
    TRIM(COALESCE("contacts"->>'google_maps_url', "contacts"->>'google_maps', '')),
    ''
  ),
  "yandex_maps_url" = NULLIF(
    TRIM(COALESCE("contacts"->>'yandex_maps_url', "contacts"->>'yandex_maps', '')),
    ''
  ),
  "logo_url" = NULLIF(TRIM(COALESCE("contacts"->>'logo_url', '')), ''),
  "working_hours_i18n" = CASE
    WHEN jsonb_typeof(COALESCE("contacts"->'working_hours_i18n', "contacts"->'working_hours')) = 'object'
      THEN COALESCE("contacts"->'working_hours_i18n', "contacts"->'working_hours')
    ELSE NULL
  END;

-- AlterTable
ALTER TABLE "Studio" DROP COLUMN "contacts";
