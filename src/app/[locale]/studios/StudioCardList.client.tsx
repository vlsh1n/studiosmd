"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

export type FeatureKey =
  | "daylight"
  | "blackout"
  | "parking"
  | "changing_room"
  | "furniture"
  | "flash_light"
  | "continuous_light"
  | "cyclorama";

export interface StudioContactLink {
  href: string;
  label: string;
  icon: string;
}

export interface StudioCardItem {
  id: string;
  name: string;
  logoUrl: string | null;
  address: string;
  districtLabel: string;
  hallCountLabel: string;
  workingHours: string | null;
  features: FeatureKey[];
  contacts: StudioContactLink[];
  studioHref: string;
  ctaLabel: string;
}

const FEATURE_ICONS: Record<FeatureKey, { src: string; alt: string }> = {
  daylight: { src: "/icons/daylight.png", alt: "Daylight" },
  blackout: { src: "/icons/blackout.png", alt: "Blackout" },
  parking: { src: "/icons/parking.png", alt: "Parking" },
  changing_room: { src: "/icons/changing_room.png", alt: "Changing room" },
  furniture: { src: "/icons/furniture.png", alt: "Furniture" },
  flash_light: { src: "/icons/flash_light.png", alt: "Flash light" },
  continuous_light: { src: "/icons/continuous_light.png", alt: "Continuous light" },
  cyclorama: { src: "/icons/cyclorama.png", alt: "Cyclorama" },
};

interface Props {
  items: StudioCardItem[];
}

export default function StudioCardList({ items }: Props) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="grid w-full max-w-5xl mx-auto gap-4">
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
          style={shouldReduceMotion ? undefined : { willChange: "transform" }}
        >
          <div className="flex flex-col gap-3 sm:grid sm:grid-cols-[1fr_auto] sm:gap-4 sm:items-start">
            {/* Left: all info */}
            <div className="flex min-w-0 flex-col gap-2.5">
              {/* Logo + name + meta */}
              <div className="flex items-start gap-3">
                <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-[var(--glass-border)] bg-[var(--surface)]">
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
                    <Link href={item.studioHref} className="hover:underline">
                      {item.name}
                    </Link>
                  </h2>
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-[var(--muted)]">
                    <span>{item.districtLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.hallCountLabel}</span>
                  </div>
                </div>
              </div>

              {/* Address + working hours */}
              <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-[var(--muted)]">
                <span>{item.address}</span>
                {item.workingHours && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{item.workingHours}</span>
                  </>
                )}
              </div>

              {/* Feature icons */}
              {item.features.length > 0 && (
                <div className="hall-facts-icons">
                  {item.features.map((key) => {
                    const { src, alt } = FEATURE_ICONS[key];
                    return (
                      <span key={key} className="hall-fact-chip">
                        <span className="hall-fact-icon">
                          <img src={src} alt={alt} loading="lazy" />
                        </span>
                        <span className="hall-fact-tooltip">{alt}</span>
                      </span>
                    );
                  })}
                </div>
              )}

              {/* Contact links */}
              {item.contacts.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {item.contacts.map((contact) => (
                    <a
                      key={contact.href}
                      href={contact.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="pill ui-pill-control group flex items-center gap-1.5 px-2.5 py-1.5 text-xs"
                    >
                      <img
                        src={contact.icon}
                        alt=""
                        aria-hidden="true"
                        className="h-3.5 w-3.5 object-contain brightness-0 transition group-hover:invert"
                        loading="lazy"
                      />
                      <span>{contact.label}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Right: CTA */}
            <div className="shrink-0 sm:pt-0.5">
              <Link href={item.studioHref} className="btn btn-primary whitespace-nowrap">
                {item.ctaLabel}
              </Link>
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
