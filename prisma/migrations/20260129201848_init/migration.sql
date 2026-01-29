-- CreateEnum
CREATE TYPE "DistrictKey" AS ENUM ('botanica', 'ciocana', 'centru', 'buiucani', 'riscani');

-- CreateTable
CREATE TABLE "Studio" (
    "id" TEXT NOT NULL,
    "name_i18n" JSONB NOT NULL,
    "address_i18n" JSONB NOT NULL,
    "district_key" "DistrictKey" NOT NULL,
    "cover_images" JSONB NOT NULL,
    "contacts" JSONB NOT NULL,

    CONSTRAINT "Studio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hall" (
    "id" TEXT NOT NULL,
    "studioId" TEXT NOT NULL,
    "name_i18n" JSONB NOT NULL,
    "images" JSONB NOT NULL,
    "size_m2" INTEGER,
    "tags" TEXT[],
    "price_per_hour" INTEGER NOT NULL,

    CONSTRAINT "Hall_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Hall" ADD CONSTRAINT "Hall_studioId_fkey" FOREIGN KEY ("studioId") REFERENCES "Studio"("id") ON DELETE CASCADE ON UPDATE CASCADE;
