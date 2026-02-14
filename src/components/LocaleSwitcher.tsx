"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type ChangeEvent } from "react";
import { Locale, locales } from "@/i18n";

const labels: Record<Locale, string> = {
  ru: "RU",
  ro: "RO",
  en: "EN",
};

type Props = {
  locale: Locale;
  compact?: boolean;
};

export function LocaleSwitcher({ locale, compact = false }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const segments = pathname.split("/").filter(Boolean);
  const rest = segments.slice(1);

  if (compact) {
    function onChangeLocale(event: ChangeEvent<HTMLSelectElement>) {
      const nextLocale = event.target.value as Locale;
      if (nextLocale === locale) return;
      const href = "/" + [nextLocale, ...rest].join("/");
      router.push(href);
    }

    return (
      <div className="flex items-center">
        <select
          id="locale-switcher-compact"
          value={locale}
          onChange={onChangeLocale}
          className="select h-9 w-[4.8rem] rounded-full py-1 pl-2 pr-7 text-xs font-semibold leading-none"
        >
          {locales.map((nextLocale) => (
            <option key={nextLocale} value={nextLocale}>
              {labels[nextLocale]}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <nav className="flex items-center gap-2 text-sm font-medium">
      {locales.map((nextLocale) => {
        const href = "/" + [nextLocale, ...rest].join("/");
        const isActive = nextLocale === locale;

        return (
          <Link
            key={nextLocale}
            href={href}
            className={`pill ui-pill-control px-3 py-1 text-xs font-semibold${isActive ? " ui-pill-control-active" : ""}`}
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
