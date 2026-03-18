-- AlterTable: rename camelCase column to snake_case to match project convention
ALTER TABLE "Studio" RENAME COLUMN "updatedAt" TO "updated_at";
