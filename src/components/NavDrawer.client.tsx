"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type Locale } from "@/i18n";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import {
  TELEGRAM_HREF,
  SUPPORT_EMAIL,
} from "@/components/SupportMenu.client";
import { UI_STRINGS } from "@/domain/ui-strings";

interface NavDrawerProps {
  locale: Locale;
}

interface NavItem {
  href: string;
  label: string;
}

function ActiveNavLink({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick: () => void;
}) {
  const pathname = usePathname();
  const segments = href.split("/").filter(Boolean);
  const isActive =
    pathname === href ||
    (segments.length > 1 && pathname.startsWith(href + "/"));

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={`pill ui-pill-control flex w-full items-center justify-between px-4 py-3 text-sm font-medium${
        isActive ? " ui-pill-control-active" : ""
      }`}
    >
      <span>{label}</span>
      <svg
        viewBox="0 0 7 12"
        fill="none"
        aria-hidden="true"
        className="h-2.5 w-2.5 shrink-0 opacity-35"
      >
        <path
          d="M1 1l5 5-5 5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}

export function NavDrawer({ locale }: NavDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const drawerRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const navItems: NavItem[] = [
    { href: `/${locale}`, label: UI_STRINGS.nav_catalog[locale] },
    { href: `/${locale}/about`, label: UI_STRINGS.nav_about[locale] },
    { href: `/${locale}/faq`, label: UI_STRINGS.nav_faq[locale] },
  ];

  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Escape key
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && isOpen) {
        close();
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  // Focus trap + initial focus
  useEffect(() => {
    if (!isOpen) return;
    const drawer = drawerRef.current;
    if (!drawer) return;

    const selector =
      'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

    function getFocusable() {
      return Array.from(drawer!.querySelectorAll<HTMLElement>(selector));
    }

    function onTab(event: KeyboardEvent) {
      if (event.key !== "Tab") return;
      const focusable = getFocusable();
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey) {
        if (document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    getFocusable()[0]?.focus();
    drawer.addEventListener("keydown", onTab);
    return () => drawer.removeEventListener("keydown", onTab);
  }, [isOpen]);

  return (
    <>
      {/* Trigger button — all screen sizes */}
      <button
        ref={triggerRef}
        type="button"
        className="pill ui-pill-control h-11 w-11 justify-center px-0"
        aria-label={
          isOpen
            ? UI_STRINGS.nav_menu_close[locale]
            : UI_STRINGS.nav_menu_open[locale]
        }
        aria-expanded={isOpen}
        aria-controls="nav-drawer"
        onClick={isOpen ? close : open}
      >
        <div className="nav-trigger-icon" data-open={String(isOpen)}>
          <span />
          <span />
          <span />
        </div>
      </button>

      {/* Backdrop */}
      <div
        className="nav-drawer-backdrop"
        data-open={String(isOpen)}
        aria-hidden="true"
        onPointerDown={close}
      />

      {/* Drawer */}
      <aside
        id="nav-drawer"
        ref={drawerRef}
        className="nav-drawer"
        data-open={String(isOpen)}
        role="dialog"
        aria-modal="true"
        aria-label={UI_STRINGS.nav_menu_label[locale]}
        inert={!isOpen || undefined}
      >
        {/* Drawer header: logo + close */}
        <div className="flex items-center justify-between border-b border-[var(--glass-border)] px-5 py-4">
          <Link
            href={`/${locale}`}
            onClick={close}
            className="text-base font-semibold tracking-tight text-[#1c1a17]"
          >
            studiosmap
          </Link>
          <button
            type="button"
            className="pill ui-pill-control h-9 w-9 justify-center px-0"
            aria-label={UI_STRINGS.nav_menu_close[locale]}
            onClick={close}
          >
            <div className="nav-trigger-icon" data-open="true">
              <span />
              <span />
              <span />
            </div>
          </button>
        </div>

        {/* Pages section */}
        <div className="px-4 pb-4 pt-5">
          <p className="nav-drawer-label">{UI_STRINGS.nav_section_pages[locale]}</p>
          <nav className="flex flex-col gap-1">
            {navItems.map(({ href, label }) => (
              <ActiveNavLink key={href} href={href} label={label} onClick={close} />
            ))}
          </nav>
        </div>

        {/* Language section */}
        <div className="border-t border-[var(--glass-border)] px-4 pb-4 pt-4">
          <p className="nav-drawer-label">{UI_STRINGS.nav_section_language[locale]}</p>
          <LocaleSwitcher locale={locale} />
        </div>

        {/* Contact section */}
        <div className="border-t border-[var(--glass-border)] px-4 pb-4 pt-4">
          <p className="nav-drawer-label">{UI_STRINGS.nav_section_contact[locale]}</p>
          <div className="flex flex-col gap-1">
            <a
              href={TELEGRAM_HREF}
              target="_blank"
              rel="noreferrer noopener"
              className="pill ui-pill-control group flex w-full items-center justify-between px-4 py-3 text-sm font-medium"
              onClick={close}
            >
              <span className="flex items-center gap-2.5">
                <img
                  src="/icons/telegram.png"
                  alt=""
                  aria-hidden="true"
                  className="h-4 w-4 object-contain brightness-0 transition group-hover:invert"
                  loading="lazy"
                />
                {UI_STRINGS.telegram_cta[locale]}
              </span>
              <svg
                viewBox="0 0 7 12"
                fill="none"
                aria-hidden="true"
                className="h-2.5 w-2.5 shrink-0 opacity-35"
              >
                <path
                  d="M1 1l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="pill ui-pill-control group flex w-full items-center justify-between px-4 py-3 text-sm font-medium"
              onClick={close}
            >
              <span className="flex items-center gap-2.5">
                <img
                  src="/icons/email.png"
                  alt=""
                  aria-hidden="true"
                  className="h-4 w-4 object-contain brightness-0 transition group-hover:invert"
                  loading="lazy"
                />
                {SUPPORT_EMAIL}
              </span>
              <svg
                viewBox="0 0 7 12"
                fill="none"
                aria-hidden="true"
                className="h-2.5 w-2.5 shrink-0 opacity-35"
              >
                <path
                  d="M1 1l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
