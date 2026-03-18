import type { MetadataRoute } from "next";
import { prisma } from "@/db/prisma";
import { DEFAULT_LOCALE, LOCALES, absUrl, localePath } from "@/seo/site";
import { buildStudioPath } from "@/seo/studio";

export const dynamic = "force-dynamic";

function buildAlternates(path: string): Record<string, string> {
  return {
    ...Object.fromEntries(
      LOCALES.map((locale) => [locale, absUrl(localePath(locale, path))])
    ),
    "x-default": path ? absUrl(localePath(DEFAULT_LOCALE, path)) : absUrl("/"),
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const studios = await prisma.studio.findMany({
    select: {
      id: true,
      slug: true,
      updatedAt: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  const rootAlternates = buildAlternates("");
  const rootEntries: MetadataRoute.Sitemap = [
    {
      url: absUrl("/"),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      alternates: {
        languages: rootAlternates,
      },
    },
    ...LOCALES.map((locale) => ({
      url: absUrl(localePath(locale)),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      alternates: {
        languages: rootAlternates,
      },
    })),
  ];

  const studioEntries: MetadataRoute.Sitemap = studios.flatMap((studio) => {
    const studioPath = buildStudioPath(studio.slug);
    const studioAlternates = {
      ...Object.fromEntries(
        LOCALES.map((locale) => [locale, absUrl(localePath(locale, studioPath))])
      ),
      "x-default": absUrl(localePath(DEFAULT_LOCALE, studioPath)),
    };

    return LOCALES.map((locale) => ({
      url: absUrl(localePath(locale, studioPath)),
      lastModified: studio.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates: {
        languages: studioAlternates,
      },
    }));
  });

  return [...rootEntries, ...studioEntries];
}
