"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const COPY = {
  ru: {
    title: "Каталог залов фотостудий Кишинёва",
    body: "Быстро выбирайте зал по цене, свету и тегам. Сравнивайте карточки и переходите к студии с фокусом на выбранный зал.",
    cta: "Искать студию",
  },
  ro: {
    title: "Catalog de săli de studio foto în Chișinău",
    body: "Alegeți rapid sala după preț, lumină și taguri. Comparați cardurile și deschideți studioul cu focus pe sala aleasă.",
    cta: "Caută studio",
  },
  en: {
    title: "Photo studio halls in Chisinau",
    body: "Quickly pick a hall by price, daylight, and tags. Compare cards and jump to the studio with the selected hall in focus.",
    cta: "Find a studio",
  },
} as const;

type Locale = keyof typeof COPY;

const LOCALES: Locale[] = ["ru", "ro", "en"];

export default function Home() {
  const [locale, setLocale] = useState<Locale>("ru");
  const content = useMemo(() => COPY[locale], [locale]);

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
              {content.title}
            </h1>
            <p className="text-base muted sm:text-lg">{content.body}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href={`/${locale}`} className="btn btn-primary">
              {content.cta}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
