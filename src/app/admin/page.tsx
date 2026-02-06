import { DistrictKey } from "@prisma/client";
import { prisma } from "@/db/prisma";
import { TAGS } from "@/domain/dictionaries";
import { createHallAction, createStudioAction } from "./actions";

type SearchParams = {
  token?: string | string[];
  ok?: string | string[];
  error?: string | string[];
};

type Props = {
  searchParams?: Promise<SearchParams>;
};

function readQueryValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function getStudioName(value: unknown) {
  if (!value || typeof value !== "object") return "";
  const obj = value as Record<string, unknown>;
  const ru = obj.ru;
  const ro = obj.ro;
  const en = obj.en;
  if (typeof ru === "string" && ru.trim()) return ru;
  if (typeof ro === "string" && ro.trim()) return ro;
  if (typeof en === "string" && en.trim()) return en;
  return "";
}

export default async function AdminPage({ searchParams }: Props) {
  const query = (await searchParams) ?? {};
  const token = readQueryValue(query.token).trim();
  const ok = readQueryValue(query.ok);
  const error = readQueryValue(query.error);

  const envToken = process.env.ADMIN_TOKEN?.trim();
  const isAuthorized = Boolean(envToken && token && token === envToken);

  if (!isAuthorized) {
    return (
      <div className="page">
        <div className="panel p-6">
          <div className="text-lg font-semibold text-gray-900">Access denied</div>
        </div>
      </div>
    );
  }

  const studios = await prisma.studio.findMany({
    select: {
      id: true,
      name_i18n: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  const districtValues = Object.values(DistrictKey);
  const tagKeys = (Object.keys(TAGS) as Array<keyof typeof TAGS>).sort((a, b) =>
    TAGS[a].ru.localeCompare(TAGS[b].ru, "ru")
  );

  return (
    <div className="page">
      <div className="panel stack p-5 sm:p-7">
        <h1 className="text-2xl font-semibold text-gray-900">Admin</h1>

        {ok && (
          <div className="pill w-fit text-sm">
            Saved: {ok === "studio" ? "studio" : ok === "hall" ? "hall" : "ok"}
          </div>
        )}
        {error === "price" && (
          <div className="pill w-fit text-sm">Price must be greater than 0.</div>
        )}

        <section className="card stack p-4 sm:p-5">
          <h2 className="text-lg font-semibold text-gray-900">Existing studios</h2>
          {studios.length === 0 ? (
            <div className="text-sm muted">No studios yet.</div>
          ) : (
            <div className="stack gap-2 text-sm">
              {studios.map((studio) => (
                <div key={studio.id} className="rounded border border-gray-200 bg-white p-3">
                  <div className="font-medium text-gray-900">
                    {getStudioName(studio.name_i18n) || "Untitled studio"}
                  </div>
                  <div className="text-xs muted">{studio.id}</div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="card stack p-4 sm:p-5">
          <h2 className="text-lg font-semibold text-gray-900">Create studio</h2>
          <form action={createStudioAction} className="stack gap-3">
            <input type="hidden" name="token" value={token} />

            <div className="grid gap-3 sm:grid-cols-3">
              <label className="stack gap-1 text-sm">
                <span>Studio name (RU)</span>
                <input name="studio_name_ru" className="input" required />
              </label>
              <label className="stack gap-1 text-sm">
                <span>Studio name (RO)</span>
                <input name="studio_name_ro" className="input" required />
              </label>
              <label className="stack gap-1 text-sm">
                <span>Studio name (EN)</span>
                <input name="studio_name_en" className="input" required />
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <label className="stack gap-1 text-sm">
                <span>Address (RU)</span>
                <input name="studio_address_ru" className="input" required />
              </label>
              <label className="stack gap-1 text-sm">
                <span>Address (RO)</span>
                <input name="studio_address_ro" className="input" required />
              </label>
              <label className="stack gap-1 text-sm">
                <span>Address (EN)</span>
                <input name="studio_address_en" className="input" required />
              </label>
            </div>

            <label className="stack gap-1 text-sm">
              <span>District</span>
              <select name="district_key" className="select" defaultValue={DistrictKey.centru}>
                {districtValues.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </label>

            <label className="stack gap-1 text-sm">
              <span>Cover images (one URL per line)</span>
              <textarea
                name="cover_images"
                className="input min-h-28"
                placeholder={"https://...\nhttps://..."}
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="stack gap-1 text-sm">
                <span>Phone</span>
                <input name="studio_phone" className="input" />
              </label>
              <label className="stack gap-1 text-sm">
                <span>Instagram URL</span>
                <input name="studio_instagram" className="input" placeholder="https://instagram.com/..." />
              </label>
            </div>

            <div>
              <button type="submit" className="btn btn-primary">
                Create studio
              </button>
            </div>
          </form>
        </section>

        <section className="card stack p-4 sm:p-5">
          <h2 className="text-lg font-semibold text-gray-900">Create hall</h2>
          <form action={createHallAction} className="stack gap-3">
            <input type="hidden" name="token" value={token} />

            <label className="stack gap-1 text-sm">
              <span>Studio</span>
              <select name="studio_id" className="select" required>
                <option value="">Select studio</option>
                {studios.map((studio) => (
                  <option key={studio.id} value={studio.id}>
                    {(getStudioName(studio.name_i18n) || "Untitled studio") + ` (${studio.id})`}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid gap-3 sm:grid-cols-3">
              <label className="stack gap-1 text-sm">
                <span>Hall name (RU)</span>
                <input name="hall_name_ru" className="input" required />
              </label>
              <label className="stack gap-1 text-sm">
                <span>Hall name (RO)</span>
                <input name="hall_name_ro" className="input" required />
              </label>
              <label className="stack gap-1 text-sm">
                <span>Hall name (EN)</span>
                <input name="hall_name_en" className="input" required />
              </label>
            </div>

            <label className="stack gap-1 text-sm">
              <span>Images (one URL per line)</span>
              <textarea
                name="hall_images"
                className="input min-h-28"
                placeholder={"https://...\nhttps://..."}
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="stack gap-1 text-sm">
                <span>Price per hour</span>
                <input name="price_per_hour" type="number" min={1} className="input" required />
              </label>
              <label className="stack gap-1 text-sm">
                <span>Weekend price (optional)</span>
                <input name="weekend_price" type="number" min={1} className="input" />
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="stack gap-1 text-sm">
                <span>Daylight</span>
                <select name="daylight" className="select" defaultValue="no">
                  <option value="no">no</option>
                  <option value="yes">yes</option>
                </select>
              </label>
              <label className="stack gap-1 text-sm">
                <span>Video friendly</span>
                <select name="video_friendly" className="select" defaultValue="no">
                  <option value="no">no</option>
                  <option value="yes">yes</option>
                </select>
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" name="props_available" className="h-4 w-4" />
                <span>Furniture</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="flash_available" className="h-4 w-4" />
                <span>Flash light</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="continuous_available" className="h-4 w-4" />
                <span>Continuous light</span>
              </label>
            </div>

            <div className="stack gap-2 text-sm">
              <span>Tags</span>
              <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
                {tagKeys.map((key) => {
                  const id = `hall-tag-${key}`;
                  return (
                    <div key={key} className="rounded border border-gray-200 bg-white p-2">
                      <div className="flex items-start gap-2">
                        <input
                          id={id}
                          type="checkbox"
                          name="tags"
                          value={key}
                          className="mt-0.5 h-4 w-4"
                        />
                        <label htmlFor={id} className="flex cursor-pointer flex-col gap-0.5">
                          <span className="text-sm text-gray-900">{TAGS[key].ru}</span>
                          <span className="text-xs muted">{key}</span>
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <button type="submit" className="btn btn-primary">
                Create hall
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
