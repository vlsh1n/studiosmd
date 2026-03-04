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

export function buildStudioSegment(id: string, name: string) {
  return `${id}-${slugifyStudioName(name)}`;
}

export function buildStudioPath(id: string, name: string) {
  return `/studios/${buildStudioSegment(id, name)}`;
}

export function buildStudioHallPath(studioName: string, hallName: string) {
  return `/studios/${slugifyStudioName(studioName)}/${slugifyStudioName(hallName)}`;
}

export function parseStudioSegment(segment: string) {
  const trimmed = segment.trim();
  if (trimmed.length === 0) {
    return {
      id: null,
      slug: null,
    };
  }

  const separatorIndex = trimmed.indexOf("-");
  if (separatorIndex === -1) {
    return {
      id: trimmed,
      slug: null,
    };
  }

  const id = trimmed.slice(0, separatorIndex).trim();
  const slug = trimmed.slice(separatorIndex + 1).trim();

  return {
    id: id.length > 0 ? id : null,
    slug: slug.length > 0 ? slug : null,
  };
}
