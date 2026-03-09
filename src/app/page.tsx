import type { Metadata } from "next";
import LandingPage from "@/app/LandingPage.client";
import { LOCALES, SITE_NAME, absUrl, localePath } from "@/seo/site";

const ROOT_LANGUAGES = Object.fromEntries(
  LOCALES.map((locale) => [locale, absUrl(localePath(locale))])
);
const ROOT_CANONICAL_URL = absUrl("/");
const ROOT_SOCIAL_IMAGE_URL = absUrl("/og-image");
const ROOT_TITLE = `${SITE_NAME} — Catalog de studiouri foto în Chișinău`;
const ROOT_DESCRIPTION =
  "Alege limba și găsește rapid studiouri foto în Chișinău după preț, sector și opțiuni.";

export const metadata: Metadata = {
  title: ROOT_TITLE,
  description: ROOT_DESCRIPTION,
  alternates: {
    canonical: ROOT_CANONICAL_URL,
    languages: {
      ...ROOT_LANGUAGES,
      "x-default": ROOT_CANONICAL_URL,
    },
  },
  openGraph: {
    type: "website",
    url: ROOT_CANONICAL_URL,
    siteName: SITE_NAME,
    title: ROOT_TITLE,
    description: ROOT_DESCRIPTION,
    images: [
      {
        url: ROOT_SOCIAL_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: "Catalog de studiouri foto în Chișinău",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: ROOT_TITLE,
    description: ROOT_DESCRIPTION,
    images: [ROOT_SOCIAL_IMAGE_URL],
  },
};

export default function Home() {
  return <LandingPage />;
}
