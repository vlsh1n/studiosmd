import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { listHallRouteEntries } from "@/db/queries";
import { isLocale, type Locale } from "@/i18n";
import { DEFAULT_LOCALE, SITE_NAME } from "@/seo/site";
import { normalizeStudioSlug, slugifyStudioName } from "@/seo/studio";
import StudioByIdPage, {
  generateMetadata as generateStudioByIdMetadata,
} from "@/app/[locale]/studios/[studioSlug]/page";

type Props = {
  params: Promise<{ locale: string; studioSlug: string; hallSlug: string }>;
};

type ResolvedHallRoute = {
  locale: Locale;
  studioSlug: string;
  hallId: string;
};

async function resolveHallRoute({
  locale,
  studioSlug,
  hallSlug,
}: {
  locale: Locale;
  studioSlug: string;
  hallSlug: string;
}): Promise<ResolvedHallRoute | null> {
  const normalizedStudioSlug = normalizeStudioSlug(studioSlug);
  const normalizedHallSlug = normalizeStudioSlug(hallSlug);
  const halls = await listHallRouteEntries();
  const match = halls.find(
    (hall) =>
      hall.studio.slug === normalizedStudioSlug &&
      slugifyStudioName(hall.name) === normalizedHallSlug
  );

  if (!match) {
    return null;
  }

  return {
    locale,
    studioSlug: match.studio.slug,
    hallId: match.id,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, studioSlug, hallSlug } = await params;
  const currentLocale = isLocale(locale) ? locale : DEFAULT_LOCALE;
  const resolved = await resolveHallRoute({
    locale: currentLocale,
    studioSlug,
    hallSlug,
  });

  if (!resolved) {
    return {
      title: SITE_NAME,
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return generateStudioByIdMetadata({
    params: Promise.resolve({ locale: currentLocale, studioSlug: resolved.studioSlug }),
  });
}

export default async function StudioHallPage({ params }: Props) {
  const { locale, studioSlug, hallSlug } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const resolved = await resolveHallRoute({
    locale,
    studioSlug,
    hallSlug,
  });
  if (!resolved) {
    notFound();
  }

  return StudioByIdPage({
    params: Promise.resolve({ locale, studioSlug: resolved.studioSlug }),
    searchParams: Promise.resolve({ hallId: resolved.hallId }),
  });
}
