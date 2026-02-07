"use client";

import { motion, useReducedMotion } from "framer-motion";
import HallGalleryZoom from "@/app/[locale]/studios/[id]/HallGalleryZoom";

export type StudioHallCardItem = {
  id: string;
  name: string;
  priceLine: string;
  factLines: string[];
  tags: string[];
  images: string[];
  ctaHref: string;
  ctaLabel: string;
};

type Props = {
  halls: StudioHallCardItem[];
};

function splitFactLine(factLine: string) {
  const trueIcon = "\u2705";
  const falseIcon = "\u274C";
  const match = factLine.match(
    new RegExp(`^(.*)\\s(${trueIcon}|${falseIcon}|yes|no|true|false|limited)$`, "iu")
  );
  if (!match) {
    return { label: normalizeVideoLabel(factLine.trim()), status: null as string | null };
  }
  return { label: normalizeVideoLabel(match[1].trim()), status: match[2] };
}

function isAvailableFact(status: string | null) {
  if (status === null) return true;
  const falseIcon = "\u274C";
  const normalized = status.toLowerCase();
  return normalized !== falseIcon && normalized !== "false" && normalized !== "no";
}

function normalizeVideoLabel(label: string) {
  const nextByLabel: Record<string, string> = {
    "Можно ли снимать видео?": "подходит для съемки видео",
    "Se poate filma video?": "potrivit pentru filmare video",
    "Can you shoot video?": "video-friendly",
  };
  return nextByLabel[label] ?? label;
}

export default function HallCardList({ halls }: Props) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="grid w-full max-w-5xl mx-auto gap-6">
      {halls.map((hall, index) => {
        const visibleFacts = hall.factLines
          .map((factLine) => splitFactLine(factLine))
          .filter((fact) => isAvailableFact(fact.status));

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
                <div className="text-sm font-medium text-gray-900 whitespace-nowrap">
                  {hall.priceLine}
                </div>
              </div>

              {visibleFacts.length > 0 && (
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs leading-tight muted">
                  {visibleFacts.map((fact, factIndex) => (
                    <div
                      key={`${fact.label}-${factIndex}`}
                      className="flex items-center justify-between gap-2"
                    >
                      <span>{fact.label}</span>
                    </div>
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

            </div>
          </div>
        </motion.article>
        );
      })}
    </div>
  );
}
