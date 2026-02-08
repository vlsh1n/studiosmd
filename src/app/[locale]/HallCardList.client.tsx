"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

export type HallCardItem = {
  id: string;
  name: string;
  image: string | null;
  hallHref: string;
  studioLine: string;
  spaceLine?: string | null;
  priceLine: string;
  weekendPriceLine?: string | null;
  tagLabels: string[];
  factLines: string[];
  ctaLabel: string;
};

type Props = {
  items: HallCardItem[];
  weekendLabel: string;
};

export default function HallCardList({ items, weekendLabel }: Props) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="grid w-full max-w-5xl mx-auto gap-6">
      {items.map((item, index) => {
        const visibleFacts = item.factLines;
        const metaParts = [item.studioLine];
        if (item.spaceLine) {
          metaParts.push(item.spaceLine);
        }
        const metaLine = metaParts.join(" • ");

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
              <div className="relative w-full overflow-hidden rounded bg-black/5 aspect-[4/3] sm:aspect-[16/10]">
                {item.image && (
                  <motion.img
                    src={item.image}
                    alt={item.name}
                    className="absolute inset-0 h-full w-full object-cover object-center"
                    whileHover={shouldReduceMotion ? undefined : { scale: 1.025 }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.2, ease: "easeOut" }}
                  />
                )}
              </div>

              <div className="flex h-full min-w-0 flex-col gap-3">
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold text-gray-900">
                    <Link href={item.hallHref} className="underline">
                      {item.name}
                    </Link>
                  </h2>
                  <div className="text-sm muted">{metaLine}</div>
                  <div className="text-sm font-semibold text-gray-900">{item.priceLine}</div>
                  {item.weekendPriceLine && (
                    <div className="text-xs muted">
                      {weekendLabel} {item.weekendPriceLine}
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
                  {item.tagLabels.map((tag) => (
                    <span key={tag} className="pill text-xs">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-auto pt-1">
                  <Link href={item.hallHref} className="btn btn-primary w-full sm:w-fit">
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
