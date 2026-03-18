import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { listHalls, listStudios } from "@/db/queries";
import type { HallListItem } from "@/db/queries";
import HallCardList, {
  type HallCardItem,
  type HallFactItem,
} from "@/app/[locale]/HallCardList.client";
import CatalogTracking from "@/app/[locale]/CatalogTracking.client";
import { DISTRICTS, TAGS } from "@/domain/dictionaries";
import { UI_STRINGS } from "@/domain/ui-strings";
import { isLocale, Locale } from "@/i18n";
import { safeExternalUrl } from "@/lib/url";
import { DEFAULT_LOCALE, LOCALES, SITE_NAME, absUrl, localePath } from "@/seo/site";
import { buildStudioHallPath, buildStudioPath } from "@/seo/studio";

export const revalidate = 1800;

const districtKeys = Object.keys(DISTRICTS) as Array<keyof typeof DISTRICTS>;
const PAGE_SIZE = 12;
const CATALOG_FILTER_FORM_ID = "catalog-filter-form";
const factKeys: HallFactItem["key"][] = [
  "daylight",
  "blackout",
  "parking",
  "changing_room",
  "furniture",
  "flash_light",
  "continuous_light",
  "cyclorama",
];
const FACT_ICON_BY_KEY: Record<HallFactItem["key"], string> = {
  daylight: "/icons/daylight.png",
  blackout: "/icons/blackout.png",
  parking: "/icons/parking.png",
  changing_room: "/icons/changing_room.png",
  furniture: "/icons/furniture.png",
  flash_light: "/icons/flash_light.png",
  continuous_light: "/icons/continuous_light.png",
  cyclorama: "/icons/cyclorama.png",
};
const FACT_LABEL_BY_KEY: Record<HallFactItem["key"], (locale: Locale) => string> = {
  daylight: (locale) => UI_STRINGS.daylight_fact_label[locale],
  blackout: (locale) => UI_STRINGS.blackout_fact_label[locale],
  parking: (locale) => UI_STRINGS.parking_fact_label[locale],
  changing_room: (locale) => UI_STRINGS.changing_room_fact_label[locale],
  furniture: (locale) => UI_STRINGS.furniture_label[locale],
  flash_light: (locale) => UI_STRINGS.flash_light_label[locale],
  continuous_light: (locale) => UI_STRINGS.continuous_light_label[locale],
  cyclorama: (locale) => UI_STRINGS.cyclorama_fact_label[locale],
};

const CATALOG_SEO_COPY: Record<Locale, { title: string; description: string }> = {
  ru: {
    title: `Каталог фотостудий в Кишинёве — цены, районы, опции | ${SITE_NAME}`,
    description:
      "Подберите фотостудию в Кишинёве по фото, цене, району и опциям. Сравнивайте залы и переходите к карточке студии.",
  },
  ro: {
    title: `Catalog de studiouri foto în Chișinău — prețuri, sectoare, opțiuni | ${SITE_NAME}`,
    description:
      "Alegeți un studio foto în Chișinău după poze, preț, sector și opțiuni. Comparați sălile și deschideți pagina studioului.",
  },
  en: {
    title: `Photo studios directory in Chișinău — prices, districts, options | ${SITE_NAME}`,
    description:
      "Choose a photo studio in Chișinău by photos, price, district, and options. Compare halls and open each studio page for details.",
  },
};
const CATALOG_SOCIAL_IMAGE_URL = absUrl("/og-image");

function hasSearchParams(query: { [key: string]: string | string[] | undefined }) {
  return Object.keys(query).length > 0;
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined } | undefined>;
}): Promise<Metadata> {
  const { locale } = await params;
  const query = (await searchParams) ?? {};
  const currentLocale = isLocale(locale) ? locale : DEFAULT_LOCALE;
  const shouldNoIndex = hasSearchParams(query);
  const languageAlternates = Object.fromEntries(
    LOCALES.map((languageLocale) => [languageLocale, absUrl(localePath(languageLocale))])
  );
  const seo = CATALOG_SEO_COPY[currentLocale];
  const canonicalUrl = absUrl(localePath(currentLocale));

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ...languageAlternates,
        "x-default": absUrl(localePath(DEFAULT_LOCALE)),
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
          url: CATALOG_SOCIAL_IMAGE_URL,
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
      images: [CATALOG_SOCIAL_IMAGE_URL],
    },
    robots: shouldNoIndex
      ? {
          index: false,
          follow: true,
        }
      : {
          index: true,
          follow: true,
        },
  };
}

