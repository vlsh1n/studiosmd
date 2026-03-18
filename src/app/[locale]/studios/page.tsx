import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n";
import { DEFAULT_LOCALE, LOCALES, SITE_NAME, absUrl, localePath } from "@/seo/site";
import { listStudiosForCatalog } from "@/db/queries";
import { buildStudioPath } from "@/seo/studio";
import { DISTRICTS } from "@/domain/dictionaries";
import { safeExternalUrl } from "@/lib/url";
import StudioCardList, {
  type FeatureKey,
  type StudioCardItem,
  type StudioContactLink,
} from "./StudioCardList.client";

export const revalidate = 1800;

interface Props {
  params: Promise<{ locale: string }>;
}

const STUDIOS_PATH = "/studios";

const STUDIOS_SEO: Record<Locale, { title: string; description: string }> = {
  ru: {
    title: `Фотостудии в Кишинёве | ${SITE_NAME}`,
    description:
      "Все фотостудии Кишинёва на одной странице — 21 студия в 5 районах. Цены, залы и прямые ссылки на каждую студию.",
  },
  ro: {
    title: `Studiouri foto în Chișinău | ${SITE_NAME}`,
    description:
      "Toate studiourile foto din Chișinău pe o singură pagină — 21 de studiouri în 5 sectoare. Prețuri, săli și link-uri directe.",
  },
  en: {
    title: `Photo studios in Chișinău | ${SITE_NAME}`,
    description:
      "All photo studios in Chișinău on one page — 21 studios across 5 districts. Prices, halls and direct links.",
  },
};

interface PageContent {
  heading: string;
  subtitle: string;
  cta: string;
  hallCount: (n: number) => string;

}

const CONTENT: Record<Locale, PageContent> = {
  ru: {
    heading: "Фотостудии",
    subtitle: "Все студии Кишинёва — адреса, залы, цены.",
    cta: "Смотреть студию",
    hallCount: (n) => `${n}\u00A0${n === 1 ? "зал" : n < 5 ? "зала" : "залов"}`,
  },
  ro: {
    heading: "Studiouri foto",
    subtitle: "Toate studiourile din Chișinău — adrese, săli, prețuri.",
    cta: "Vezi studioul",
    hallCount: (n) => `${n}\u00A0${n === 1 ? "sală" : "săli"}`,
  },
  en: {
    heading: "Photo studios",
    subtitle: "All studios in Chișinău — addresses, halls, prices.",
    cta: "View studio",
    hallCount: (n) => `${n}\u00A0${n === 1 ? "hall" : "halls"}`,
  },
};

const FEATURE_ORDER: FeatureKey[] = [
  "daylight",
  "blackout",
  "parking",
  "changing_room",
  "cyclorama",
  "continuous_light",
  "flash_light",
  "furniture",
];

type HallFeatures = {
  daylight: boolean | null;
  blackout: boolean | null;
  parking: boolean | null;
  changing_room: boolean | null;
  furniture: boolean | null;
  flash_light: boolean | null;
  continuous_light: boolean | null;
  cyclorama: boolean | null;
};

function collectFeatures(halls: HallFeatures[]): FeatureKey[] {
  const present = new Set<FeatureKey>();
  for (const hall of halls) {
    for (const key of FEATURE_ORDER) {
      if (hall[key]) present.add(key);
    }
  }
  return FEATURE_ORDER.filter((k) => present.has(k));
}

function buildContacts(studio: {
  phone: string | null;
  instagram_nickname: string | null;
  google_maps_url: string | null;
  yandex_maps_url: string | null;
}): StudioContactLink[] {
  const links: StudioContactLink[] = [];
  if (studio.phone) {
    links.push({
      href: `tel:${studio.phone}`,
      label: studio.phone,
      icon: "/icons/telephone.png",
    });
  }
  if (studio.instagram_nickname) {
    links.push({
      href: `https://instagram.com/${studio.instagram_nickname}`,
      label: `@${studio.instagram_nickname}`,
      icon: "/icons/instagram.png",
    });
  }
  const gmapsUrl = safeExternalUrl(studio.google_maps_url);
  if (gmapsUrl) {
    links.push({ href: gmapsUrl, label: "Google Maps", icon: "/icons/google_maps.png" });
  }
  const ymapsUrl = safeExternalUrl(studio.yandex_maps_url);
  if (ymapsUrl) {
    links.push({ href: ymapsUrl, label: "Yandex Maps", icon: "/icons/yandex_maps.png" });
  }
  return links;
}


function buildItemListJsonLd(
  studios: Array<{ name: string; slug: string }>,
  locale: Locale,
  canonicalUrl: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: STUDIOS_SEO[locale].title,
    url: canonicalUrl,
    numberOfItems: studios.length,
    itemListElement: studios.map((studio, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: studio.name,
      url: absUrl(localePath(locale, buildStudioPath(studio.slug))),
    })),
  };
}

function stringifyJsonLd(data: Record<string, unknown>) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = isLocale(locale) ? locale : DEFAULT_LOCALE;
  const seo = STUDIOS_SEO[currentLocale];
  const canonicalUrl = absUrl(localePath(currentLocale, STUDIOS_PATH));
  const languageAlternates = Object.fromEntries(
    LOCALES.map((l) => [l, absUrl(localePath(l, STUDIOS_PATH))])
  );

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ...languageAlternates,
        "x-default": absUrl(localePath(DEFAULT_LOCALE, STUDIOS_PATH)),
      },
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      type: "website",
    },
  };
}

export default async function StudiosPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const [studios] = await Promise.all([listStudiosForCatalog()]);
  const content = CONTENT[locale];
  const canonicalUrl = absUrl(localePath(locale, STUDIOS_PATH));

  const cardItems: StudioCardItem[] = studios.map((studio) => {
    return {
      id: studio.id,
      name: studio.name,
      logoUrl: safeExternalUrl(studio.logo_url),
      address: studio.address,
      districtLabel: DISTRICTS[studio.district_key][locale],
      hallCountLabel: content.hallCount(studio.halls.length),
      workingHours: studio.working_hours,
      features: collectFeatures(studio.halls),
      contacts: buildContacts(studio),
      studioHref: localePath(locale, buildStudioPath(studio.slug)),
      ctaLabel: content.cta,
    };
  });

  const jsonLd = buildItemListJsonLd(studios, locale, canonicalUrl);

  return (
    <div className="stack">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: stringifyJsonLd(jsonLd) }}
      />

      <section className="card p-4 sm:p-5">
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">{content.heading}</h1>
        <p className="mt-1.5 text-sm text-[var(--muted)]">{content.subtitle}</p>
      </section>

      <StudioCardList items={cardItems} />
    </div>
  );
}
