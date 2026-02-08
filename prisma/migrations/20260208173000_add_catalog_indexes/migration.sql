CREATE INDEX IF NOT EXISTS "Hall_price_per_hour_idx" ON "Hall"("price_per_hour");
CREATE INDEX IF NOT EXISTS "Hall_studioId_idx" ON "Hall"("studioId");
CREATE INDEX IF NOT EXISTS "Studio_district_key_idx" ON "Studio"("district_key");
CREATE INDEX IF NOT EXISTS "Hall_tags_gin_idx" ON "Hall" USING GIN ("tags");
