import Link from "next/link";
import { notFound } from "next/navigation";
import KofiMobileHeaderButton from "@/components/KofiMobileHeaderButton.client";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
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
  const contactsLabel = UI_STRINGS.contacts_cta[locale];
  const contactsHref = "https://t.me/studiosmd";

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
          <div className="sm:hidden w-full flex items-center gap-2">
            <KofiMobileHeaderButton />
            <a
              href={contactsHref}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={contactsLabel}
              title={contactsLabel}
              className="pill ui-pill-control h-10 w-10 justify-center p-0"
            >
              <img
                src="/icons/telegram.png"
                alt=""
                aria-hidden="true"
                className="h-5 w-5 object-contain brightness-0 transition"
                loading="lazy"
              />
            </a>
            <div className="ml-auto">
              <LocaleSwitcher locale={locale} compact />
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 shrink-0 max-w-full">
            <a
              href={contactsHref}
              target="_blank"
              rel="noreferrer noopener"
              className="pill ui-pill-control text-sm font-medium"
            >
              <img
                src="/icons/telegram.png"
                alt=""
                aria-hidden="true"
                className="h-4 w-4 object-contain brightness-0 transition"
                loading="lazy"
              />
              <span>{contactsLabel}</span>
            </a>
            <LocaleSwitcher locale={locale} />
          </div>
        </header>
        <main className="stack pt-6">{children}</main>
      </div>
    </div>
  );
}
