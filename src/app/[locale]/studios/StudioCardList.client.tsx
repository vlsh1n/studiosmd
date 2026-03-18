"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

export interface StudioCardItem {
  id: string;
  name: string;
  logoUrl: string | null;
  coverImage: string | null;
  districtLabel: string;
  hallCountLabel: string;
  priceLabel: string;
  studioHref: string;
  ctaLabel: string;
}

interface Props {
  items: StudioCardItem[];
}

export default function StudioCardList({ items }: Props) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="grid w-full max-w-5xl mx-auto gap-6">
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
          <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-start">
            {/* Cover image */}
            <motion.div
              className="relative w-full overflow-hidden rounded bg-black/5 aspect-[4/3] sm:aspect-[16/10]"
              whileHover={shouldReduceMotion ? undefined : { scale: 1.025 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.2, ease: "easeOut" }}
            >
              {item.coverImage ? (
                <Image
                  fill
                  src={item.coverImage}
                  alt={`${item.name} — фотостудия Кишинёв`}
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

            {/* Info */}
            <div className="flex h-full min-w-0 flex-col gap-3">
              {/* Logo + name */}
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-[var(--glass-border)] bg-[var(--surface)]">
                  {item.logoUrl ? (
                    <img
                      src={item.logoUrl}
                      alt=""
                      aria-hidden="true"
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)]">
                      {item.name.slice(0, 2)}
                    </div>
                  )}
                </div>
                <div className="min-w-0 pt-0.5">
                  <h2 className="text-base font-semibold leading-snug text-gray-900 sm:text-lg">
                    <Link href={item.studioHref} className="underline">
                      {item.name}
                    </Link>
                  </h2>
                  <div className="mt-0.5 text-sm muted">
                    {item.districtLabel}
                    {item.hallCountLabel ? ` · ${item.hallCountLabel}` : ""}
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="text-sm font-semibold text-gray-900">{item.priceLabel}</div>

              {/* CTA */}
              <div className="mt-auto pt-1">
                <Link href={item.studioHref} className="btn btn-primary w-full">
                  {item.ctaLabel}
                </Link>
              </div>
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
