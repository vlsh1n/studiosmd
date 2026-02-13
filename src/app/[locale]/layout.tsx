import Link from "next/link";
import { notFound } from "next/navigation";
import KofiMobileHeaderButton from "@/components/KofiMobileHeaderButton.client";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
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
    <div className="page">
      <div className="panel p-5 sm:p-7">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href={`/${locale}`}
            className="min-w-0 text-lg font-semibold text-black"
          >
            {t(locale, "projectName")}
          </Link>
          <div className="sm:hidden w-full flex items-center">
            <KofiMobileHeaderButton />
            <div className="ml-auto">
              <LocaleSwitcher locale={locale} />
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 shrink-0 max-w-full">
            <LocaleSwitcher locale={locale} />
          </div>
        </header>
        <main className="stack pt-6">{children}</main>
      </div>
    </div>
  );
}
