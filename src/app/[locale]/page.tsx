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
  params: Promise<{ locale: string }>;
  searchParams: Promise<SearchParams>;
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

  const query = await searchParams;
  const q = Array.isArray(query.q) ? query.q[0] : query.q;
  const district_keys = parseCsvParam(query.districts).filter((key): key is keyof typeof DISTRICTS =>
    districtKeys.includes(key as keyof typeof DISTRICTS)
  );
  const tags = parseCsvParam(query.tags).filter((key): key is keyof typeof TAGS =>
    tagKeys.includes(key as keyof typeof TAGS)
  );
  const price_min = parseNumberParam(query.priceMin);
  const price_max = parseNumberParam(query.priceMax);

  const halls = (await listHalls({
    locale,
    q,
    district_keys,
    tags,
    price_min,
    price_max,
  })) as HallListItem[];

  return (
    <div className="space-y-8">
      <form className="space-y-6" method="get">
        <div className="space-y-2">
          <input
            type="search"
            name="q"
            placeholder={UI_STRINGS.search_placeholder[locale]}
            defaultValue={q ?? ""}
            className="w-full rounded border border-gray-200 px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-6 rounded border border-gray-200 p-4">
          <div className="text-sm font-semibold text-gray-900">
            {UI_STRINGS.filters_title[locale]}
          </div>

          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase text-gray-500">
              {UI_STRINGS.districts_title[locale]}
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              {districtKeys.map((key) => (
                <label key={key} className="flex items-center gap-2 text-sm">
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

          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase text-gray-500">
              {UI_STRINGS.tags_title[locale]}
            </div>
            <div className="grid gap-2 md:grid-cols-3">
              {tagKeys.map((key) => (
                <label key={key} className="flex items-center gap-2 text-sm">
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
          </div>

          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase text-gray-500">
              {UI_STRINGS.price_title[locale]}
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                type="number"
                name="priceMin"
                placeholder="Min"
                defaultValue={price_min?.toString() ?? ""}
                className="w-28 rounded border border-gray-200 px-3 py-2 text-sm"
              />
              <input
                type="number"
                name="priceMax"
                placeholder="Max"
                defaultValue={price_max?.toString() ?? ""}
                className="w-28 rounded border border-gray-200 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              className="rounded bg-black px-4 py-2 text-sm font-semibold text-white"
            >
              {UI_STRINGS.apply[locale]}
            </button>
            <Link
              href={`/${locale}`}
              className="rounded border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700"
            >
              {UI_STRINGS.reset[locale]}
            </Link>
          </div>
        </div>
      </form>

      <div className="grid gap-4 md:grid-cols-2">
        {halls.length === 0 ? (
          <div className="text-sm text-gray-500">{UI_STRINGS.no_results[locale]}</div>
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
              <article
                key={hall.id}
                className="flex flex-col gap-3 rounded border border-gray-200 p-4"
              >
                <div className="flex gap-3">
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
                    <div className="text-sm text-gray-600">
                      {hall.studio.name} · {DISTRICTS[hall.studio.district_key][locale]}
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {hall.price_per_hour} {UI_STRINGS.per_hour[locale]}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                  {tagLabels.map((tag) => (
                    <span key={tag} className="rounded bg-gray-100 px-2 py-1">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="text-xs text-gray-600">{hall.studio.name}</div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
