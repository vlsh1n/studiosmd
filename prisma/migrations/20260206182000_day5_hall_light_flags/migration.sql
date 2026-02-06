-- AlterTable
ALTER TABLE "Hall" ADD COLUMN     "flash_available" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "continuous_available" BOOLEAN NOT NULL DEFAULT false;
