"use client";

import Link from "next/link";
import { useState } from "react";
import { UI_STRINGS } from "@/domain/ui-strings";
import { type Locale } from "@/i18n";

const LOCALES: Locale[] = ["ru", "ro", "en"];

export default function Home() {
  const [locale, setLocale] = useState<Locale>("ru");

  return (
    <div className="page">
      <div className="panel p-6 sm:p-8">
        <div className="stack">
          <div className="flex flex-wrap gap-2">
            {LOCALES.map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLocale(code)}
                className={
                  code === locale
                    ? "pill text-sm font-semibold"
                    : "pill text-sm muted"
                }
                aria-pressed={code === locale}
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="stack">
            <h1 className="text-3xl font-semibold text-gray-900 sm:text-4xl">
              {UI_STRINGS.landing_title[locale]}
            </h1>
            <p className="text-base muted sm:text-lg">{UI_STRINGS.landing_body[locale]}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href={`/${locale}`} className="btn btn-primary">
              {UI_STRINGS.landing_cta[locale]}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
