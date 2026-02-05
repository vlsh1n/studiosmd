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
  const phone = getContact(studio.contacts as Contacts, "phone");
  const instagram = getContact(studio.contacts as Contacts, "instagram");
  const telegram = getContact(studio.contacts as Contacts, "telegram");

  return (
    <div className="stack">
      <section className="card stack p-4">
        <div className="stack gap-1">
          <h1 className="text-2xl font-semibold text-gray-900">{studio.name}</h1>
          <div className="text-sm muted">
            {studio.address} · {DISTRICTS[studio.district_key][locale]}
          </div>
        </div>
        <div className="flex flex-wrap gap-3 text-sm muted">
          {phone && <span>{phone}</span>}
          {instagram && <span>{instagram}</span>}
          {telegram && <span>{telegram}</span>}
        </div>
      </section>

      {coverImages.length > 0 && (
        <section className="card p-4">
          <div className="grid gap-3 sm:grid-cols-2">
          {coverImages.map((image) => (
            <img
              key={image}
              src={image}
              alt={studio.name}
              className="h-48 w-full rounded object-cover"
            />
          ))}
          </div>
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

            return (
              <article
                key={hall.id}
                id={`hall-${hall.id}`}
                className="card stack p-5"
              >
                <div className="stack gap-1">
                  <h2 className="text-lg font-semibold text-gray-900">{hall.name}</h2>
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
                    <span>реквизит {hall.props_available ? "✓" : "—"}</span>
                    <span>оборудование {hall.equipment_available ? "✓" : "—"}</span>
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
