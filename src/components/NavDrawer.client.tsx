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
  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href + "/"));

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={`pill ui-pill-control w-full justify-start px-4 py-3 text-sm font-medium${isActive ? " ui-pill-control-active" : ""}`}
    >
      {label}
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
      {/* Hamburger trigger — mobile only */}
      <button
        ref={triggerRef}
        type="button"
        className="sm:hidden pill ui-pill-control h-11 w-11 justify-center px-0"
        aria-label={
          isOpen
            ? UI_STRINGS.nav_menu_close[locale]
            : UI_STRINGS.nav_menu_open[locale]
        }
        aria-expanded={isOpen}
        aria-controls="nav-drawer"
        onClick={open}
      >
        <svg
          viewBox="0 0 18 14"
          fill="none"
          aria-hidden="true"
          className="h-4 w-4"
        >
          <path
            d="M0 1h18M0 7h18M0 13h18"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* Backdrop */}
      <div
        className="nav-drawer-backdrop sm:hidden"
        data-open={String(isOpen)}
        aria-hidden="true"
        onPointerDown={close}
      />

      {/* Drawer */}
      <aside
        id="nav-drawer"
        ref={drawerRef}
        className="nav-drawer sm:hidden"
        data-open={String(isOpen)}
        role="dialog"
        aria-modal="true"
        aria-label={UI_STRINGS.nav_menu_label[locale]}
        inert={!isOpen || undefined}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between border-b border-[var(--glass-border)] p-5">
          <span className="text-sm font-semibold text-gray-900">
            {UI_STRINGS.nav_menu_label[locale]}
          </span>
          <button
            type="button"
            className="pill ui-pill-control h-9 w-9 justify-center px-0"
            aria-label={UI_STRINGS.nav_menu_close[locale]}
            onClick={close}
          >
            <svg
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
              className="h-4 w-4"
            >
              <path
                d="M1 1l12 12M13 1L1 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-1 p-4">
          {navItems.map(({ href, label }) => (
            <ActiveNavLink key={href} href={href} label={label} onClick={close} />
          ))}
        </nav>

        <div className="mx-5 border-t border-[var(--glass-border)]" />

        {/* Locale switcher */}
        <div className="p-5">
          <LocaleSwitcher locale={locale} />
        </div>

        <div className="mx-5 border-t border-[var(--glass-border)]" />

        {/* Support links */}
        <div className="flex flex-col gap-1 p-4">
          <a
            href={TELEGRAM_HREF}
            target="_blank"
            rel="noreferrer noopener"
            className="pill ui-pill-control group w-full justify-start px-4 py-3 text-sm font-medium"
            onClick={close}
          >
            <img
              src="/icons/telegram.png"
              alt=""
              aria-hidden="true"
              className="h-5 w-5 object-contain brightness-0 transition group-hover:invert"
              loading="lazy"
            />
            <span>{UI_STRINGS.telegram_cta[locale]}</span>
          </a>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="pill ui-pill-control group w-full justify-start px-4 py-3 text-sm font-medium"
            onClick={close}
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
      </aside>
    </>
  );
}
