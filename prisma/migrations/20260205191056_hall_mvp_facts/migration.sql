-- AlterTable
ALTER TABLE "Hall" ADD COLUMN     "area_sqm" INTEGER,
ADD COLUMN     "equipment_available" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "props_available" BOOLEAN NOT NULL DEFAULT false;
