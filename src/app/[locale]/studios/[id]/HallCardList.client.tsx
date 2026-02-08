"use client";

import { motion, useReducedMotion } from "framer-motion";
import HallGalleryZoom from "@/app/[locale]/studios/[id]/HallGalleryZoom";

export type StudioHallCardItem = {
  id: string;
  name: string;
  priceLine: string;
  weekendPriceLine?: string | null;
  spaceLine?: string | null;
  factLines: string[];
  tags: string[];
  images: string[];
};

type Props = {
  halls: StudioHallCardItem[];
  weekendLabel: string;
};

export default function HallCardList({ halls, weekendLabel }: Props) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="grid w-full max-w-5xl mx-auto gap-6">
      {halls.map((hall, index) => {
        const visibleFacts = hall.factLines;
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

                {visibleFacts.length > 0 && (
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs leading-tight muted">
                    {visibleFacts.map((fact, factIndex) => (
                      <div
                        key={`${fact}-${factIndex}`}
                        className="flex items-center justify-between gap-2"
                      >
                        <span>{fact}</span>
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
