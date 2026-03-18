/*
  Warnings:

  - Added the required column `updatedAt` to the `Studio` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Studio" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT NOW();
ALTER TABLE "Studio" ALTER COLUMN "updatedAt" DROP DEFAULT;
