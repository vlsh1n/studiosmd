"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import HtmlLangSync from "@/components/HtmlLangSync.client";
import { SupportMenu } from "@/components/SupportMenu.client";
import { UI_STRINGS } from "@/domain/ui-strings";
import { type Locale } from "@/i18n";
import centralImage from "../../design/central.png";
import hall1Image from "../../design/hall1.png";
import hall2Image from "../../design/hall2.png";
import hall3Image from "../../design/hall3.png";
import hall4Image from "../../design/hall4.png";

const LOCALES: Locale[] = ["ro", "ru", "en"];

export default function LandingPage() {
  const [locale, setLocale] = useState<Locale>("ro");
  const supportProjectHref = "https://ko-fi.com/voloshinw";

  return (
    <div className="page">
      <HtmlLangSync locale={locale} />
      <section className="panel landing-hero">
        <header className="landing-hero-header">
          <p className="landing-hero-brand">studiosmap</p>
          <div className="sm:hidden inline-flex items-center gap-3 ml-auto">
            <SupportMenu locale={locale} align="center" iconOnly />
            <div className="relative flex items-center">
              <select
                id="landing-locale-switcher-compact"
                value={locale}
                onChange={(event) => setLocale(event.target.value as Locale)}
                className="select h-11 w-[5.9rem] appearance-none rounded-full bg-[var(--surface)] py-2 pl-3 pr-8 text-sm font-semibold leading-none shadow-sm"
              >
                {LOCALES.map((code) => (
                  <option key={code} value={code}>
                    {code.toUpperCase()}
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
          </div>

          <div className="landing-hero-controls hidden sm:inline-flex">
            <SupportMenu locale={locale} />

            <div className="landing-hero-locales">
              {LOCALES.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLocale(code)}
                  className={`pill ui-pill-control text-sm font-semibold${code === locale ? " ui-pill-control-active" : ""}`}
                  aria-pressed={code === locale}
                  data-active={code === locale ? "true" : "false"}
                >
                  {code.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="landing-hero-content">
          <h1 className="landing-hero-title">{UI_STRINGS.landing_title[locale]}</h1>
          <p className="landing-hero-body muted">{UI_STRINGS.landing_body[locale]}</p>
          <div className="landing-hero-cta-wrap">
            <Link href={`/${locale}`} className="btn btn-primary">
              {UI_STRINGS.landing_cta[locale]}
            </Link>
            <a
              href={supportProjectHref}
              target="_blank"
              rel="noreferrer noopener"
              className="btn"
            >
              {UI_STRINGS.support_project_cta[locale]}
            </a>
          </div>
        </div>

        <div className="landing-gallery" aria-hidden="true">
          <figure className="landing-gallery-card landing-gallery-card-left-outer">
            <Image src={hall1Image} alt="" className="landing-gallery-image" />
          </figure>
          <figure className="landing-gallery-card landing-gallery-card-left-inner">
            <Image src={hall2Image} alt="" className="landing-gallery-image" />
          </figure>

          <figure className="landing-gallery-central">
            <Image src={centralImage} alt="" className="landing-gallery-image" priority />
          </figure>

          <figure className="landing-gallery-card landing-gallery-card-right-inner">
            <Image src={hall3Image} alt="" className="landing-gallery-image" />
          </figure>
          <figure className="landing-gallery-card landing-gallery-card-right-outer">
            <Image src={hall4Image} alt="" className="landing-gallery-image" />
          </figure>
        </div>

        <footer className="mt-6 border-t border-[var(--glass-border)] pt-4">
          <p className="text-xs leading-relaxed muted">{UI_STRINGS.footer_disclaimer[locale]}</p>
        </footer>
      </section>
    </div>
  );
}
