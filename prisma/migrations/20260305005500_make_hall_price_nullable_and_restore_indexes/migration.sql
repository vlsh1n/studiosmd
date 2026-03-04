-- Make hall hourly price optional
ALTER TABLE "Hall"
  ALTER COLUMN "price_per_hour" DROP NOT NULL;

-- Restore performance indexes that were dropped in a previous migration
CREATE INDEX IF NOT EXISTS "Hall_price_per_hour_idx" ON "Hall"("price_per_hour");
CREATE INDEX IF NOT EXISTS "Hall_studioId_idx" ON "Hall"("studioId");
CREATE INDEX IF NOT EXISTS "Studio_district_key_idx" ON "Studio"("district_key");
CREATE INDEX IF NOT EXISTS "Hall_tags_gin_idx" ON "Hall" USING GIN ("tags");
