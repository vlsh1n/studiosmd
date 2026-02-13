ALTER TABLE "Hall"
  ALTER COLUMN "daylight" DROP DEFAULT,
  ALTER COLUMN "daylight" TYPE BOOLEAN USING ("daylight"::text = 'yes'),
  ALTER COLUMN "daylight" SET DEFAULT false;

ALTER TABLE "Hall"
  RENAME COLUMN "props_available" TO "furniture";

ALTER TABLE "Hall"
  RENAME COLUMN "flash_available" TO "flash_light";

ALTER TABLE "Hall"
  RENAME COLUMN "continuous_available" TO "continuous_light";

ALTER TABLE "Hall"
  ADD COLUMN "blackout" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "parking" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "changing_room" BOOLEAN NOT NULL DEFAULT false;

UPDATE "Hall"
SET "blackout" = true
WHERE 'blackout' = ANY("tags");

UPDATE "Hall"
SET "parking" = true
WHERE 'parking' = ANY("tags");

UPDATE "Hall"
SET "changing_room" = true
WHERE 'changing_room' = ANY("tags");

UPDATE "Hall"
SET "tags" = array_remove(
  array_remove(
    array_remove(
      array_remove(
        array_remove(
          array_remove(
            array_remove("tags", 'daylight'),
          'blackout'),
        'parking'),
      'changing_room'),
    'furniture'),
  'flash_light'),
'continuous_light');

ALTER TABLE "Hall"
  DROP COLUMN "video_friendly";

DROP TYPE IF EXISTS "Daylight";
DROP TYPE IF EXISTS "VideoFriendly";
