"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { UI_STRINGS } from "@/domain/ui-strings";
import { type Locale } from "@/i18n";
import centralImage from "../../design/central.png";
import hall1Image from "../../design/hall1.png";
import hall2Image from "../../design/hall2.png";
import hall3Image from "../../design/hall3.png";
import hall4Image from "../../design/hall4.png";

const LOCALES: Locale[] = ["ru", "ro", "en"];

export default function Home() {
  const [locale, setLocale] = useState<Locale>("ru");

  return (
    <div className="page">
      <section className="panel landing-hero">
        <header className="landing-hero-header">
          <p className="landing-hero-brand">StudiosMD</p>
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
        </header>

        <div className="landing-hero-content">
          <h1 className="landing-hero-title">{UI_STRINGS.landing_title[locale]}</h1>
          <p className="landing-hero-body muted">{UI_STRINGS.landing_body[locale]}</p>
          <div className="landing-hero-cta-wrap">
            <Link href={`/${locale}`} className="btn btn-primary">
              {UI_STRINGS.landing_cta[locale]}
            </Link>
          </div>
        </div>

        <div className="landing-gallery" aria-hidden="true">
          <div className="landing-gallery-side">
            <figure className="landing-gallery-card">
              <Image src={hall1Image} alt="" className="landing-gallery-image" />
            </figure>
            <figure className="landing-gallery-card">
              <Image src={hall2Image} alt="" className="landing-gallery-image" />
            </figure>
          </div>

          <figure className="landing-gallery-central">
            <Image src={centralImage} alt="" className="landing-gallery-image" priority />
          </figure>

          <div className="landing-gallery-side">
            <figure className="landing-gallery-card">
              <Image src={hall3Image} alt="" className="landing-gallery-image" />
            </figure>
            <figure className="landing-gallery-card">
              <Image src={hall4Image} alt="" className="landing-gallery-image" />
            </figure>
          </div>
        </div>
      </section>
    </div>
  );
}
