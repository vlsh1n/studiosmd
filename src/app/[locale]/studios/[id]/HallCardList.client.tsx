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
};

type Props = {
  halls: StudioHallCardItem[];
};

function splitFactLine(factLine: string) {
  const match = factLine.match(/^(.*)\s([✅❌])$/u);
  if (!match) {
    return { label: factLine, status: null as string | null };
  }
  return { label: match[1], status: match[2] };
}

export default function HallCardList({ halls }: Props) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {halls.map((hall, index) => (
        <motion.article
          key={hall.id}
          id={`hall-${hall.id}`}
          className="card stack p-5"
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
          <div className="stack gap-1">
            <h2 className="text-base font-semibold text-gray-900 sm:text-lg">{hall.name}</h2>
            <div className="text-sm font-medium text-gray-900 whitespace-nowrap">{hall.priceLine}</div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs leading-tight muted sm:grid-cols-2">
              {hall.factLines.map((fact, factIndex) => {
                const { label, status } = splitFactLine(fact);
                return (
                  <div
                    key={`${fact}-${factIndex}`}
                    className="flex items-center justify-between gap-2"
                  >
                    <span>{label}</span>
                    <span className="shrink-0">{status ?? ""}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-1 flex flex-wrap gap-2 pt-1">
              {hall.tags.map((tag) => (
                <span key={tag} className="pill text-xs">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {hall.images.length > 0 && <HallGalleryZoom images={hall.images} alt={hall.name} />}
        </motion.article>
      ))}
    </div>
  );
}
