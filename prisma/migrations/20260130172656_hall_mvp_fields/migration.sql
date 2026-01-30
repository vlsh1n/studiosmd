-- CreateEnum
CREATE TYPE "Daylight" AS ENUM ('no', 'limited', 'yes');

-- CreateEnum
CREATE TYPE "VideoFriendly" AS ENUM ('no', 'limited', 'yes');

-- AlterTable
ALTER TABLE "Hall" ADD COLUMN     "daylight" "Daylight" NOT NULL DEFAULT 'no',
ADD COLUMN     "minimum_hours" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "video_friendly" "VideoFriendly" NOT NULL DEFAULT 'no',
ADD COLUMN     "weekend_price" INTEGER;
