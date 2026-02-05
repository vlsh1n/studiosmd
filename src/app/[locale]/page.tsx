import Link from "next/link";
import { notFound } from "next/navigation";
import { listHalls } from "@/db/queries";
import type { HallListItem } from "@/db/queries";
import { DISTRICTS, TAGS } from "@/domain/dictionaries";
import { UI_STRINGS } from "@/domain/ui-strings";
import { isLocale, Locale } from "@/i18n";

const districtKeys = Object.keys(DISTRICTS) as Array<keyof typeof DISTRICTS>;
const tagKeys = Object.keys(TAGS) as Array<keyof typeof TAGS>;

type SearchParams = Record<string, string | string[] | undefined>;

type Props = {
  params: { locale: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

function parseCsvParam(value?: string | string[]) {
  if (!value) return [];
  const items = Array.isArray(value) ? value : [value];
  return items
    .flatMap((item) => item.split(","))
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseNumberParam(value?: string | string[]) {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return undefined;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function getImageFromJson(value: unknown) {
  if (Array.isArray(value)) {
    const first = value.find((item) => typeof item === "string");
    return typeof first === "string" ? first : null;
  }
  return null;
}

function getStringsFromJson(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter((item) => typeof item === "string") as string[];
}

export default async function CatalogPage({ params, searchParams }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const query = (await searchParams) ?? {};
  const q = Array.isArray(query.q) ? query.q[0] : query.q;
  const district_keys = parseCsvParam(query.districts).filter((key): key is keyof typeof DISTRICTS =>
    districtKeys.includes(key as keyof typeof DISTRICTS)
  );
  const tags = parseCsvParam(query.tags).filter((key): key is keyof typeof TAGS =>
    tagKeys.includes(key as keyof typeof TAGS)
  );
  const selectedTagLabels = tags.map((tag) => TAGS[tag]?.[locale] ?? tag);
  const sort =
    query.sort === "price_asc" || query.sort === "price_desc"
      ? query.sort
      : undefined;
  const price_min = parseNumberParam(query.priceMin);
  const price_max = parseNumberParam(query.priceMax);

  const halls = (await listHalls({
    locale,
    q,
    district_keys,
    tags,
    price_min,
    price_max,
    sort,
  })) as HallListItem[];

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
            <div className="stack pt-3">
              <div className="text-xs font-semibold uppercase muted">
                {UI_STRINGS.sort_label[locale]}
              </div>
              <select
                name="sort"
                defaultValue={sort ?? "price_asc"}
                className="select w-full"
              >
                <option value="price_asc">{UI_STRINGS.sort_price_asc[locale]}</option>
                <option value="price_desc">{UI_STRINGS.sort_price_desc[locale]}</option>
              </select>
            </div>
          </details>

          <div className="stack">
            <div className="text-xs font-semibold uppercase muted">
              {UI_STRINGS.price_title[locale]}
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                type="number"
                name="priceMin"
                placeholder="Min"
                defaultValue={price_min?.toString() ?? ""}
                className="input w-28"
              />
              <input
                type="number"
                name="priceMax"
                placeholder="Max"
                defaultValue={price_max?.toString() ?? ""}
                className="input w-28"
              />
            </div>
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

      <div className="grid gap-6 md:grid-cols-2">
        {halls.length === 0 ? (
          <div className="text-sm muted">{UI_STRINGS.no_results[locale]}</div>
        ) : (
          halls.map((hall) => {
            const hallImage = getImageFromJson(hall.images);
            const studioImage = getImageFromJson(hall.studio.cover_images);
            const image = hallImage ?? studioImage;
            const tagLabels = hall.tags.map(
              (tag) => TAGS[tag as keyof typeof TAGS]?.[locale] ?? tag
            );

            const hallId = encodeURIComponent(hall.id);
            const hallHref = `/${locale}/studios/${hall.studio.id}?hallId=${hallId}#hall-${hallId}`;

            return (
              <article key={hall.id} className="card stack p-5">
                <div className="flex gap-4">
                  {image ? (
                    <img
                      src={image}
                      alt={hall.name}
                      className="h-24 w-32 rounded object-cover"
                    />
                  ) : (
                    <div className="h-24 w-32 rounded bg-gray-100" />
                  )}
                  <div className="space-y-1">
                    <h2 className="text-lg font-semibold text-gray-900">
                      <Link href={hallHref} className="underline">
                        {hall.name}
                      </Link>
                    </h2>
                    <div className="text-sm muted">
                      {hall.studio.name} · {DISTRICTS[hall.studio.district_key][locale]}
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {hall.price_per_hour} {UI_STRINGS.per_hour[locale]}
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs muted">
                      {typeof hall.area_sqm === "number" && (
                        <span>{hall.area_sqm} м²</span>
                      )}
                      <span>
                        {UI_STRINGS.min_label[locale]} {hall.minimum_hours}h
                      </span>
                      {typeof hall.weekend_price === "number" && (
                        <span>
                          {UI_STRINGS.weekend_label[locale]} {hall.weekend_price}
                        </span>
                      )}
                      <span>
                        {UI_STRINGS.daylight_short_label[locale]}{" "}
                        {hall.daylight === "yes"
                          ? "✓"
                          : hall.daylight === "limited"
                            ? "~"
                            : "—"}
                      </span>
                      <span>
                        {UI_STRINGS.video_short_label[locale]}{" "}
                        {hall.video_friendly === "yes"
                          ? "✓"
                          : hall.video_friendly === "limited"
                            ? "~"
                            : "—"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tagLabels.map((tag) => (
                    <span key={tag} className="pill text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="text-xs muted">{hall.studio.name}</div>
                <Link href={hallHref} className="btn btn-primary">
                  {UI_STRINGS.view_hall_cta[locale]}
                </Link>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
