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
      <div className="relative flex items-center">
        <select
          id="locale-switcher-compact"
          value={locale}
          onChange={onChangeLocale}
          className="select h-11 w-[5.9rem] appearance-none rounded-full bg-[var(--surface)] py-2 pl-3 pr-8 text-sm font-semibold leading-none shadow-sm"
        >
          {locales.map((nextLocale) => (
            <option key={nextLocale} value={nextLocale}>
              {labels[nextLocale]}
            </option>
          ))}
        </select>
        <svg
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
          className="pointer-events-none absolute right-3 h-4 w-4 text-gray-600"
        >
          <path
            d="M5 8l5 5 5-5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
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
