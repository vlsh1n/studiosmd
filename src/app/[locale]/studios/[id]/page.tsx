import { notFound } from "next/navigation";
import { getStudioById } from "@/db/queries";
import { DISTRICTS, TAGS } from "@/domain/dictionaries";
import { UI_STRINGS } from "@/domain/ui-strings";
import { isLocale, type Locale } from "@/i18n";
import { safeExternalUrl } from "@/lib/url";
import HallCardList, {
  type StudioHallCardItem,
} from "@/app/[locale]/studios/[id]/HallCardList.client";
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
  const hasStudioCta = Boolean(instagramHref || phoneHref || yandexMapsHref || googleMapsHref);
  const hallCards: StudioHallCardItem[] = studio.halls.map((hall) => {
    const images = getImageList(hall.images as JsonArray);
    const tags = hall.tags.filter(isTagKey).map((tag) => TAGS[tag][locale]);
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

          {hasStudioCta && (
            <div className="flex flex-wrap gap-2">
              {instagramHref && (
                <a
                  href={instagramHref}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="pill ui-pill-control text-sm font-medium"
                >
                  <img
                    src="/icons/instagram.png"
                    alt=""
                    aria-hidden="true"
                    className="h-4 w-4 object-contain"
                    loading="lazy"
                  />
                  <span>{UI_STRINGS.instagram_cta[locale]}</span>
                </a>
              )}

              {phone && phoneHref && (
                <a
                  href={`tel:${phoneHref}`}
                  className="pill ui-pill-control text-sm font-medium"
                >
                  <img
                    src="/icons/telephone.png"
                    alt=""
                    aria-hidden="true"
                    className="h-4 w-4 object-contain"
                    loading="lazy"
                  />
                  <span>{phone}</span>
                </a>
              )}

              {yandexMapsHref && (
                <a
                  href={yandexMapsHref}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="pill ui-pill-control text-sm font-medium"
                >
                  <img
                    src="/icons/yandex_maps.png"
                    alt=""
                    aria-hidden="true"
                    className="h-4 w-4 object-contain"
                    loading="lazy"
                  />
                  <span>{UI_STRINGS.yandex_maps_cta[locale]}</span>
                </a>
              )}

              {googleMapsHref && (
                <a
                  href={googleMapsHref}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="pill ui-pill-control text-sm font-medium"
                >
                  <img
                    src="/icons/google_maps.png"
                    alt=""
                    aria-hidden="true"
                    className="h-4 w-4 object-contain"
                    loading="lazy"
                  />
                  <span>{UI_STRINGS.google_maps_cta[locale]}</span>
                </a>
              )}
            </div>
          )}
        </div>
      </section>

      <HallFocus />
      <section className="stack">
        <HallCardList
          halls={hallCards}
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
