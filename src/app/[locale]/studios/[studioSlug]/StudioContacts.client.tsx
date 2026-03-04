"use client";

import { trackEvent } from "@/lib/analytics";

type ContactType = "instagram" | "phone" | "yandex_maps" | "google_maps";

type Props = {
  studioId: string;
  locale: string;
  instagramHref: string | null;
  phoneHref: string | null;
  phoneText: string | null;
  yandexMapsHref: string | null;
  googleMapsHref: string | null;
  instagramLabel: string;
  yandexMapsLabel: string;
  googleMapsLabel: string;
};

export default function StudioContacts({
  studioId,
  locale,
  instagramHref,
  phoneHref,
  phoneText,
  yandexMapsHref,
  googleMapsHref,
  instagramLabel,
  yandexMapsLabel,
  googleMapsLabel,
}: Props) {
  const hasAnyContact = Boolean(instagramHref || phoneHref || yandexMapsHref || googleMapsHref);
  if (!hasAnyContact) return null;

  function handleContactClick(contactType: ContactType) {
    trackEvent("studio_contact_clicked", {
      studio_id: studioId,
      locale,
      contact_type: contactType,
      placement: "studio_header",
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      {instagramHref && (
        <a
          href={instagramHref}
          target="_blank"
          rel="noreferrer noopener"
          className="pill ui-pill-control text-sm font-medium"
          onClick={() => handleContactClick("instagram")}
        >
          <img
            src="/icons/instagram.png"
            alt=""
            aria-hidden="true"
            className="h-4 w-4 object-contain"
            loading="lazy"
          />
          <span>{instagramLabel}</span>
        </a>
      )}

      {phoneHref && phoneText && (
        <a
          href={`tel:${phoneHref}`}
          className="pill ui-pill-control text-sm font-medium"
          onClick={() => handleContactClick("phone")}
        >
          <img
            src="/icons/telephone.png"
            alt=""
            aria-hidden="true"
            className="h-4 w-4 object-contain"
            loading="lazy"
          />
          <span>{phoneText}</span>
        </a>
      )}

      {yandexMapsHref && (
        <a
          href={yandexMapsHref}
          target="_blank"
          rel="noreferrer noopener"
          className="pill ui-pill-control text-sm font-medium"
          onClick={() => handleContactClick("yandex_maps")}
        >
          <img
            src="/icons/yandex_maps.png"
            alt=""
            aria-hidden="true"
            className="h-4 w-4 object-contain"
            loading="lazy"
          />
          <span>{yandexMapsLabel}</span>
        </a>
      )}

      {googleMapsHref && (
        <a
          href={googleMapsHref}
          target="_blank"
          rel="noreferrer noopener"
          className="pill ui-pill-control text-sm font-medium"
          onClick={() => handleContactClick("google_maps")}
        >
          <img
            src="/icons/google_maps.png"
            alt=""
            aria-hidden="true"
            className="h-4 w-4 object-contain"
            loading="lazy"
          />
          <span>{googleMapsLabel}</span>
        </a>
      )}
    </div>
  );
}

