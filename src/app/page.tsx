import type { Metadata } from "next";
import LandingPage from "@/app/LandingPage.client";
import { LOCALES, SITE_NAME, absUrl, localePath } from "@/seo/site";

const ROOT_LANGUAGES = Object.fromEntries(
  LOCALES.map((locale) => [locale, absUrl(localePath(locale))])
);

export const metadata: Metadata = {
  title: `${SITE_NAME} — Photo studios directory in Chișinău`,
  description: "Choose a locale and browse photo studios in Chișinău by price, district, and options.",
  alternates: {
    canonical: absUrl("/"),
    languages: {
      ...ROOT_LANGUAGES,
      "x-default": absUrl("/"),
    },
  },
};

export default function Home() {
  return <LandingPage />;
}
