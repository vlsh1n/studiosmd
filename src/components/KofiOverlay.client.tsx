"use client";

import { useEffect } from "react";
import Script from "next/script";

type KofiWindow = Window & {
  kofiWidgetOverlay?: {
    draw: (username: string, options: Record<string, string>) => void;
  };
  __kofiOverlayMounted?: boolean;
};

export default function KofiOverlay() {
  useEffect(() => {
    const kofiWindow = window as KofiWindow;

    if (kofiWindow.__kofiOverlayMounted) return;
    if (!kofiWindow.kofiWidgetOverlay) return;

    kofiWindow.kofiWidgetOverlay.draw("voloshinw", {
      type: "floating-chat",
      "floating-chat.donateButton.text": "Donate",
      "floating-chat.donateButton.background-color": "#323842",
      "floating-chat.donateButton.text-color": "#fff",
    });

    kofiWindow.__kofiOverlayMounted = true;
  }, []);

  return (
    <Script
      src="https://storage.ko-fi.com/cdn/scripts/overlay-widget.js"
      strategy="afterInteractive"
      onLoad={() => {
        const kofiWindow = window as KofiWindow;

        if (kofiWindow.__kofiOverlayMounted) return;
        if (!kofiWindow.kofiWidgetOverlay) return;

        kofiWindow.kofiWidgetOverlay.draw("voloshinw", {
          type: "floating-chat",
          "floating-chat.donateButton.text": "Donate",
          "floating-chat.donateButton.background-color": "#323842",
          "floating-chat.donateButton.text-color": "#fff",
        });

        kofiWindow.__kofiOverlayMounted = true;
      }}
    />
  );
}
