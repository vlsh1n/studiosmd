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

type Contacts = Record<string, unknown> | null | undefined;

type JsonArray = unknown[] | null | undefined;

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

function getContact(contacts: Contacts, key: string) {
  if (!contacts || typeof contacts !== "object") return null;
  const value = contacts[key];
  return typeof value === "string" ? value : null;
}

function sanitizePhoneForTel(value: string) {
  return value.replace(/[\s()-]/g, "");
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

  const coverImages = getImageList(studio.cover_images as JsonArray);
  const coverImage = coverImages[0];
  const phone = getContact(studio.contacts as Contacts, "phone");
  const phoneHref = phone ? sanitizePhoneForTel(phone) : null;
  const instagram = safeExternalUrl(getContact(studio.contacts as Contacts, "instagram"));
  const hallCards: StudioHallCardItem[] = studio.halls.map((hall) => {
    const images = getImageList(hall.images as JsonArray);
    const tags = hall.tags.filter(isTagKey).map((tag) => TAGS[tag][locale]);
    const hallTagSet = new Set(hall.tags);
    const flashAvailable = hall.flash_available === true;
    const continuousAvailable = hall.continuous_available === true;
    const weekendPriceLine =
      typeof hall.weekend_price === "number" && hall.weekend_price > 0
        ? `${hall.weekend_price}\u00A0MDL ${UI_STRINGS.per_hour[locale]}`
        : null;
    const areaParts: string[] = [];
    if (typeof hall.area_sqm === "number" && hall.area_sqm > 0) {
      areaParts.push(`${hall.area_sqm} m\u00B2`);
    }
    if (hall.high_ceiling === true) {
      areaParts.push(UI_STRINGS.high_ceiling_label[locale]);
    }
    const spaceLine = areaParts.length > 0 ? areaParts.join(" • ") : null;

    const factLines: string[] = [];
    if (hall.daylight === "yes") {
      factLines.push(UI_STRINGS.daylight_fact_label[locale]);
    }
    if (hallTagSet.has("blackout")) {
      factLines.push(UI_STRINGS.blackout_fact_label[locale]);
    }
    if (hallTagSet.has("parking")) {
      factLines.push(UI_STRINGS.parking_fact_label[locale]);
    }
    if (hallTagSet.has("changing_room")) {
      factLines.push(UI_STRINGS.changing_room_fact_label[locale]);
    }
    if (hall.props_available === true) {
      factLines.push(UI_STRINGS.furniture_label[locale]);
    }
    if (flashAvailable) {
      factLines.push(UI_STRINGS.flash_light_label[locale]);
    }
    if (continuousAvailable) {
      factLines.push(UI_STRINGS.continuous_light_label[locale]);
    }

    return {
      id: hall.id,
      name: hall.name,
      priceLine: `${hall.price_per_hour}\u00A0MDL ${UI_STRINGS.per_hour[locale]}`,
      weekendPriceLine,
      spaceLine,
      factLines,
      tags,
      images,
    };
  });

  return (
    <div className="stack">
      <section className="card p-4 sm:p-5">
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
          <div className="stack gap-2">
            <h1 className="text-2xl font-semibold text-gray-900">{studio.name}</h1>
            <span className="pill w-fit text-xs">
              {DISTRICTS[studio.district_key][locale]}
            </span>
            <div className="text-sm muted">{studio.address}</div>
          </div>
          <div className="stack gap-2 sm:items-end">
            {phone && phoneHref && (
              <a
                href={`tel:${phoneHref}`}
                className="text-sm font-medium text-gray-900 underline underline-offset-2"
              >
                {phone}
              </a>
            )}
            {instagram && (
              <a
                href={instagram}
                target="_blank"
                rel="noreferrer noopener"
                className="btn"
              >
                Instagram
              </a>
            )}
          </div>
        </div>
      </section>

      {coverImage && (
        <section className="card p-4">
          <img
            src={coverImage}
            alt={studio.name}
            className="h-56 w-full rounded object-cover sm:h-64"
          />
        </section>
      )}

      <HallFocus />
      <section className="stack">
        <HallCardList halls={hallCards} weekendLabel={WEEKEND_PRICE_LABEL[locale]} />
      </section>
    </div>
  );
}
