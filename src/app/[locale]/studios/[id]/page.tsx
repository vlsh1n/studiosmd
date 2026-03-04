import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStudioById } from "@/db/queries";
import { DISTRICTS, TAGS } from "@/domain/dictionaries";
import { UI_STRINGS } from "@/domain/ui-strings";
import { isLocale, type Locale } from "@/i18n";
import { safeExternalUrl } from "@/lib/url";
import { DEFAULT_LOCALE, LOCALES, SITE_NAME, absUrl, localePath } from "@/seo/site";
import HallCardList, {
  type StudioHallCardItem,
} from "@/app/[locale]/studios/[id]/HallCardList.client";
import StudioContacts from "@/app/[locale]/studios/[id]/StudioContacts.client";
import HallFocus from "@/components/HallFocus";

type Props = {
  params: { locale: string; id: string };
};

type JsonArray = unknown[] | null | undefined;
type JsonObject = Record<string, unknown> | null | undefined;

const WEEKEND_PRICE_LABEL: Record<Locale, string> = {
  ru: "В выходные:",
  ro: "În weekend:",
  en: "Weekends:",
};
const STUDIO_SOCIAL_IMAGE_URL = absUrl("/og-image");

function getStringsFromJson(value: JsonArray) {
  if (!Array.isArray(value)) return [];

  const urls: string[] = [];
  for (const item of value) {
    if (typeof item !== "string") continue;
    const safeUrl = safeExternalUrl(item);
    if (safeUrl) {
      urls.push(safeUrl);
    }
  }
  return urls;
}

function getImageList(value: JsonArray) {
  return getStringsFromJson(value);
}

