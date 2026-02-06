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
            <h2 className="text-lg font-semibold text-gray-900">{hall.name}</h2>
            <div className="text-sm font-semibold text-gray-900">{hall.priceLine}</div>
            <div className="flex flex-wrap gap-2 text-xs muted">
              {hall.factLines.map((fact) => (
                <span key={fact}>{fact}</span>
              ))}
            </div>
          </div>

          {hall.images.length > 0 && <HallGalleryZoom images={hall.images} alt={hall.name} />}

          <div className="flex flex-wrap gap-2">
            {hall.tags.map((tag) => (
              <span key={tag} className="pill text-xs">
                {tag}
              </span>
            ))}
          </div>
        </motion.article>
      ))}
    </div>
  );
}
