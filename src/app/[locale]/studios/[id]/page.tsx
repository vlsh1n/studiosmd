import { notFound } from "next/navigation";
import { getStudioById } from "@/db/queries";
import { DISTRICTS, TAGS } from "@/domain/dictionaries";
import { UI_STRINGS } from "@/domain/ui-strings";
import { isLocale } from "@/i18n";

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
  const { locale, id } = params;
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
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold text-gray-900">{studio.name}</h1>
        <div className="text-sm text-gray-600">
          {studio.address} · {DISTRICTS[studio.district_key][locale]}
        </div>
        <div className="flex flex-wrap gap-3 text-sm text-gray-700">
          {phone && <span>{phone}</span>}
          {instagram && <span>{instagram}</span>}
          {telegram && <span>{telegram}</span>}
        </div>
      </section>

      {coverImages.length > 0 && (
        <section className="grid gap-3 sm:grid-cols-2">
          {coverImages.map((image) => (
            <img
              key={image}
              src={image}
              alt={studio.name}
              className="h-48 w-full rounded object-cover"
            />
          ))}
        </section>
      )}

      <section className="space-y-4">
        <div className="text-lg font-semibold text-gray-900">{UI_STRINGS.tags_title[locale]}</div>
        <div className="grid gap-4 md:grid-cols-2">
          {studio.halls.map((hall) => {
            const images = getImageList(hall.images as JsonArray);
            const tags = hall.tags.map(
              (tag) => TAGS[tag as keyof typeof TAGS]?.[locale] ?? tag
            );

            return (
              <article key={hall.id} className="space-y-3 rounded border border-gray-200 p-4">
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold text-gray-900">{hall.name}</h2>
                  <div className="text-sm font-semibold text-gray-900">
                    {hall.price_per_hour} {UI_STRINGS.per_hour[locale]}
                  </div>
                </div>
                {images.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {images.slice(0, 3).map((image) => (
                      <img
                        key={image}
                        src={image}
                        alt={hall.name}
                        className="h-24 w-32 rounded object-cover"
                      />
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                  {tags.map((tag) => (
                    <span key={tag} className="rounded bg-gray-100 px-2 py-1">
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
