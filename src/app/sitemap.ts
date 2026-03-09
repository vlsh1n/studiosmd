import type { MetadataRoute } from "next";
import { prisma } from "@/db/prisma";
import type { Locale } from "@/i18n";
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

function getLocalizedStudioName(nameI18n: unknown, locale: Locale, fallback: string) {
  if (!nameI18n || typeof nameI18n !== "object") {
    return fallback;
  }

  const localizedValue = (nameI18n as Record<string, unknown>)[locale];
  if (typeof localizedValue !== "string") {
    return fallback;
  }

  const trimmed = localizedValue.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const studios = await prisma.studio.findMany({
    select: {
      id: true,
      name_i18n: true,
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
      alternates: {
        languages: rootAlternates,
      },
    },
    ...LOCALES.map((locale) => ({
      url: absUrl(localePath(locale)),
      lastModified: now,
      alternates: {
        languages: rootAlternates,
      },
    })),
  ];

  const studioEntries: MetadataRoute.Sitemap = studios.flatMap((studio) => {
    const studioPaths = Object.fromEntries(
      LOCALES.map((locale) => [
        locale,
        buildStudioPath(
          studio.id,
          getLocalizedStudioName(studio.name_i18n, locale, studio.id)
        ),
      ])
    ) as Record<Locale, string>;
    const studioAlternates = {
      ...Object.fromEntries(
        LOCALES.map((locale) => [locale, absUrl(localePath(locale, studioPaths[locale]))])
      ),
      "x-default": absUrl(localePath(DEFAULT_LOCALE, studioPaths[DEFAULT_LOCALE])),
    };

    return LOCALES.map((locale) => ({
      url: absUrl(localePath(locale, studioPaths[locale])),
      lastModified: now,
      alternates: {
        languages: studioAlternates,
      },
    }));
  });

  return [...rootEntries, ...studioEntries];
}
