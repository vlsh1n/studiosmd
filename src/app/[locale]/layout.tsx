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
    <div className="min-h-screen">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6">
        <div className="text-lg font-semibold text-black">
          {t(locale, "projectName")}
        </div>
        <LocaleSwitcher locale={locale} />
      </header>
      <main className="mx-auto w-full max-w-5xl px-6 pb-16">{children}</main>
    </div>
  );
}