interface Props {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

const WEEKEND_PRICE_LABEL: Record<Locale, string> = {
  ru: "В выходные:",
  ro: "În weekend:",
  en: "Weekends:",
};

function formatHourlyPrice(pricePerHour: number | null | undefined, locale: Locale) {
  if (typeof pricePerHour === "number" && pricePerHour > 0) {
    return `${pricePerHour}\u00A0MDL ${UI_STRINGS.per_hour[locale]}`;
  }

  return UI_STRINGS.price_on_request[locale];
}

function parseCsvParam(value?: string | string[]) {
  if (!value) return [];
  const items = Array.isArray(value) ? value : [value];
  return items
    .flatMap((item) => item.split(","))
    .map((item) => item.trim())
    .filter(Boolean);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function getImagesFromJson(value: unknown) {
  if (!isStringArray(value)) return [];
  return value.flatMap((url) => {
    const safe = safeExternalUrl(url);
    return safe ? [safe] : [];
  });
}

function shuffleArray<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
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

function isFactKey(value: string): value is HallFactItem["key"] {
  return factKeys.includes(value as HallFactItem["key"]);
}

export default async function CatalogPage({ params, searchParams }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const query = (await searchParams) ?? {};
  const rawQ = Array.isArray(query.q) ? query.q[0] : query.q;
  const q = typeof rawQ === "string" ? rawQ.trim().slice(0, 80) : "";
  const rawPage = Array.isArray(query.page) ? query.page[0] : query.page;
  const parsedPage = Number.parseInt(typeof rawPage === "string" ? rawPage : "", 10);
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const skip = (page - 1) * PAGE_SIZE;
  const district_keys = parseCsvParam(query.districts).filter((key): key is keyof typeof DISTRICTS =>
    districtKeys.includes(key as keyof typeof DISTRICTS)
  );
  const facts = parseCsvParam(query.facts).filter((key): key is HallFactItem["key"] =>
    isFactKey(key)
  );
  const rawSort = Array.isArray(query.sort) ? query.sort[0] : query.sort;
  const sort =
    rawSort === "price_asc" || rawSort === "price_desc" || rawSort === "random"
      ? rawSort
      : "random";
  const isUnfilteredFirstPage =
    page === 1 && !q && district_keys.length === 0 && facts.length === 0;

  let halls: HallListItem[];
  let allStudios: Awaited<ReturnType<typeof listStudios>>;
  try {
    [halls, allStudios] = await Promise.all([
      listHalls({
        q: q.length > 0 ? q : undefined,
        district_keys,
        facts,
        sort: sort === "random" ? undefined : sort,
        take: PAGE_SIZE + 1,
        skip,
      }),
      isUnfilteredFirstPage ? listStudios() : Promise.resolve([]),
    ]);
  } catch (err) {
    console.error("[CatalogPage] listHalls failed:", err);
    throw err;
  }
  const hasNext = halls.length > PAGE_SIZE;
  const hasPrev = page > 1;

  const canonicalUrl = absUrl(localePath(locale));
  const itemListJsonLd = isUnfilteredFirstPage
    ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: CATALOG_SEO_COPY[locale].title,
        url: canonicalUrl,
        numberOfItems: allStudios.length,
        itemListElement: allStudios.map((studio, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: studio.name,
          url: absUrl(localePath(locale, buildStudioPath(studio.slug))),
        })),
      }
    : null;
  const paginatedHalls = halls.slice(0, PAGE_SIZE);
  const displayedHalls =
    sort === "random" ? shuffleArray(paginatedHalls) : paginatedHalls;

  const paginationParams = new URLSearchParams();
  if (q) {
    paginationParams.set("q", q);
  }
  for (const district of district_keys) {
    paginationParams.append("districts", district);
  }
  for (const fact of facts) {
    paginationParams.append("facts", fact);
  }
  if (sort !== "random") {
    paginationParams.set("sort", sort);
  }

