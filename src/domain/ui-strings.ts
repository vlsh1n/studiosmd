import type { Locale } from "@/i18n";

type UiStrings = Record<string, Record<Locale, string>>;

export const UI_STRINGS: UiStrings = {
  landing_title: {
    ru: "Каталог фотостудий в Кишинёве",
    ro: "Catalog de studiouri foto din Chișinău",
    en: "Photo studios directory in Chișinău",
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
  support_project_cta: {
    ru: "Поддержать проект",
    ro: "Susține proiectul",
    en: "Support project",
  },
  footer_disclaimer: {
    ru: "Указанные цены не являются публичной офертой. Некоторые цены могут быть не актуальны. Актуальные цены уточняйте используя контакты фотостудий. Вся доступная информация получена из открытых источников.",
    ro: "Prețurile indicate nu constituie o ofertă publică. Unele prețuri pot să nu fie actuale. Pentru prețurile actuale, vă rugăm să folosiți contactele studiourilor foto. Toate informațiile disponibile sunt obținute din surse publice.",
    en: "The listed prices do not constitute a public offer. Some prices may be outdated. Please use photo studio contacts to confirm current prices. All available information is collected from public sources.",
  },
  catalog_h1: {
    ru: "Каталог фотостудий в Кишинёве",
    ro: "Catalog de studiouri foto din Chișinău",
    en: "Photo studios directory in Chișinău",
  },
  catalog_intro: {
    ru: "Подберите студию и зал по фото, цене, району и опциям.",
    ro: "Alegeți studioul și sala după poze, preț, sector și opțiuni.",
    en: "Pick a studio and hall by photos, price, district, and options.",
  },
  catalog_body: {
    ru: "В Кишинёве 21 фотостудия в 5 районах: Ботаника, Буюканы, Центр, Чеканы и Рышкановка. Цены на почасовую аренду варьируются от 500 до 1300 MDL в час. Студии различаются по специализации: портрет, мода, предметные и семейные фотосессии. Самые распространённые удобства — дневной свет, блэкаут, парковка и циклорама. Указанные цены получены из открытых источников — уточняйте актуальные цены напрямую у студий.",
    ro: "Chișinăul are 21 de studiouri foto în 5 sectoare: Botanica, Buiucani, Centru, Ciocana și Riscani. Prețurile pentru închirierea orară variază de la 500 la 1300 MDL pe oră. Studiourile diferă după specializare: portret, modă, product și ședințe de familie. Cele mai frecvente facilități sunt lumina naturală, opțiunea blackout, parcarea și cyclorama. Prețurile afișate provin din surse publice — contactați studiourile direct pentru confirmare.",
    en: "Chișinău has 21 photo studios across 5 districts: Botanica, Buiucani, Centru, Ciocana, and Riscani. Hourly rental prices range from 500 to 1,300 MDL per hour. Studios vary by specialisation: portrait, fashion, product shoots, and family sessions. The most common amenities are natural light, blackout option, parking, and cyclorama. Listed prices are sourced from public information — contact studios directly to confirm current rates.",
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
    ro: "Sectoare",
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
    ro: "Ciclorama",
    en: "Cyclorama",
  },
  view_hall_cta: {
    ru: "Посмотреть",
    ro: "Află mai mult",
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
  contacts_cta: {
    ru: "Контакты",
    ro: "Contacte",
    en: "Contacts",
  },
  support_cta: {
    ru: "Поддержка",
    ro: "Suport",
    en: "Support",
  },
  telegram_cta: {
    ru: "Telegram",
    ro: "Telegram",
    en: "Telegram",
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
  price_on_request: {
    ru: "Цена по запросу",
    ro: "Preț la cerere",
    en: "Price on request",
  },
  nav_menu_label: {
    ru: "Меню навигации",
    ro: "Meniu de navigare",
    en: "Navigation menu",
  },
  nav_menu_open: {
    ru: "Открыть меню",
    ro: "Deschide meniu",
    en: "Open menu",
  },
  nav_menu_close: {
    ru: "Закрыть меню",
    ro: "Închide meniu",
    en: "Close menu",
  },
  nav_catalog: {
    ru: "Каталог",
    ro: "Catalog",
    en: "Catalog",
  },
  nav_studios: {
    ru: "Студии",
    ro: "Studiouri",
    en: "Studios",
  },
  nav_about: {
    ru: "О проекте",
    ro: "Despre proiect",
    en: "About",
  },
  nav_faq: {
    ru: "FAQ",
    ro: "FAQ",
    en: "FAQ",
  },
  nav_section_pages: {
    ru: "Страницы",
    ro: "Pagini",
    en: "Pages",
  },
  nav_section_language: {
    ru: "Язык",
    ro: "Limbă",
    en: "Language",
  },
  nav_section_contact: {
    ru: "Контакты",
    ro: "Contacte",
    en: "Contacts",
  },
};
