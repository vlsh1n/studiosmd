"use client";

import { motion, useReducedMotion } from "framer-motion";
import HallGalleryZoom from "@/app/[locale]/studios/[id]/HallGalleryZoom";

export type StudioHallFactKey =
  | "daylight"
  | "blackout"
  | "parking"
  | "changing_room"
  | "furniture"
  | "flash_light"
  | "continuous_light";

export type StudioHallFactItem = {
  key: StudioHallFactKey;
  label: string;
};

const FACT_ICON_BY_KEY: Record<StudioHallFactKey, string> = {
  daylight: "/icons/daylight.png",
  blackout: "/icons/blackout.png",
  parking: "/icons/parking.png",
  changing_room: "/icons/changing_room.png",
  furniture: "/icons/furniture.png",
  flash_light: "/icons/flash_light.png",
  continuous_light: "/icons/continuous_light.png",
};

export type StudioHallCardItem = {
  id: string;
  name: string;
  priceLine: string;
  weekendPriceLine?: string | null;
  spaceLine?: string | null;
  factItems: StudioHallFactItem[];
  tags: string[];
  images: string[];
};

type Props = {
  halls: StudioHallCardItem[];
  weekendLabel: string;
  instagramHref: string | null;
  phoneHref: string | null;
  instagramLabel: string;
  phoneLabel: string;
};

export default function HallCardList({
  halls,
  weekendLabel,
  instagramHref,
  phoneHref,
  instagramLabel,
  phoneLabel,
}: Props) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="grid w-full max-w-5xl mx-auto gap-6">
      {halls.map((hall, index) => {
        const metaParts: string[] = [];
        if (hall.spaceLine) {
          metaParts.push(hall.spaceLine);
        }
        const metaLine = metaParts.join(" • ");

        return (
          <motion.article
            key={hall.id}
            id={`hall-${hall.id}`}
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
              {hall.images.length > 0 && (
                <div className="min-w-0">
                  <HallGalleryZoom images={hall.images} alt={hall.name} />
                </div>
              )}

              <div className="stack gap-3 min-w-0 lg:sticky lg:top-4">
                <div className="space-y-1">
                  <h2 className="text-base font-semibold text-gray-900 sm:text-lg">{hall.name}</h2>
                  {metaLine && <div className="text-sm muted">{metaLine}</div>}
                  <div className="text-sm font-semibold text-gray-900">{hall.priceLine}</div>
                  {hall.weekendPriceLine && (
                    <div className="text-xs muted">
                      {weekendLabel} {hall.weekendPriceLine}
                    </div>
                  )}
                </div>

                {hall.factItems.length > 0 && (
                  <div className="hall-facts-icons">
                    {hall.factItems.map((fact) => (
                      <span key={`${hall.id}-${fact.key}`} className="hall-fact-chip">
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

                <div className="inline-flex flex-wrap gap-2">
                  {hall.tags.map((tag) => (
                    <span key={tag} className="pill text-xs">
                      {tag}
                    </span>
                  ))}
                </div>

                {(instagramHref || phoneHref) && (
                  <div className="mt-auto pt-1 flex flex-wrap gap-2">
                    {instagramHref && (
                      <a
                        href={instagramHref}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="btn flex-1 min-w-[8.5rem]"
                      >
                        {instagramLabel}
                      </a>
                    )}
                    {phoneHref && (
                      <a
                        href={phoneHref}
                        className="btn btn-primary flex-1 min-w-[8.5rem]"
                      >
                        {phoneLabel}
                      </a>
                    )}
                  </div>
                )}

              </div>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}
