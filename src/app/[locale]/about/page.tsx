import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n";
import { DEFAULT_LOCALE, LOCALES, SITE_NAME, absUrl, localePath } from "@/seo/site";

type Props = {
  params: Promise<{ locale: string }>;
};

const ABOUT_PATH = "/about";

const ABOUT_SEO: Record<Locale, { title: string; description: string }> = {
  ru: {
    title: `О проекте | ${SITE_NAME}`,
    description:
      "studiosmap — бесплатный каталог фотостудий в Кишинёве. Сделан фотографом Владиславом Волошиным.",
  },
  ro: {
    title: `Despre proiect | ${SITE_NAME}`,
    description:
      "studiosmap — catalog gratuit de studiouri foto din Chișinău. Creat de fotograful Vladislav Voloshin.",
  },
  en: {
    title: `About | ${SITE_NAME}`,
    description:
      "studiosmap — a free photo studio directory for Chișinău. Built by photographer Vladislav Voloshin.",
  },
};

const ABOUT_CONTENT: Record<
  Locale,
  { heading: string; intro: string; body: string; data: string; contactLabel: string; supportLabel: string }
> = {
  ru: {
    heading: "О проекте",
    intro: "Владислав Волошин — фотограф в Кишинёве.",
    body: "studiosmap начался с простого раздражения: почему выбор студии в Кишинёве до сих пор выглядит как охота в инстаграме? Я фотограф, и я знаю, как это — тратить час на переписку, чтобы узнать цену и есть ли дневной свет. Поэтому сделал место, где всё это видно сразу: залы, фото, фильтры, районы, цены. Проект бесплатный и без рекламы. Студии не платят за размещение — это просто каталог для тех, кто ищет.",
    data: "Данные собраны из открытых источников. Если что-то изменилось или хотите добавить студию — напишите.",
    contactLabel: "Написать",
    supportLabel: "Поддержать проект",
  },
  ro: {
    heading: "Despre proiect",
    intro: "Vladislav Voloshin — fotograf în Chișinău.",
    body: "studiosmap a pornit dintr-o frustrare simplă: de ce alegerea unui studio foto în Chișinău arată în continuare ca o vânătoare pe Instagram? Sunt fotograf și știu cum e — să pierzi o oră în mesaje doar ca să afli prețul și dacă există lumină naturală. Așa că am creat un loc unde totul e vizibil dintr-o privire: săli, fotografii, filtre, sectoare, prețuri. Proiectul este gratuit și fără reclame. Studiourile nu plătesc pentru listare — e pur și simplu un catalog pentru cei care caută.",
    data: "Datele sunt colectate din surse publice. Dacă ceva s-a schimbat sau doriți să adăugați un studio — scrieți-mi.",
    contactLabel: "Contactează",
    supportLabel: "Susține proiectul",
  },
  en: {
    heading: "About",
    intro: "Vladislav Voloshin — photographer in Chișinău.",
    body: "studiosmap started from simple frustration: why does choosing a photo studio in Chișinău still feel like hunting through Instagram? I'm a photographer, and I know what it's like — spending an hour in DMs just to find out the price and whether there's natural light. So I built a place where all of that is visible at a glance: halls, photos, filters, districts, prices. The project is free and ad-free. Studios don't pay for listings — it's simply a directory for people looking.",
    data: "Data is collected from public sources. If something has changed or you'd like to add a studio — reach out.",
    contactLabel: "Get in touch",
    supportLabel: "Support the project",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = isLocale(locale) ? locale : DEFAULT_LOCALE;
  const seo = ABOUT_SEO[currentLocale];
  const canonicalUrl = absUrl(localePath(currentLocale, ABOUT_PATH));
  const languageAlternates = Object.fromEntries(
    LOCALES.map((l) => [l, absUrl(localePath(l, ABOUT_PATH))])
  );

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ...languageAlternates,
        "x-default": absUrl(localePath(DEFAULT_LOCALE, ABOUT_PATH)),
      },
    },
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const content = ABOUT_CONTENT[locale];

  return (
    <div className="stack">
      <section className="card p-4 sm:p-5 stack gap-4">
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">{content.heading}</h1>

        <div className="stack gap-3 text-sm text-gray-700 leading-relaxed">
          <p className="font-medium">{content.intro}</p>
          <p>{content.body}</p>
          <p className="muted">{content.data}</p>
        </div>

        <div className="flex flex-wrap gap-3 pt-1">
          <a
            href="mailto:admin@studiosmap.app"
            className="btn btn-primary"
          >
            {content.contactLabel} — admin@studiosmap.app
          </a>
          <a
            href="https://t.me/studiosmap"
            target="_blank"
            rel="noreferrer noopener"
            className="btn"
          >
            Telegram
          </a>
        </div>

        <div className="border-t border-[var(--glass-border)] pt-4">
          <a
            href="https://ko-fi.com/voloshinw"
            target="_blank"
            rel="noreferrer noopener"
            className="btn"
          >
            ☕ {content.supportLabel}
          </a>
        </div>
      </section>
    </div>
  );
}
