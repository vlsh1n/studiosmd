import type { MetadataRoute } from "next";
import { prisma } from "@/db/prisma";
import { DEFAULT_LOCALE, LOCALES, absUrl, localePath } from "@/seo/site";

export const dynamic = "force-dynamic";

function buildAlternates(path: string): Record<string, string> {
  return {
    ...Object.fromEntries(
      LOCALES.map((locale) => [locale, absUrl(localePath(locale, path))])
    ),
    "x-default": absUrl(localePath(DEFAULT_LOCALE, path)),
  };
}

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

  const rootAlternates = buildAlternates("");
  const rootEntries: MetadataRoute.Sitemap = LOCALES.map((locale) => ({
    url: absUrl(localePath(locale)),
    lastModified: now,
    alternates: {
      languages: rootAlternates,
    },
  }));

  const studioEntries: MetadataRoute.Sitemap = studios.flatMap((studio) => {
    const path = `/studios/${studio.id}`;
    const studioAlternates = buildAlternates(path);
    return LOCALES.map((locale) => ({
      url: absUrl(localePath(locale, path)),
      lastModified: now,
      alternates: {
        languages: studioAlternates,
      },
    }));
  });

  return [...rootEntries, ...studioEntries];
}
