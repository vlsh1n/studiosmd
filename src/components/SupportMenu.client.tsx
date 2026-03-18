"use client";

import { useEffect, useId, useRef, useState } from "react";
import { UI_STRINGS } from "@/domain/ui-strings";
import { type Locale } from "@/i18n";

export const TELEGRAM_HREF = "https://t.me/studiosmap";
export const SUPPORT_EMAIL = "admin@studiosmap.app";

type Props = {
  locale: Locale;
  align?: "left" | "right" | "center";
  iconOnly?: boolean;
};

export function SupportMenu({ locale, align = "right", iconOnly = false }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const supportLabel = UI_STRINGS.support_cta[locale];
  const telegramLabel = UI_STRINGS.telegram_cta[locale];
  const alignClass =
    align === "left"
      ? "left-0"
      : align === "center"
        ? "left-1/2 -translate-x-1/2"
        : "right-0";

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (
        rootRef.current &&
        event.target instanceof Node &&
        !rootRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className={`pill ui-pill-control group h-11 shrink-0 text-sm font-medium ${iconOnly ? "w-11 justify-center px-0" : "px-3 sm:px-4"}`}
        aria-label={supportLabel}
        title={supportLabel}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <img
          src="/icons/contacts.png"
          alt=""
          aria-hidden="true"
          className="h-5 w-5 object-contain brightness-0 transition group-hover:invert"
          loading="lazy"
        />
        {iconOnly ? null : <span>{supportLabel}</span>}
        {iconOnly ? null : (
          <svg
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
            className={`h-4 w-4 transition ${isOpen ? "rotate-180" : ""}`}
          >
            <path
              d="M5 8l5 5 5-5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {isOpen ? (
        <div
          id={menuId}
          role="menu"
          aria-label={supportLabel}
          className={`absolute ${alignClass} top-[calc(100%+0.5rem)] z-40 w-[min(18rem,calc(100vw-2rem))] rounded-2xl border border-[var(--glass-border)] bg-[var(--surface)] p-2 shadow-[var(--shadow-lift)]`}
        >
          <a
            href={TELEGRAM_HREF}
            target="_blank"
            rel="noreferrer noopener"
            role="menuitem"
            className="pill ui-pill-control group w-full justify-start px-3 py-2 text-sm font-medium"
            onClick={() => setIsOpen(false)}
          >
            <img
              src="/icons/telegram.png"
              alt=""
              aria-hidden="true"
              className="h-5 w-5 object-contain brightness-0 transition group-hover:invert"
              loading="lazy"
            />
            <span>{telegramLabel}</span>
          </a>

          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            role="menuitem"
            className="pill ui-pill-control group mt-2 w-full justify-start px-3 py-2 text-sm font-medium"
            onClick={() => setIsOpen(false)}
          >
            <img
              src="/icons/email.png"
              alt=""
              aria-hidden="true"
              className="h-5 w-5 object-contain brightness-0 transition group-hover:invert"
              loading="lazy"
            />
            <span>{SUPPORT_EMAIL}</span>
          </a>
        </div>
      ) : null}
    </div>
  );
}
