"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

export type HallFactKey =
  | "daylight"
  | "blackout"
  | "parking"
  | "changing_room"
  | "furniture"
  | "flash_light"
  | "continuous_light";

export type HallFactItem = {
  key: HallFactKey;
  label: string;
};

const FACT_ICON_BY_KEY: Record<HallFactKey, string> = {
  daylight: "/icons/daylight.png",
  blackout: "/icons/blackout.png",
  parking: "/icons/parking.png",
  changing_room: "/icons/changing_room.png",
  furniture: "/icons/furniture.png",
  flash_light: "/icons/flash_light.png",
  continuous_light: "/icons/continuous_light.png",
};

export type HallCardItem = {
  id: string;
  name: string;
  image: string | null;
  imageCount: number;
  hallHref: string;
  studioLine: string;
  spaceLine?: string | null;
  priceLine: string;
  weekendPriceLine?: string | null;
  tagLabels: string[];
  factItems: HallFactItem[];
  ctaLabel: string;
};

type Props = {
  items: HallCardItem[];
  weekendLabel: string;
};

export default function HallCardList({ items, weekendLabel }: Props) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="grid w-full max-w-5xl mx-auto gap-4 sm:gap-6">
      {items.map((item, index) => {
        const metaParts = [item.studioLine];
        if (item.spaceLine) {
          metaParts.push(item.spaceLine);
        }
        const metaLine = metaParts.join(" • ");
        const imageCount = item.imageCount > 0 ? item.imageCount : item.image ? 1 : 0;
        const dotCount = Math.min(5, imageCount);

        return (
          <motion.article
            key={item.id}
            className="hall-catalog-card"
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.22,
              delay: shouldReduceMotion ? 0 : index * 0.04,
              ease: "easeOut",
            }}
            whileHover={shouldReduceMotion ? undefined : { y: -2 }}
            whileTap={shouldReduceMotion ? undefined : { y: 1 }}
            style={shouldReduceMotion ? undefined : { willChange: "transform" }}
          >
            {item.image ? (
              <motion.img
                src={item.image}
                alt={item.name}
                className="hall-catalog-bg"
                whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.25, ease: "easeOut" }}
              />
            ) : (
              <div className="hall-catalog-bg hall-catalog-bg-fallback" aria-hidden="true" />
            )}

            <div className="hall-catalog-veil" aria-hidden="true" />
            <div className="hall-catalog-overlay">
              <div className="hall-catalog-top">
                {dotCount > 1 && (
                  <div className="hall-catalog-dots" aria-hidden="true">
                    {Array.from({ length: dotCount }).map((_, dotIndex) => (
                      <span
                        key={`${item.id}-dot-${dotIndex}`}
                        className={dotIndex === 0 ? "is-active" : undefined}
                      />
                    ))}
                  </div>
                )}
                <div className="hall-glass-pill hall-price-pill">
                  <div className="hall-price-main">{item.priceLine}</div>
                  {item.weekendPriceLine && (
                    <div className="hall-price-sub">
                      {weekendLabel} {item.weekendPriceLine}
                    </div>
                  )}
                </div>
              </div>

              <div className="hall-catalog-content">
                <h2 className="hall-catalog-title">
                  <Link href={item.hallHref}>{item.name}</Link>
                </h2>

                {item.factItems.length > 0 && (
                  <div className="hall-facts-icons">
                    {item.factItems.map((fact) => (
                      <span key={`${item.id}-${fact.key}`} className="hall-fact-chip">
                        <button
                          type="button"
                          className="hall-fact-icon"
                          aria-label={fact.label}
                          title={fact.label}
                        >
                          <img
                            src={FACT_ICON_BY_KEY[fact.key]}
                            alt=""
                            aria-hidden="true"
                            loading="lazy"
                          />
                        </button>
                        <span className="hall-fact-tooltip" role="tooltip">
                          {fact.label}
                        </span>
                      </span>
                    ))}
                  </div>
                )}

                <div className="hall-catalog-meta">{metaLine}</div>

                {item.tagLabels.length > 0 && (
                  <div className="hall-catalog-tags">
                    {item.tagLabels.map((tag) => (
                      <span key={tag} className="hall-glass-pill hall-tag-pill">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="hall-catalog-cta-wrap">
                  <Link href={item.hallHref} className="hall-glass-cta">
                    {item.ctaLabel}
                  </Link>
                </div>
              </div>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}
