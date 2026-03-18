import type { Metadata } from "next";
import LandingPage from "@/app/LandingPage.client";
import { LOCALES, SITE_NAME, DEFAULT_CITY, absUrl, localePath } from "@/seo/site";

const ROOT_LANGUAGES = Object.fromEntries(
  LOCALES.map((locale) => [locale, absUrl(localePath(locale))])
);
const ROOT_CANONICAL_URL = absUrl("/");
const ROOT_SOCIAL_IMAGE_URL = absUrl("/og-image");
const ROOT_LOGO_URL = absUrl("/favicon-32x32.png");

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${ROOT_CANONICAL_URL}#website`,
  name: SITE_NAME,
  url: ROOT_CANONICAL_URL,
  inLanguage: ["ro", "ru", "en"],
  description: `Photography studio directory for ${DEFAULT_CITY}, Moldova — 21 studios`,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${ROOT_CANONICAL_URL}ro?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${ROOT_CANONICAL_URL}#organization`,
  name: SITE_NAME,
  url: ROOT_CANONICAL_URL,
  logo: ROOT_LOGO_URL,
  areaServed: {
    "@type": "City",
    name: DEFAULT_CITY,
    sameAs: "https://www.wikidata.org/wiki/Q21197",
  },
};
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
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <LandingPage />
    </>
  );
}
