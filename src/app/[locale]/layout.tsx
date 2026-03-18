import Link from "next/link";
import { notFound } from "next/navigation";
import HtmlLangSync from "@/components/HtmlLangSync.client";
import { NavDrawer } from "@/components/NavDrawer.client";
import { isLocale, t } from "@/i18n";

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }
  return (
    <>
      <HtmlLangSync locale={locale} />
      <div className="page">
        <div className="panel p-5 sm:p-7">
          <header className="flex items-center justify-between">
            <Link
              href={`/${locale}`}
              className="min-w-0 text-lg font-semibold text-black"
            >
              {t(locale, "projectName")}
            </Link>
            <NavDrawer locale={locale} />
          </header>
          <main className="stack pt-6">{children}</main>
        </div>
      </div>
    </>
  );
}
