import Link from "next/link";
import { notFound } from "next/navigation";
import HtmlLangSync from "@/components/HtmlLangSync.client";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { SupportMenu } from "@/components/SupportMenu.client";
import { UI_STRINGS } from "@/domain/ui-strings";
import { isLocale, t } from "@/i18n";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

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
          <header className="flex flex-wrap items-center justify-between gap-4">
            <Link
              href={`/${locale}`}
              className="min-w-0 text-lg font-semibold text-black"
            >
              {t(locale, "projectName")}
            </Link>
            <div className="sm:hidden w-full flex items-center gap-3">
              <SupportMenu locale={locale} align="left" />
              <div className="ml-auto">
                <LocaleSwitcher locale={locale} compact />
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 shrink-0 max-w-full">
              <SupportMenu locale={locale} />
              <LocaleSwitcher locale={locale} />
            </div>
          </header>
          <main className="stack pt-6">{children}</main>
          <footer className="mt-6 border-t border-[var(--glass-border)] pt-4">
            <p className="text-xs leading-relaxed muted">{UI_STRINGS.footer_disclaimer[locale]}</p>
          </footer>
        </div>
      </div>
    </>
  );
}
