import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n";
import { DEFAULT_LOCALE, LOCALES, SITE_NAME, absUrl, localePath } from "@/seo/site";

interface Props {
  params: Promise<{ locale: string }>;
}

const FAQ_PATH = "/faq";

const FAQ_SEO: Record<Locale, { title: string; description: string }> = {
  ru: {
    title: `Вопросы и ответы | ${SITE_NAME}`,
    description:
      "Ответы на частые вопросы о studiosmap — как работает каталог, актуальны ли цены и как добавить студию.",
  },
  ro: {
    title: `Întrebări frecvente | ${SITE_NAME}`,
    description:
      "Răspunsuri la cele mai frecvente întrebări despre studiosmap — cum funcționează catalogul, prețurile și cum să adaugi un studio.",
  },
  en: {
    title: `FAQ | ${SITE_NAME}`,
    description:
      "Answers to common questions about studiosmap — how the directory works, whether prices are current, and how to add a studio.",
  },
};

interface FaqItem {
  q: string;
  a: string;
}

interface FaqContent {
  heading: string;
  subtitle: string;
  items: FaqItem[];
}

const FAQ_CONTENT: Record<Locale, FaqContent> = {
  ru: {
    heading: "Вопросы и ответы",
    subtitle: "Всё, что нужно знать перед выбором студии.",
    items: [
      {
        q: "Цены в каталоге актуальны?",
        a: "Данные собраны из открытых источников и периодически обновляются. Рекомендуем уточнять актуальные цены напрямую у студий — они могут меняться.",
      },
      {
        q: "Можно забронировать студию прямо здесь?",
        a: "Нет, studiosmap — информационный каталог. Бронирование происходит напрямую со студией: через Telegram, телефон или email, указанные на странице студии.",
      },
      {
        q: "Что такое «дневной свет» и «blackout»?",
        a: "Дневной свет — в зале большие окна или световые люки с естественным освещением. Blackout — зал полностью затемняется, что удобно для съёмки с искусственным светом.",
      },
      {
        q: "Размещение в каталоге платное?",
        a: "Нет. Студии не платят за размещение. Каталог бесплатный и без рекламы — это просто каталог для тех, кто ищет.",
      },
      {
        q: "Как предложить студию или сообщить об ошибке?",
        a: "Напишите на admin@studiosmap.app или в Telegram @studiosmap. Проверим и обновим как можно скорее.",
      },
      {
        q: "Что включает цена за час?",
        a: "Обычно это аренда зала. Дополнительное оборудование, ассистент или другие услуги могут оплачиваться отдельно — уточняйте у студии.",
      },
    ],
  },
  ro: {
    heading: "Întrebări frecvente",
    subtitle: "Tot ce trebuie să știi înainte de a alege un studio.",
    items: [
      {
        q: "Prețurile din catalog sunt actualizate?",
        a: "Datele sunt colectate din surse publice și actualizate periodic. Recomandăm să contactați studiourile direct pentru confirmarea prețurilor actuale.",
      },
      {
        q: "Pot rezerva un studio direct pe site?",
        a: "Nu, studiosmap este un catalog informativ. Rezervările se fac direct cu studiourile — prin Telegram, telefon sau email indicat pe pagina fiecărui studio.",
      },
      {
        q: 'Ce înseamnă "lumină naturală" și "blackout"?',
        a: "Lumina naturală înseamnă că sala are ferestre mari sau luminatoare cu lumină solară. Blackout — sala poate fi complet întunecată, utilă pentru fotografia cu lumini artificiale.",
      },
      {
        q: "Listarea în catalog este plătită?",
        a: "Nu. Studiourile nu plătesc pentru listare. Catalogul este gratuit și fără reclame — pur și simplu un catalog pentru cei care caută.",
      },
      {
        q: "Cum pot sugera un studio sau raporta o eroare?",
        a: "Scrieți-ne la admin@studiosmap.app sau pe Telegram @studiosmap. Vom verifica și actualiza datele cât mai repede.",
      },
      {
        q: "Ce include prețul pe oră?",
        a: "De obicei, prețul acoperă închirierea sălii. Echipamentul suplimentar, asistentul sau alte servicii pot fi plătite separat — verificați direct cu studioul.",
      },
    ],
  },
  en: {
    heading: "FAQ",
    subtitle: "Everything you need to know before choosing a studio.",
    items: [
      {
        q: "Are the prices in the directory current?",
        a: "Data is collected from public sources and updated periodically. We recommend confirming current prices directly with studios, as they may change.",
      },
      {
        q: "Can I book a studio directly on this site?",
        a: "No, studiosmap is an informational directory. Bookings are made directly with studios — via Telegram, phone, or email listed on each studio's page.",
      },
      {
        q: 'What is "daylight" and "blackout"?',
        a: "Daylight means the studio has large windows or skylights with natural light. Blackout means the room can be fully darkened — useful for shooting with artificial lighting.",
      },
      {
        q: "Is listing in the directory free?",
        a: "Yes. Studios don't pay to be listed. The directory is free and ad-free — simply a catalog for people looking.",
      },
      {
        q: "How do I suggest a studio or report an error?",
        a: "Write to us at admin@studiosmap.app or on Telegram @studiosmap. We'll verify and update as soon as possible.",
      },
      {
        q: "What's included in the hourly rate?",
        a: "Typically just the room rental. Additional equipment, an assistant, or other services may be charged separately — check with the studio.",
      },
    ],
  },
};

function buildFaqJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: {
        "@type": "Answer",
        text: a,
      },
    })),
  };
}

function stringifyJsonLd(data: Record<string, unknown>) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = isLocale(locale) ? locale : DEFAULT_LOCALE;
  const seo = FAQ_SEO[currentLocale];
  const canonicalUrl = absUrl(localePath(currentLocale, FAQ_PATH));
  const languageAlternates = Object.fromEntries(
    LOCALES.map((l) => [l, absUrl(localePath(l, FAQ_PATH))])
  );

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ...languageAlternates,
        "x-default": absUrl(localePath(DEFAULT_LOCALE, FAQ_PATH)),
      },
    },
  };
}

export default async function FaqPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const { heading, subtitle, items } = FAQ_CONTENT[locale];
  const jsonLd = buildFaqJsonLd(items);

  return (
    <div className="stack">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: stringifyJsonLd(jsonLd) }}
      />

      {/* Header */}
      <section className="card p-4 sm:p-5">
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">{heading}</h1>
        <p className="mt-1.5 text-sm text-[var(--muted)]">{subtitle}</p>
      </section>

      {/* Accordion */}
      <section className="card overflow-hidden">
        {items.map(({ q, a }, index) => (
          <details key={index} className="faq-item">
            <summary className="faq-q">
              <span>{q}</span>
              <svg
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden="true"
                className="faq-q-icon"
              >
                <path
                  d="M6 1v10M1 6h10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </summary>
            <div className="faq-a-wrap">
              <div className="faq-a">{a}</div>
            </div>
          </details>
        ))}
      </section>

      {/* Contact nudge */}
      <section className="card p-4 sm:p-5">
        <p className="text-sm text-[var(--muted)]">
          {locale === "ru" && "Не нашли ответ? "}
          {locale === "ro" && "Nu ați găsit răspunsul? "}
          {locale === "en" && "Didn't find an answer? "}
          <a
            href="mailto:admin@studiosmap.app"
            className="font-medium text-gray-900 underline underline-offset-2 hover:no-underline"
          >
            admin@studiosmap.app
          </a>
        </p>
      </section>
    </div>
  );
}
