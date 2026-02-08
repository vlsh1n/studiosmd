import Link from "next/link";
import { notFound } from "next/navigation";
import { listHalls } from "@/db/queries";
import type { HallListItem } from "@/db/queries";
import HallCardList, {
  type HallCardItem,
  type HallFactItem,
} from "@/app/[locale]/HallCardList.client";
import { DISTRICTS, TAGS } from "@/domain/dictionaries";
import { UI_STRINGS } from "@/domain/ui-strings";
import { isLocale, Locale } from "@/i18n";
import { safeExternalUrl } from "@/lib/url";

const districtKeys = Object.keys(DISTRICTS) as Array<keyof typeof DISTRICTS>;
const tagKeys = Object.keys(TAGS) as Array<keyof typeof TAGS>;
const PAGE_SIZE = 12;

type Props = {
  params: { locale: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

const WEEKEND_PRICE_LABEL: Record<Locale, string> = {
  ru: "В выходные:",
  ro: "În weekend:",
  en: "Weekends:",
};

function parseCsvParam(value?: string | string[]) {
  if (!value) return [];
  const items = Array.isArray(value) ? value : [value];
  return items
    .flatMap((item) => item.split(","))
    .map((item) => item.trim())
    .filter(Boolean);
}

function getImagesFromJson(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  const images: string[] = [];
  for (const item of value) {
    if (typeof item !== "string") continue;
    const safeUrl = safeExternalUrl(item);
    if (safeUrl) {
      images.push(safeUrl);
    }
  }

  return images;
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
  const tags = parseCsvParam(query.tags).filter((key): key is keyof typeof TAGS =>
    tagKeys.includes(key as keyof typeof TAGS)
  );
  const selectedTagLabels = tags.map((tag) => TAGS[tag][locale]);
  const rawSort = Array.isArray(query.sort) ? query.sort[0] : query.sort;
  const sort =
    rawSort === "price_asc" || rawSort === "price_desc" || rawSort === "random"
      ? rawSort
      : "random";
  const halls = (await listHalls({
    locale,
    q: q.length > 0 ? q : undefined,
    district_keys,
    tags,
    sort: sort === "random" ? undefined : sort,
    take: PAGE_SIZE + 1,
    skip,
  })) as HallListItem[];
  const hasNext = halls.length > PAGE_SIZE;
  const hasPrev = page > 1;
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
  for (const tag of tags) {
    paginationParams.append("tags", tag);
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
    const studioImages = getImagesFromJson(hall.studio.cover_images);
    const image = hallImages[0] ?? studioImages[0] ?? null;
    const imageCount = hallImages.length > 0 ? hallImages.length : studioImages.length;
    const tagLabels = hall.tags.filter(isTagKey).map((tag) => TAGS[tag][locale]).slice(0, 4);
    const hallTagSet = new Set(hall.tags);
    const flashAvailable = hall.flash_available === true;
    const continuousAvailable = hall.continuous_available === true;
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

    const hallId = encodeURIComponent(hall.id);
    const hallHref = `/${locale}/studios/${hall.studio.id}?hallId=${hallId}#hall-${hallId}`;

    const factItems: HallFactItem[] = [];
    if (hall.daylight === "yes") {
      factItems.push({
        key: "daylight",
        label: UI_STRINGS.daylight_fact_label[locale],
      });
    }
    if (hallTagSet.has("blackout")) {
      factItems.push({
        key: "blackout",
        label: UI_STRINGS.blackout_fact_label[locale],
      });
    }
    if (hallTagSet.has("parking")) {
      factItems.push({
        key: "parking",
        label: UI_STRINGS.parking_fact_label[locale],
      });
    }
    if (hallTagSet.has("changing_room")) {
      factItems.push({
        key: "changing_room",
        label: UI_STRINGS.changing_room_fact_label[locale],
      });
    }
    if (hall.props_available === true) {
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

    return {
      id: hall.id,
      name: hall.name,
      image,
      imageCount,
      hallHref,
      studioLine: `${DISTRICTS[hall.studio.district_key][locale]} • ${hall.studio.name}`,
      spaceLine,
      priceLine: `${hall.price_per_hour}\u00A0MDL ${UI_STRINGS.per_hour[locale]}`,
      weekendPriceLine,
      tagLabels,
      factItems,
      ctaLabel: UI_STRINGS.view_hall_cta[locale],
    };
  });

  return (
    <div className="stack">
      <form className="stack" method="get">
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
            <div className="grid gap-2 md:grid-cols-2">
              {districtKeys.map((key) => (
                <label key={key} className="flex items-center gap-2 text-sm muted">
                  <input
                    type="checkbox"
                    name="districts"
                    value={key}
                    defaultChecked={district_keys.includes(key)}
                    className="h-4 w-4"
                  />
                  <span>{DISTRICTS[key][locale]}</span>
                </label>
              ))}
            </div>
          </div>

          <details className="stack group">
            <summary className="flex cursor-pointer items-center justify-between gap-3 py-1 list-none">
              <span className="text-xs font-semibold uppercase muted">
                {UI_STRINGS.filters_params_title[locale]} ({selectedTagLabels.length})
              </span>
              <span className="flex min-w-0 items-center gap-2 overflow-hidden">
                {selectedTagLabels.slice(0, 3).map((label) => (
                  <span key={label} className="pill text-xs whitespace-nowrap">
                    {label}
                  </span>
                ))}
                {selectedTagLabels.length > 3 && (
                  <span className="pill text-xs whitespace-nowrap">
                    +{selectedTagLabels.length - 3}
                  </span>
                )}
              </span>
              <span className="flex h-5 w-5 items-center justify-center text-gray-500 transition-transform group-open:rotate-180">
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                  className="h-4 w-4"
                >
                  <path
                    d="M5 8l5 5 5-5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </summary>
            <div className="grid gap-2 pt-3 md:grid-cols-3">
              {tagKeys.map((key) => (
                <label key={key} className="flex items-center gap-2 text-sm muted">
                  <input
                    type="checkbox"
                    name="tags"
                    value={key}
                    defaultChecked={tags.includes(key)}
                    className="h-4 w-4"
                  />
                  <span>{TAGS[key][locale]}</span>
                </label>
              ))}
            </div>
          </details>

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
            <button type="submit" className="btn btn-primary">
              {UI_STRINGS.apply[locale]}
            </button>
            <Link href={`/${locale}`} className="btn">
              {UI_STRINGS.reset[locale]}
            </Link>
          </div>
        </div>
      </form>

      <div className="grid w-full max-w-3xl mx-auto gap-6">
        {displayedHalls.length === 0 ? (
          <div className="text-sm muted">{UI_STRINGS.no_results[locale]}</div>
        ) : (
          <HallCardList items={cardItems} weekendLabel={WEEKEND_PRICE_LABEL[locale]} />
        )}
      </div>

      {(hasPrev || hasNext) && (
        <div className="flex items-center justify-between gap-3 w-full max-w-3xl mx-auto">
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
    </div>
  );
}
