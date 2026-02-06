"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

export type HallCardItem = {
  id: string;
  name: string;
  image: string | null;
  hallHref: string;
  studioLine: string;
  priceLine: string;
  tagLabels: string[];
  factLines: string[];
  ctaLabel: string;
};

type Props = {
  items: HallCardItem[];
};

export default function HallCardList({ items }: Props) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      {items.map((item, index) => (
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
          <div className="flex h-full flex-col gap-4">
            <motion.div
              className="relative w-full overflow-hidden rounded bg-black/5 aspect-[4/3] sm:aspect-[16/10]"
              whileHover={shouldReduceMotion ? undefined : { scale: 1.025 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.2, ease: "easeOut" }}
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
              )}
            </motion.div>

            <div className="flex h-full min-w-0 flex-col gap-3">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold text-gray-900">
                  <Link href={item.hallHref} className="underline">
                    {item.name}
                  </Link>
                </h2>
                <div className="text-sm muted">{item.studioLine}</div>
                <div className="text-sm font-semibold text-gray-900">{item.priceLine}</div>
              </div>

              <div className="stack gap-3 lg:grid lg:grid-cols-2 lg:gap-4">
                <div className="stack gap-1.5">
                  {item.tagLabels.map((tag) => (
                    <span key={tag} className="pill text-xs">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="stack gap-1.5 text-xs leading-tight muted">
                  {item.factLines.map((fact) => (
                    <span key={fact}>{fact}</span>
                  ))}
                </div>
              </div>

              <div className="mt-auto pt-1">
                <Link href={item.hallHref} className="btn btn-primary">
                  {item.ctaLabel}
                </Link>
              </div>
            </div>
          </div>
        </motion.article>
      ))}
    </>
  );
}
