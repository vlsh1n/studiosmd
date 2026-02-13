import type { MetadataRoute } from "next";
import { prisma } from "@/db/prisma";
import { LOCALES, absUrl, localePath } from "@/seo/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const studios = await prisma.studio.findMany({
    select: {
      id: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  const rootEntries: MetadataRoute.Sitemap = [
    { url: absUrl("/"), lastModified: now },
    ...LOCALES.map((locale) => ({
      url: absUrl(localePath(locale)),
      lastModified: now,
    })),
  ];

  const studioEntries: MetadataRoute.Sitemap = studios.flatMap((studio) =>
    LOCALES.map((locale) => ({
      url: absUrl(localePath(locale, `/studios/${studio.id}`)),
      lastModified: now,
    }))
  );

  return [...rootEntries, ...studioEntries];
}
