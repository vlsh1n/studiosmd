ALTER TABLE "Hall"
  ALTER COLUMN "high_ceiling" DROP DEFAULT,
  ALTER COLUMN "high_ceiling" DROP NOT NULL,
  ALTER COLUMN "high_ceiling" TYPE INTEGER
  USING (CASE WHEN "high_ceiling" = true THEN 4 ELSE NULL END);
