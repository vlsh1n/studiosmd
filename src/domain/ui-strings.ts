import type { Locale } from "@/i18n";

type UiStrings = Record<string, Record<Locale, string>>;

export const UI_STRINGS: UiStrings = {
  landing_title: {
    ru: "Каталог фотостудий Кишинёва",
    ro: "Catalog de studiouri foto în Chișinău",
    en: "Photo studios catalog in Chisinau",
  },
  landing_body: {
    ru: "Быстро выбирайте зал по фото, цене и фильтрам. Сравнивайте карточки и переходите к студии с фокусом на выбранный зал.",
    ro: "Alegeți rapid sala după poze, preț și filtre. Comparați cardurile și deschideți studioul cu focus pe sala aleasă.",
    en: "Quickly pick a hall by photos, price, and filters. Compare cards and jump to the studio with the selected hall in focus.",
  },
  landing_cta: {
    ru: "Искать студию",
    ro: "Caută studio",
    en: "Find a studio",
  },
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
  options_title: {
    ru: "Опции",
    ro: "Opțiuni",
    en: "Options",
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
  facts_title: {
    ru: "Факты",
    ro: "Fapte",
    en: "Facts",
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
  blackout_fact_label: {
    ru: "Блэкаут",
    ro: "Blackout",
    en: "Blackout",
  },
  parking_fact_label: {
    ru: "Парковка",
    ro: "Parcare",
    en: "Parking",
  },
  changing_room_fact_label: {
    ru: "Гримерка/переодевание",
    ro: "Cameră de schimb",
    en: "Changing area",
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
  cyclorama_fact_label: {
    ru: "Циклорама",
    ro: "Cyclorama",
    en: "Cyclorama",
  },
  view_hall_cta: {
    ru: "Посмотреть",
    ro: "Vezi",
    en: "View",
  },
  instagram_cta: {
    ru: "Instagram",
    ro: "Instagram",
    en: "Instagram",
  },
  yandex_maps_cta: {
    ru: "Yandex Maps",
    ro: "Yandex Maps",
    en: "Yandex Maps",
  },
  google_maps_cta: {
    ru: "Google Maps",
    ro: "Google Maps",
    en: "Google Maps",
  },
  phone_cta: {
    ru: "Телефон",
    ro: "Telefon",
    en: "Phone",
  },
  working_hours_label: {
    ru: "График:",
    ro: "Program:",
    en: "Hours:",
  },
  working_hours_fallback: {
    ru: "по запросу",
    ro: "la cerere",
    en: "on request",
  },
  logo_placeholder: {
    ru: "Лого",
    ro: "Logo",
    en: "Logo",
  },
  halls_count: {
    ru: "Залов: {count}",
    ro: "Săli: {count}",
    en: "Halls: {count}",
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
};
