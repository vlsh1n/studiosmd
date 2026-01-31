import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { isLocale, t } from "@/i18n";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

const SEO_COPY = {
  ru: {
    title: "StudiosMD — фотостудии Кишинёв",
    description:
      "Каталог залов фотостудий в Кишинёве: цены, теги, дневной свет, условия.",
  },
  ro: {
    title: "StudiosMD — studiouri foto Chișinău",
    description:
      "Catalog de săli de studio foto în Chișinău: prețuri, taguri, lumină naturală, condiții.",
  },
  en: {
    title: "StudiosMD — photo studios Chisinau",
    description: "Catalog of photo studio rooms in Chisinau: pricing, tags, daylight, terms.",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const seo = SEO_COPY[locale as keyof typeof SEO_COPY] ?? SEO_COPY.en;

  return {
    title: seo.title,
    description: seo.description,
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <div className="page">
      <div className="panel p-5 sm:p-7">
        <header className="flex items-center justify-between gap-4">
          <div className="text-lg font-semibold text-black">
            {t(locale, "projectName")}
          </div>
          <div className="pill">
            <LocaleSwitcher locale={locale} />
          </div>
        </header>
        <main className="stack pt-6">{children}</main>
      </div>
    </div>
  );
}
