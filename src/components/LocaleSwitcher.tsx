"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Locale, locales } from "@/i18n";

const labels: Record<Locale, string> = {
  ru: "RU",
  ro: "RO",
  en: "EN",
};

type Props = {
  locale: Locale;
};

export function LocaleSwitcher({ locale }: Props) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const rest = segments.slice(1);

  return (
    <nav className="flex items-center gap-2 text-sm font-medium">
      {locales.map((nextLocale) => {
        const href = "/" + [nextLocale, ...rest].join("/");
        const isActive = nextLocale === locale;

        return (
          <Link
            key={nextLocale}
            href={href}
            className="pill ui-pill-control px-3 py-1 text-xs font-semibold"
            data-active={isActive ? "true" : "false"}
            aria-current={isActive ? "page" : undefined}
          >
            {labels[nextLocale]}
          </Link>
        );
      })}
    </nav>
  );
}
