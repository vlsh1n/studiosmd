"use client";

import { useEffect } from "react";
import type { Locale } from "@/i18n";
import { trackEvent } from "@/lib/analytics";

type Props = {
  locale: Locale;
  formId: string;
};

function getStringValues(formData: FormData, field: string) {
  return formData
    .getAll(field)
    .map((value) => (typeof value === "string" ? value.trim() : ""))
    .filter(Boolean);
}

export default function CatalogTracking({ locale, formId }: Props) {
  useEffect(() => {
    const formElement = document.getElementById(formId);
    if (!(formElement instanceof HTMLFormElement)) {
      return;
    }

    function onSubmit() {
      const formData = new FormData(formElement);
      const query = String(formData.get("q") ?? "").trim();
      const districtKeys = getStringValues(formData, "districts");
      const tagKeys = getStringValues(formData, "tags");
      const factKeys = getStringValues(formData, "facts");
      const sort = String(formData.get("sort") ?? "random");

      if (query.length > 0) {
        trackEvent("search_used", {
          locale,
          query_length: query.length,
        });
      }

      const hasFilters =
        districtKeys.length > 0 ||
        tagKeys.length > 0 ||
        factKeys.length > 0 ||
        sort !== "random";

      if (hasFilters) {
        trackEvent("filter_used", {
          locale,
          district_count: districtKeys.length,
          tag_count: tagKeys.length,
          fact_count: factKeys.length,
          sort,
        });
      }
    }

    formElement.addEventListener("submit", onSubmit);
    return () => {
      formElement.removeEventListener("submit", onSubmit);
    };
  }, [formId, locale]);

  return null;
}

