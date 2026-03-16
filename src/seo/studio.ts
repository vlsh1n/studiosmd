const DEFAULT_STUDIO_SLUG = "studio";

export function slugifyStudioName(name: string) {
  const normalized = name
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

  return normalized.length > 0 ? normalized : DEFAULT_STUDIO_SLUG;
}

export function normalizeStudioSlug(slug: string) {
  return slugifyStudioName(slug);
}

export function buildStudioPath(slug: string) {
  return `/studios/${slug}`;
}

export function buildStudioHallPath(studioName: string, hallName: string) {
  return `/studios/${slugifyStudioName(studioName)}/${slugifyStudioName(hallName)}`;
}
