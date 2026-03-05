"use client";

import { useEffect } from "react";
import type { Locale } from "@/i18n";

type Props = {
  locale: Locale;
};

export default function HtmlLangSync({ locale }: Props) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
