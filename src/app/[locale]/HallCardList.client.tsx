"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { trackEvent } from "@/lib/analytics";

export type HallFactKey =
  | "daylight"
  | "blackout"
  | "parking"
  | "changing_room"
  | "furniture"
  | "flash_light"
  | "continuous_light"
  | "cyclorama";

export interface HallFactItem {
  key: HallFactKey;
  label: string;
}

const FACT_ICON_BY_KEY: Record<HallFactKey, string> = {
  daylight: "/icons/daylight.png",
  blackout: "/icons/blackout.png",
  parking: "/icons/parking.png",
  changing_room: "/icons/changing_room.png",
  furniture: "/icons/furniture.png",
  flash_light: "/icons/flash_light.png",
  continuous_light: "/icons/continuous_light.png",
  cyclorama: "/icons/cyclorama.png",
};

export interface HallCardItem {
  id: string;
  name: string;
  image: string | null;
  hallHref: string;
  studioLine: string;
  spaceLine?: string | null;
  priceLine: string;
  weekendPriceLine?: string | null;
  tagLabels: string[];
  factItems: HallFactItem[];
  ctaLabel: string;
}

interface Props {
  items: HallCardItem[];
  weekendLabel: string;
}

export default function HallCardList({ items, weekendLabel }: Props) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="grid w-full max-w-5xl mx-auto gap-6">
      {items.map((item, index) => {
        const metaParts = [item.studioLine];
        if (item.spaceLine) {
          metaParts.push(item.spaceLine);
        }
        const metaLine = metaParts.join(" • ");
        const handleHallClick = () => {
          trackEvent("hall_clicked", {
            hall_id: item.id,
            destination: item.hallHref,
            source: "catalog",
          });
        };

        return (
          <motion.article
            key={item.id}
            className="card p-4 sm:p-5"
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
            <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-start">
              <motion.div
                className="relative w-full overflow-hidden rounded bg-black/5 aspect-[4/3] sm:aspect-[16/10]"
                whileHover={shouldReduceMotion ? undefined : { scale: 1.025 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.2, ease: "easeOut" }}
              >
                {item.image ? (
                  <Image
                    fill
                    src={item.image}
                    alt={`${item.name} — photography studio hall, Chișinău`}
                    loading={index === 0 ? "eager" : "lazy"}
                    fetchPriority={index === 0 ? "high" : "auto"}
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 55vw"
                  />
                ) : (
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-neutral-200 via-neutral-300 to-neutral-400"
                    aria-hidden="true"
                  />
                )}
              </motion.div>

              <div className="flex h-full min-w-0 flex-col gap-3">
                <div className="space-y-1">
                  <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
                    <Link href={item.hallHref} className="underline" onClick={handleHallClick}>
                      {item.name}
                    </Link>
                  </h2>
                  {metaLine && <div className="text-sm muted">{metaLine}</div>}
                  <div className="text-sm font-semibold text-gray-900">{item.priceLine}</div>
                  {item.weekendPriceLine && (
                    <div className="text-xs muted">
                      {weekendLabel} {item.weekendPriceLine}
                    </div>
                  )}
                </div>

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

                {item.tagLabels.length > 0 && (
                  <div className="inline-flex flex-wrap gap-2">
                    {item.tagLabels.map((tag) => (
                      <span key={tag} className="pill text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-auto pt-1">
                  <Link
                    href={item.hallHref}
                    className="btn btn-primary w-full"
                    onClick={handleHallClick}
                  >
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