  function pageHref(targetPage: number) {
    const params = new URLSearchParams(paginationParams);
    if (targetPage > 1) {
      params.set("page", String(targetPage));
    }
    const search = params.toString();
    return search ? `/${locale}?${search}` : `/${locale}`;
  }
  const cardItems: HallCardItem[] = displayedHalls.map((hall) => {
    const hallImages = getImagesFromJson(hall.images);
    const image = hallImages[0] ?? null;
    const tagLabels = getNormalizedTagKeys(hall.tags).map((tag) => TAGS[tag][locale]);
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

    const hallHref = localePath(
      locale,
      buildStudioHallPath(hall.studio.name, hall.name)
    );

    const factItems: HallFactItem[] = [];
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
      name: `${hall.name} | ${hall.studio.name}`,
      image,
      hallHref,
      studioLine: DISTRICTS[hall.studio.district_key][locale],
      spaceLine,
      priceLine: formatHourlyPrice(hall.price_per_hour, locale),
      weekendPriceLine,
      tagLabels,
      factItems,
      ctaLabel: UI_STRINGS.view_hall_cta[locale],
    };
  });

  return (
    <div className="stack">
      {itemListJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
      )}
      <CatalogTracking locale={locale} formId={CATALOG_FILTER_FORM_ID} />

      <section className="card p-4 sm:p-5">
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
          {UI_STRINGS.catalog_h1[locale]}
        </h1>
        <p className="mt-2 text-sm muted">{UI_STRINGS.catalog_intro[locale]}</p>
      </section>

      <form id={CATALOG_FILTER_FORM_ID} className="stack" method="get">
        <div className="card p-4">
          <input
            type="search"
            name="q"
            placeholder={UI_STRINGS.search_placeholder[locale]}
            defaultValue={q ?? ""}
            className="input"
          />
        </div>

        <div className="card stack p-5">
          <div className="text-sm font-semibold text-gray-900">
            {UI_STRINGS.filters_title[locale]}
          </div>

          <div className="stack">
            <div className="text-xs font-semibold uppercase muted">
              {UI_STRINGS.districts_title[locale]}
            </div>
            <div className="flex flex-wrap gap-2">
              {districtKeys.map((key) => {
                const checked = district_keys.includes(key);
                return (
                  <label key={key} className="relative inline-flex">
                    <input
                      type="checkbox"
                      name="districts"
                      value={key}
                      defaultChecked={checked}
                      className="peer sr-only"
                    />
                    <span className="pill ui-pill-control text-sm peer-checked:border-transparent peer-checked:bg-[#1c1a17] peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-3 peer-focus-visible:outline-[var(--ring)] peer-focus-visible:outline-offset-2">
                      {DISTRICTS[key][locale]}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>


          <div className="stack">
            <div className="text-xs font-semibold uppercase muted">
              {UI_STRINGS.options_title[locale]}
            </div>
            <div className="flex flex-wrap gap-2">
              {factKeys.map((factKey) => {
                const label = FACT_LABEL_BY_KEY[factKey](locale);
                return (
                  <label
                    key={factKey}
                    className="relative inline-flex"
                  >
                    <input
                      type="checkbox"
                      name="facts"
                      value={factKey}
                      defaultChecked={facts.includes(factKey)}
                      className="peer sr-only"
                      aria-label={label}
                    />
                    <span
                      className="pill ui-pill-control gap-2 text-sm peer-checked:border-transparent peer-checked:bg-[#1c1a17] peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-3 peer-focus-visible:outline-[var(--ring)] peer-focus-visible:outline-offset-2 peer-checked:[&>img]:invert"
                    >
                      <img
                        src={FACT_ICON_BY_KEY[factKey]}
                        alt=""
                        loading="lazy"
                        className="h-4 w-4 object-contain opacity-80 grayscale transition-all duration-150 peer-checked:opacity-100 peer-checked:grayscale-0"
                        aria-hidden="true"
                      />
                      <span>{label}</span>
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="stack">
            <div className="text-xs font-semibold uppercase muted">
              {UI_STRINGS.sort_label[locale]}
            </div>
            <select name="sort" defaultValue={sort} className="select">
              <option value="random">{UI_STRINGS.sort_random[locale]}</option>
              <option value="price_asc">{UI_STRINGS.sort_price_asc[locale]}</option>
              <option value="price_desc">{UI_STRINGS.sort_price_desc[locale]}</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-2">
            <button type="submit" className="btn btn-primary cursor-pointer">
              {UI_STRINGS.apply[locale]}
            </button>
            <Link href={`/${locale}`} className="btn">
              {UI_STRINGS.reset[locale]}
            </Link>
          </div>
        </div>
      </form>

      <div className="grid w-full max-w-5xl mx-auto gap-6 -mx-2 sm:mx-auto">
        {displayedHalls.length === 0 ? (
          <div className="text-sm muted">{UI_STRINGS.no_results[locale]}</div>
        ) : (
          <HallCardList items={cardItems} weekendLabel={WEEKEND_PRICE_LABEL[locale]} />
        )}
      </div>

      {(hasPrev || hasNext) && (
        <div className="flex items-center justify-between gap-3 w-full max-w-5xl mx-auto">
          {hasPrev ? (
            <Link href={pageHref(page - 1)} className="btn">
              {UI_STRINGS.pagination_prev[locale]}
            </Link>
          ) : (
            <span className="btn opacity-45" aria-hidden="true">
              {UI_STRINGS.pagination_prev[locale]}
            </span>
          )}
          {hasNext ? (
            <Link href={pageHref(page + 1)} className="btn">
              {UI_STRINGS.pagination_next[locale]}
            </Link>
          ) : (
            <span className="btn opacity-45" aria-hidden="true">
              {UI_STRINGS.pagination_next[locale]}
            </span>
          )}
        </div>
      )}

      <p className="text-xs text-gray-400 max-w-5xl mx-auto leading-relaxed">
        {UI_STRINGS.catalog_body[locale]}
      </p>
    </div>
  );
}
