import type { Locale } from "@/i18n";

type UiStrings = Record<string, Record<Locale, string>>;

export const UI_STRINGS: UiStrings = {
  search_placeholder: {
    ru: "Поиск по студиям и залам",
    ro: "Căutare după studiouri și săli",
    en: "Search studios and halls",
  },
  filters_title: {
    ru: "Фильтры",
    ro: "Filtre",
    en: "Filters",
  },
  districts_title: {
    ru: "Районы",
    ro: "Cartiere",
    en: "Districts",
  },
  tags_title: {
    ru: "Теги",
    ro: "Etichete",
    en: "Tags",
  },
  price_title: {
    ru: "Цена",
    ro: "Preț",
    en: "Price",
  },
  apply: {
    ru: "Применить",
    ro: "Aplică",
    en: "Apply",
  },
  reset: {
    ru: "Сбросить",
    ro: "Resetare",
    en: "Reset",
  },
  min_label: {
    ru: "мин",
    ro: "min",
    en: "min",
  },
  weekend_label: {
    ru: "выходные",
    ro: "weekend",
    en: "weekend",
  },
  daylight_short_label: {
    ru: "дневной свет",
    ro: "lumină naturală",
    en: "daylight",
  },
  video_short_label: {
    ru: "видео",
    ro: "video",
    en: "video",
  },
  no_results: {
    ru: "Ничего не найдено",
    ro: "Nu s-a găsit nimic",
    en: "No results",
  },
  per_hour: {
    ru: "в час",
    ro: "pe oră",
    en: "per hour",
  },
};
