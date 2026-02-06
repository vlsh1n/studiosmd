import { notFound } from "next/navigation";
import { getStudioById } from "@/db/queries";
import { DISTRICTS, TAGS } from "@/domain/dictionaries";
import { UI_STRINGS } from "@/domain/ui-strings";
import { isLocale } from "@/i18n";
import HallGalleryZoom from "@/app/[locale]/studios/[id]/HallGalleryZoom";
import HallFocus from "@/components/HallFocus";

type Props = {
  params: { locale: string; id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

type Contacts = Record<string, unknown> | null | undefined;

type JsonArray = unknown[] | null | undefined;

function getStringsFromJson(value: JsonArray) {
  if (!Array.isArray(value)) return [];
  return value.filter((item) => typeof item === "string") as string[];
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

function factIcon(value: unknown) {
  return value === true || value === "yes" ? "✅" : "❌";
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
  const instagram = getContact(studio.contacts as Contacts, "instagram");

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
        <div className="text-lg font-semibold text-gray-900">{UI_STRINGS.tags_title[locale]}</div>
        <div className="grid gap-6 md:grid-cols-2">
          {studio.halls.map((hall) => {
            const images = getImageList(hall.images as JsonArray);
            const tags = hall.tags.map(
              (tag) => TAGS[tag as keyof typeof TAGS]?.[locale] ?? tag
            );
            const hallRecord = hall as Record<string, unknown>;
            const flashAvailable = hallRecord.flash_available === true;
            const continuousAvailable = hallRecord.continuous_available === true;

            return (
              <article
                key={hall.id}
                id={`hall-${hall.id}`}
                className="card stack p-5"
              >
                <div className="stack gap-1">
                  <h2 className="text-lg font-semibold text-gray-900">{hall.name}</h2>
                  <div className="text-sm font-semibold text-gray-900">
                    {hall.price_per_hour}
                    {"\u00A0"}MDL {UI_STRINGS.per_hour[locale]}
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs muted">
                    {typeof hall.area_sqm === "number" && (
                      <span>{hall.area_sqm} м²</span>
                    )}
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
                      {UI_STRINGS.furniture_label[locale]} {factIcon(hall.props_available)}
                    </span>
                    <span>
                      {UI_STRINGS.flash_light_label[locale]} {factIcon(flashAvailable)}
                    </span>
                    <span>
                      {UI_STRINGS.continuous_light_label[locale]}{" "}
                      {factIcon(continuousAvailable)}
                    </span>
                  </div>
                </div>
                {images.length > 0 && (
                  <HallGalleryZoom images={images} alt={hall.name} />
                )}
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span key={tag} className="pill text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