function getLocalizedText(value: JsonObject, locale: Locale) {
  if (!value || typeof value !== "object") return null;

  const localizedValue = value[locale];
  if (typeof localizedValue !== "string") return null;

  const trimmed = localizedValue.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function getStringValue(value: unknown) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function sanitizePhoneForTel(value: string) {
  return value.replace(/[^\d+]/g, "");
}

function getInstagramNickname(value: unknown) {
  const rawValue = getStringValue(value);
  if (!rawValue) return null;

  const withoutDomain = rawValue.replace(/^https?:\/\/(www\.)?instagram\.com\//i, "");
  const nickname = withoutDomain.split(/[/?#]/)[0]?.replace(/^@+/, "").trim();
  return nickname && nickname.length > 0 ? nickname : null;
}

function isTagKey(value: string): value is keyof typeof TAGS {
  return value in TAGS;
}

function getNormalizedTagKeys(tags: string[]) {
  const normalized = tags
    .map((tag) => tag.trim().toLowerCase())
    .filter(isTagKey);
  return Array.from(new Set(normalized));
}

function getStudioPriceRange(halls: Array<{ price_per_hour: number }>) {
  if (halls.length === 0) {
    return null;
  }

  const prices = halls
    .map((hall) => hall.price_per_hour)
    .filter((price): price is number => typeof price === "number" && price > 0);

  if (prices.length === 0) {
    return null;
  }

  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return { min, max };
}

function getStudioFactsSummary(
  halls: Array<{ daylight: boolean; blackout: boolean; parking: boolean; cyclorama: boolean }>,
  locale: Locale
) {
  const labels: string[] = [];
  if (halls.some((hall) => hall.daylight === true)) {
    labels.push(UI_STRINGS.daylight_fact_label[locale]);
  }
  if (halls.some((hall) => hall.blackout === true)) {
    labels.push(UI_STRINGS.blackout_fact_label[locale]);
  }
  if (halls.some((hall) => hall.parking === true)) {
    labels.push(UI_STRINGS.parking_fact_label[locale]);
  }
  if (halls.some((hall) => hall.cyclorama === true)) {
    labels.push(UI_STRINGS.cyclorama_fact_label[locale]);
  }

  if (labels.length === 0) {
    return null;
  }

  if (locale === "ru") {
    return `Есть: ${labels.join(", ")}.`;
  }
  if (locale === "ro") {
    return `Disponibile: ${labels.join(", ")}.`;
  }
  return `Available: ${labels.join(", ")}.`;
}

function getStudioSeo(studio: NonNullable<Awaited<ReturnType<typeof getStudioById>>>, locale: Locale) {
  const districtLabel = DISTRICTS[studio.district_key][locale];
  const priceRange = getStudioPriceRange(studio.halls);
  const factsSummary = getStudioFactsSummary(studio.halls, locale);
  const hallsCount = studio.halls.length;
  const priceLine = priceRange
    ? priceRange.min === priceRange.max
      ? `${priceRange.min} MDL`
      : `${priceRange.min}-${priceRange.max} MDL`
    : null;

  if (locale === "ru") {
    const title = `${studio.name} — фотостудия в ${districtLabel} | цены, залы, фото | ${SITE_NAME}`;
    const descriptionParts = [
      `${studio.name}: ${hallsCount} залов в ${districtLabel}.`,
      priceLine ? `Цены от ${priceLine} в час.` : null,
      factsSummary,
    ].filter(Boolean);
    return { title, description: descriptionParts.join(" ") };
  }

  if (locale === "ro") {
    const title = `${studio.name} — studio foto în ${districtLabel} | prețuri, săli, poze | ${SITE_NAME}`;
    const descriptionParts = [
      `${studio.name}: ${hallsCount} săli în ${districtLabel}.`,
      priceLine ? `Prețuri de la ${priceLine} pe oră.` : null,
      factsSummary,
    ].filter(Boolean);
    return { title, description: descriptionParts.join(" ") };
  }

  const title = `${studio.name} — photo studio in ${districtLabel} | prices, halls, photos | ${SITE_NAME}`;
  const descriptionParts = [
    `${studio.name}: ${hallsCount} halls in ${districtLabel}.`,
    priceLine ? `Prices from ${priceLine} per hour.` : null,
    factsSummary,
  ].filter(Boolean);
  return { title, description: descriptionParts.join(" ") };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const currentLocale = isLocale(locale) ? locale : DEFAULT_LOCALE;
  const studio = await getStudioById(id, currentLocale);

  if (!studio) {
    return {
      title: SITE_NAME,
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const seo = getStudioSeo(studio, currentLocale);
  const canonicalUrl = absUrl(localePath(currentLocale, `/studios/${studio.id}`));
  const languageAlternates = Object.fromEntries(
    LOCALES.map((languageLocale) =>
      [languageLocale, absUrl(localePath(languageLocale, `/studios/${studio.id}`))]
    )
  );

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ...languageAlternates,
        "x-default": absUrl(localePath(DEFAULT_LOCALE, `/studios/${studio.id}`)),
      },
    },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      siteName: SITE_NAME,
      title: seo.title,
      description: seo.description,
      images: [
        {
          url: STUDIO_SOCIAL_IMAGE_URL,
          width: 1200,
          height: 630,
          alt: "Catalog de studiouri foto în Chișinău",
        },
      ],
      locale: currentLocale,
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [STUDIO_SOCIAL_IMAGE_URL],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function StudioPage({ params }: Props) {
  const { locale, id } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const studio = await getStudioById(id, locale);
  if (!studio) {
    notFound();
  }

  const phone = getStringValue(studio.phone);
  const phoneHref = phone ? sanitizePhoneForTel(phone) : null;
  const instagramNickname = getInstagramNickname(studio.instagram_nickname);
  const instagramHref = instagramNickname
    ? `https://instagram.com/${encodeURIComponent(instagramNickname)}`
    : null;
  const yandexMapsHref = safeExternalUrl(studio.yandex_maps_url);
  const googleMapsHref = safeExternalUrl(studio.google_maps_url);
  const logoUrl = safeExternalUrl(studio.logo_url);
  const workingHours =
    getLocalizedText(studio.working_hours_i18n as JsonObject, locale) ??
    UI_STRINGS.working_hours_fallback[locale];
  const hallCountLabel = UI_STRINGS.halls_count[locale].replace("{count}", String(studio.halls.length));
  const hallCards: StudioHallCardItem[] = studio.halls.map((hall) => {
    const images = getImageList(hall.images as JsonArray);
    const tags = getNormalizedTagKeys(hall.tags).map((tag) => TAGS[tag][locale]);
    const flashAvailable = hall.flash_light === true;
    const continuousAvailable = hall.continuous_light === true;
    const weekendPriceLine =
      typeof hall.weekend_price === "number" && hall.weekend_price > 0
        ? `${hall.weekend_price}\u00A0MDL ${UI_STRINGS.per_hour[locale]}`
        : null;
    const areaParts: string[] = [];
    if (typeof hall.area_sqm === "number" && hall.area_sqm > 0) {
      areaParts.push(`${hall.area_sqm}m\u00B2`);
    }
    if (typeof hall.high_ceiling === "number" && hall.high_ceiling > 0) {
      areaParts.push(`${hall.high_ceiling}m`);
    }
    const spaceLine = areaParts.length > 0 ? areaParts.join(" · ") : null;

    const factItems: StudioHallCardItem["factItems"] = [];
    if (hall.daylight === true) {
      factItems.push({
        key: "daylight",
        label: UI_STRINGS.daylight_fact_label[locale],
      });
    }
    if (hall.blackout === true) {
      factItems.push({
        key: "blackout",
        label: UI_STRINGS.blackout_fact_label[locale],
      });
    }
    if (hall.parking === true) {
      factItems.push({
        key: "parking",
        label: UI_STRINGS.parking_fact_label[locale],
      });
    }
    if (hall.changing_room === true) {
      factItems.push({
        key: "changing_room",
        label: UI_STRINGS.changing_room_fact_label[locale],
      });
    }
    if (hall.furniture === true) {
      factItems.push({
        key: "furniture",
        label: UI_STRINGS.furniture_label[locale],
      });
    }
    if (flashAvailable) {
      factItems.push({
        key: "flash_light",
        label: UI_STRINGS.flash_light_label[locale],
      });
    }
    if (continuousAvailable) {
      factItems.push({
        key: "continuous_light",
        label: UI_STRINGS.continuous_light_label[locale],
      });
    }
    if (hall.cyclorama === true) {
      factItems.push({
        key: "cyclorama",
        label: UI_STRINGS.cyclorama_fact_label[locale],
      });
    }

    return {
      id: hall.id,
      name: hall.name,
      priceLine: `${hall.price_per_hour}\u00A0MDL ${UI_STRINGS.per_hour[locale]}`,
      weekendPriceLine,
      spaceLine,
      factItems,
      tags,
      images,
    };
  });

  return (
    <div className="stack">
      <section className="card p-4 sm:p-5">
        <div className="stack gap-4">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-[var(--glass-border)] bg-[var(--surface)] sm:h-20 sm:w-20">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={`${studio.name} logo`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[10px] font-medium uppercase tracking-wide muted">
                  {UI_STRINGS.logo_placeholder[locale]}
                </div>
              )}
            </div>

            <div className="min-w-0 stack gap-2">
              <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">{studio.name}</h1>

              <div className="inline-flex flex-wrap gap-2">
                <span className="pill w-fit text-xs">{DISTRICTS[studio.district_key][locale]}</span>
                <span className="pill w-fit text-xs">{hallCountLabel}</span>
              </div>

              <div className="text-sm muted">{studio.address}</div>
              <div className="text-sm muted">
                <span className="font-medium text-gray-900">{UI_STRINGS.working_hours_label[locale]}</span>{" "}
                {workingHours}
              </div>
            </div>
          </div>

          <StudioContacts
            studioId={studio.id}
            locale={locale}
            instagramHref={instagramHref}
            phoneHref={phoneHref}
            phoneText={phone}
            yandexMapsHref={yandexMapsHref}
            googleMapsHref={googleMapsHref}
            instagramLabel={UI_STRINGS.instagram_cta[locale]}
            yandexMapsLabel={UI_STRINGS.yandex_maps_cta[locale]}
            googleMapsLabel={UI_STRINGS.google_maps_cta[locale]}
          />
        </div>
      </section>

      <HallFocus />
      <section className="stack">
        <HallCardList
          halls={hallCards}
          studioId={studio.id}
          locale={locale}
          weekendLabel={WEEKEND_PRICE_LABEL[locale]}
          instagramHref={instagramHref}
          phoneHref={phoneHref ? `tel:${phoneHref}` : null}
          yandexMapsHref={yandexMapsHref}
          googleMapsHref={googleMapsHref}
          instagramLabel={UI_STRINGS.instagram_cta[locale]}
          phoneText={phone}
          yandexMapsLabel={UI_STRINGS.yandex_maps_cta[locale]}
          googleMapsLabel={UI_STRINGS.google_maps_cta[locale]}
        />
      </section>
    </div>
  );
}
