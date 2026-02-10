"use client";

import Script from "next/script";

type KofiWindow = Window & {
  kofiwidget2?: {
    init: (text: string, color: string, id: string) => void;
    draw: () => void;
  };
};

export default function KofiMobileHeaderButton() {
  return (
    <div className="sm:hidden shrink-0">
      <div id="kofi-mobile-button" className="[&>a]:!m-0 [&>a]:!rounded-full [&>a]:!px-3 [&>a]:!py-1.5 [&>a]:!text-xs [&>a]:!font-semibold [&>a]:!leading-none [&>a]:!shadow-none [&>a]:!border [&>a]:!border-[var(--glass-border)] [&>a]:!bg-[#000000] [&>a]:!text-white" />
      <Script
        src="https://storage.ko-fi.com/cdn/widget/Widget_2.js"
        strategy="afterInteractive"
        onLoad={() => {
          const kofiWindow = window as KofiWindow;
          if (!kofiWindow.kofiwidget2) return;

          const mount = document.getElementById("kofi-mobile-button");
          if (!mount) return;

          mount.innerHTML = "";
          kofiWindow.kofiwidget2.init("Donate", "#000000", "L3L71TDJSN");
          kofiWindow.kofiwidget2.draw();
        }}
      />
    </div>
  );
}
