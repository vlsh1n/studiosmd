import { locales, type Locale } from "@/i18n";

export const SITE_NAME = "StudiosMD";
export const DEFAULT_LOCALE: Locale = "ru";
export const LOCALES = locales;

const FALLBACK_SITE_URL = "http://localhost:3000";

function resolveSiteUrl() {
  const rawValue = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!rawValue || rawValue.length === 0) {
    return FALLBACK_SITE_URL;
  }

  const withProtocol = /^https?:\/\//i.test(rawValue) ? rawValue : `https://${rawValue}`;
  const normalized = withProtocol.replace(/\/+$/, "");
  try {
    const parsed = new URL(normalized);
    return parsed.origin;
  } catch {
    return FALLBACK_SITE_URL;
  }
}

export const SITE_URL = resolveSiteUrl();

export function absUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalizedPath, SITE_URL).toString();
}

export function localePath(locale: Locale, path = "") {
  if (!path || path === "/") {
    return `/${locale}`;
  }
  return `/${locale}${path.startsWith("/") ? path : `/${path}`}`;
}
