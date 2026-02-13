ALTER TABLE "Hall"
  ADD COLUMN "cyclorama" BOOLEAN NOT NULL DEFAULT false;

UPDATE "Hall"
SET "cyclorama" = true
WHERE 'cyclorama' = ANY("tags");

UPDATE "Hall"
SET "tags" = array_remove("tags", 'cyclorama');
