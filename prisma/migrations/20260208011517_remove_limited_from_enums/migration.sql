CREATE TYPE "Daylight_new" AS ENUM ('no', 'yes');
CREATE TYPE "VideoFriendly_new" AS ENUM ('no', 'yes');

ALTER TABLE "Hall" ALTER COLUMN "daylight" DROP DEFAULT;
ALTER TABLE "Hall" ALTER COLUMN "video_friendly" DROP DEFAULT;

ALTER TABLE "Hall"
  ALTER COLUMN "daylight" TYPE "Daylight_new"
  USING ("daylight"::text::"Daylight_new"),
  ALTER COLUMN "video_friendly" TYPE "VideoFriendly_new"
  USING ("video_friendly"::text::"VideoFriendly_new");

DROP TYPE "Daylight";
DROP TYPE "VideoFriendly";

ALTER TYPE "Daylight_new" RENAME TO "Daylight";
ALTER TYPE "VideoFriendly_new" RENAME TO "VideoFriendly";

ALTER TABLE "Hall" ALTER COLUMN "daylight" SET DEFAULT 'no'::"Daylight";
ALTER TABLE "Hall" ALTER COLUMN "video_friendly" SET DEFAULT 'no'::"VideoFriendly";
