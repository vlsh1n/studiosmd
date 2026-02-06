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

function shuffleArray<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function factIcon(value: unknown) {
  return value === true || value === "yes" ? "✅" : "❌";
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
  const rawSort = Array.isArray(query.sort) ? query.sort[0] : query.sort;
  const sort =
    rawSort === "price_asc" || rawSort === "price_desc" || rawSort === "random"
      ? rawSort
      : "random";
  const halls = (await listHalls({
    locale,
    q,
    district_keys,
    tags,
    sort: sort === "random" ? undefined : sort,
  })) as HallListItem[];
  const displayedHalls = sort === "random" ? shuffleArray(halls) : halls;

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

      <div className="grid gap-6 md:grid-cols-2">
        {displayedHalls.length === 0 ? (
          <div className="text-sm muted">{UI_STRINGS.no_results[locale]}</div>
        ) : (
          displayedHalls.map((hall) => {
            const hallImage = getImageFromJson(hall.images);
            const studioImage = getImageFromJson(hall.studio.cover_images);
            const image = hallImage ?? studioImage;
            const tagLabels = hall.tags.map(
              (tag) => TAGS[tag as keyof typeof TAGS]?.[locale] ?? tag
            );
            const hallRecord = hall as Record<string, unknown>;
            const flashAvailable = hallRecord.flash_available === true;
            const continuousAvailable = hallRecord.continuous_available === true;

            const hallId = encodeURIComponent(hall.id);
            const hallHref = `/${locale}/studios/${hall.studio.id}?hallId=${hallId}#hall-${hallId}`;

            return (
              <article key={hall.id} className="card p-4 sm:p-5">
                <div className="stack gap-4 lg:grid lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start">
                  <div className="h-48 w-full overflow-hidden rounded bg-gray-100 sm:h-52 lg:h-56">
                    {image ? (
                      <img
                        src={image}
                        alt={hall.name}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="stack gap-3 min-w-0">
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
                        {hall.price_per_hour}
                        {"\u00A0"}MDL {UI_STRINGS.per_hour[locale]}
                      </div>
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
                          {"\u00A0"}MDL
                        </span>
                      )}
                      <span>
                        {UI_STRINGS.daylight_fact_label[locale]} {factIcon(hall.daylight)}
                      </span>
                      <span>
                        {UI_STRINGS.video_allowed_label[locale]}{" "}
                        {factIcon(hall.video_friendly)}
                      </span>
                      <span>
                        {UI_STRINGS.furniture_label[locale]}{" "}
                        {factIcon(hall.props_available)}
                      </span>
                      <span>
                        {UI_STRINGS.flash_light_label[locale]} {factIcon(flashAvailable)}
                      </span>
                      <span>
                        {UI_STRINGS.continuous_light_label[locale]}{" "}
                        {factIcon(continuousAvailable)}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {tagLabels.map((tag) => (
                        <span key={tag} className="pill text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div>
                      <Link href={hallHref} className="btn btn-primary">
                        {UI_STRINGS.view_hall_cta[locale]}
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
