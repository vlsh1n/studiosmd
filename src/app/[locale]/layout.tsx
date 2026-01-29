import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { isLocale, t } from "@/i18n";

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export const metadata: Metadata = {
  title: "StudiosMD",
  description: "Studios catalog",
};

export default function LocaleLayout({ children, params }: Props) {
  const { locale } = params;

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
