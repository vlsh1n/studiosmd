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
  filters_params_title: {
    ru: "Параметры",
    ro: "Parametri",
    en: "Parameters",
  },
  sort_label: {
    ru: "Сортировка",
    ro: "Sortare",
    en: "Sort",
  },
  sort_random: {
    ru: "Случайно",
    ro: "Aleator",
    en: "Random",
  },
  sort_price_asc: {
    ru: "Цена: по возрастанию",
    ro: "Preț: crescător",
    en: "Price: low to high",
  },
  sort_price_desc: {
    ru: "Цена: по убыванию",
    ro: "Preț: descrescător",
    en: "Price: high to low",
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
  daylight_fact_label: {
    ru: "Дневной свет",
    ro: "Lumină naturală",
    en: "Daylight",
  },
  video_allowed_label: {
    ru: "Можно ли снимать видео?",
    ro: "Se poate filma video?",
    en: "Can you shoot video?",
  },
  furniture_label: {
    ru: "Мебель",
    ro: "Mobilier",
    en: "Furniture",
  },
  flash_light_label: {
    ru: "Импульсный свет",
    ro: "Lumină cu blitz",
    en: "Flash light",
  },
  continuous_light_label: {
    ru: "Постоянный свет",
    ro: "Lumină continuă",
    en: "Continuous light",
  },
  view_hall_cta: {
    ru: "Посмотреть",
    ro: "Vezi",
    en: "View",
  },
  no_results: {
    ru: "Ничего не найдено",
    ro: "Nu s-a găsit nimic",
    en: "No results",
  },
  pagination_prev: {
    ru: "Назад",
    ro: "Înapoi",
    en: "Previous",
  },
  pagination_next: {
    ru: "Вперёд",
    ro: "Înainte",
    en: "Next",
  },
  per_hour: {
    ru: "в час",
    ro: "pe oră",
    en: "per hour",
  },
  support_project: {
    ru: "Поддержать проект",
    ro: "Susține proiectul",
    en: "Support project",
  },
};
