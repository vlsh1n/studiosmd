"use client";

import { useEffect } from "react";

const highlightClasses = [
  "ring-2",
  "ring-amber-400",
  "ring-offset-2",
  "ring-offset-white",
  "transition",
];

type Props = {
  hallId?: string | null;
};

export default function HallFocus({ hallId = null }: Props) {

  useEffect(() => {
    if (!hallId) return;

    const target = document.getElementById(`hall-${hallId}`);
    if (!target) return;

    let timeoutId: number | undefined;
    const rafId = requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      target.classList.add(...highlightClasses);
      timeoutId = window.setTimeout(() => {
        target.classList.remove(...highlightClasses);
      }, 2500);
    });

    return () => {
      cancelAnimationFrame(rafId);
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
      target.classList.remove(...highlightClasses);
    };
  }, [hallId]);

  return null;
}
