import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { UI_STRINGS } from "@/domain/ui-strings";
import { isLocale, t } from "@/i18n";
import { safeExternalUrl } from "@/lib/url";

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
  const kofiUrl = safeExternalUrl(process.env.NEXT_PUBLIC_KOFI_URL);

  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <div className="page">
      <div className="panel p-5 sm:p-7">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href={`/${locale}`}
            className="min-w-0 text-lg font-semibold text-black"
          >
            {t(locale, "projectName")}
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            {kofiUrl && (
              <a
                href={kofiUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="btn"
              >
                {UI_STRINGS.support_project[locale]}
              </a>
            )}
            <div className="shrink-0 max-w-full">
              <LocaleSwitcher locale={locale} />
            </div>
          </div>
        </header>
        <main className="stack pt-6">{children}</main>
      </div>
    </div>
  );
}
