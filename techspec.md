# studiosmd — Technical Specification (Current State)

Документ фиксирует текущее техническое состояние проекта `studiosmd` по коду в репозитории на текущий момент.

## 0) Purpose

- Зафиксировать текущую архитектуру, ограничения и принятые решения.
- Упростить онбординг и планирование следующих задач.
- Держать единый источник правды по фактическому состоянию кода.

## 1) Product Scope

- Продукт: мультиязычный каталог залов фотостудий Кишинёва.
- Поддерживаемые локали: `ru`, `ro`, `en`.
- Главная сущность выбора: `Hall` (зал).
- Основные пользовательские сценарии:
  - Landing на `/` с переключением языка и CTA в каталог.
  - Каталог `/{locale}` с поиском, фильтрами, сортировкой и пагинацией.
  - Страница студии `/{locale}/studios/[id]` с карточкой студии и списком залов.
  - Deep-link фокус на зал через `hallId`.
  - Галерея зала: inline carousel + fullscreen modal.
  - Donate интеграция через Ko-fi (desktop overlay + mobile header button).

## 2) Tech Stack

- Framework: `next@16.1.6` (App Router).
- UI runtime: `react@19.2.3`, `react-dom@19.2.3`.
- Language: TypeScript (`typescript@5`).
- Styling: Tailwind CSS v4 + `src/app/globals.css`.
- Motion & gallery: `framer-motion`, `embla-carousel-react`.
- Data layer: Prisma + PostgreSQL (`prisma`, `@prisma/client`).

## 3) Scripts and Quality Gate

- `npm run dev` — локальный dev сервер.
- `npm run lint` — ESLint.
- `npm run build` — `npm run lint && next build`.
- `npm start` — запуск production build.
- `npm run prisma:generate` — Prisma Client generate.
- `npm run db:migrate` — `prisma migrate deploy`.
- `npm run db:seed` — `prisma db seed` (`tsx prisma/seed.ts`).

Quality gate:

- Build блокируется lint errors.
- Lint warnings не блокируют build.

## 4) Routing and Layout

### 4.1 Routes

- `/` — landing page.
- `/[locale]` — локализованный каталог.
- `/[locale]/studios/[id]` — страница студии.

### 4.2 App structure

- `src/app/layout.tsx`
  - Читает `x-locale` из `headers()`.
  - Проставляет `<html lang>`.
  - Рендерит `KofiOverlay` в конце `<body>`.
- `src/app/page.tsx`
  - Client landing с локальным переключателем языка.
- `src/app/[locale]/layout.tsx`
  - Валидация локали.
  - Header с брендом `STUDIOS.MD`, `LocaleSwitcher`.
  - Мобильная donate-кнопка в header.
- `src/app/[locale]/page.tsx`
  - Каталог.
- `src/app/[locale]/studios/[id]/page.tsx`
  - Страница студии.

### 4.3 Middleware

Файл: `middleware.ts`.

- Определяет локаль из первого сегмента пути.
- Пишет `x-locale` в request headers.
- Default locale: `ru`.

## 5) i18n

- Источник локалей: `src/i18n/index.ts`.
- Локали: `ru`, `ro`, `en`.
- Базовые словари проекта (`projectName`) в `src/i18n/*.ts`.
- UI copy в `src/domain/ui-strings.ts`.
- Словари районов и тегов в `src/domain/dictionaries.ts`.

## 6) Data Model (Prisma)

Файл: `prisma/schema.prisma`.

### 6.1 Enums

- `DistrictKey`: `botanica | ciocana | centru | buiucani | riscani`.

Примечание:

- `daylight` и другие hall-факты сейчас хранятся как `Boolean` в `Hall`.
- Enum-ы `Daylight` и `VideoFriendly` удалены.

### 6.2 Model: Studio

- `id: String @id @default(cuid())`
- `name_i18n: Json`
- `address_i18n: Json`
- `district_key: DistrictKey`
- `cover_images: Json`
- `phone: String?`
- `instagram_nickname: String?`
- `google_maps_url: String?`
- `yandex_maps_url: String?`
- `logo_url: String?`
- `working_hours_i18n: Json?`
- relation: `halls: Hall[]`

Примечание:

- Старое поле `contacts` удалено миграцией `20260210212000_day7_studio_info_fields`.

### 6.3 Model: Hall

- `id: String @id @default(cuid())`
- `studioId: String`
- `name_i18n: Json`
- `images: Json`
- `area_sqm: Int?`
- `high_ceiling: Int?`
- `weekend_price: Int?`
- `daylight: Boolean @default(false)`
- `blackout: Boolean @default(false)`
- `parking: Boolean @default(false)`
- `changing_room: Boolean @default(false)`
- `furniture: Boolean @default(false)`
- `flash_light: Boolean @default(false)`
- `continuous_light: Boolean @default(false)`
- `cyclorama: Boolean @default(false)`
- `tags: String[]`
- `price_per_hour: Int`
- relation: `studio` (`onDelete: Cascade`)

Примечание:

- `cyclorama` перенесен из `tags` в отдельную boolean-колонку.

### 6.4 Catalog indexes

Миграция: `prisma/migrations/20260208173000_add_catalog_indexes/migration.sql`.

- `Hall(price_per_hour)`
- `Hall(studioId)`
- `Studio(district_key)`
- `Hall(tags)` через GIN

Актуальные миграции по hall-фактам:

- `prisma/migrations/20260213120000_hall_filters_to_boolean/migration.sql`
  - перевод фактов каталога в boolean-колонки `Hall`
  - удаление `video_friendly`
- `prisma/migrations/20260213212824_move_cyclorama_to_hall_fact/migration.sql`
  - перенос `cyclorama` из `tags` в `Hall.cyclorama`

## 7) Query Layer

Файл: `src/db/queries.ts`.

### 7.1 `listHalls(params)`

Параметры:

- `locale`
- `q?`
- `district_keys?`
- `tags?`
- `facts?`:
  - `daylight`
  - `blackout`
  - `parking`
  - `changing_room`
  - `furniture`
  - `flash_light`
  - `continuous_light`
  - `cyclorama`
- `sort?: price_asc | price_desc`
- `take?`, `skip?`

Поведение:

- `tags` фильтруются через `hasEvery` (AND semantics).
- `facts` фильтруются напрямую по boolean-колонкам `Hall`.
- Поиск по `name_i18n` зала и студии (JSON path, insensitive).
- Сортировка: `price_per_hour` + стабильный tie-breaker `id`.
- Возврат: локализованные `hall.name`, `studio.name`, `studio.address`.

### 7.2 `getStudioById(id, locale)`

- `findUnique` по `Studio.id` + include `halls`.
- `halls` сортируются по `price_per_hour asc`.
- Локализация названия/адреса студии и названий залов.

## 8) Catalog Page (`src/app/[locale]/page.tsx`)

### 8.1 Query contract

- `q` — поисковый запрос (trim + limit 80).
- `page` — номер страницы (`>=1`).
- `districts` — CSV и/или repeated params.
- `tags` — CSV и/или repeated params.
- `facts` — CSV и/или repeated params.
- `sort` — `random | price_asc | price_desc`.

### 8.2 Pagination

- `PAGE_SIZE = 12`.
- В `listHalls` передаётся `take = PAGE_SIZE + 1` для `hasNext`.
- `skip = (page - 1) * PAGE_SIZE`.
- Prev/Next сохраняют текущие фильтры в query string.

### 8.3 Sorting

- `price_asc`, `price_desc` — на уровне БД.
- `random` — перемешивание текущей страницы на сервере (`shuffleArray`).
- Default сортировка в UI: `random`.

### 8.4 Filters UI

- Районы: pills-чекбоксы.
- Опции (`facts`): pills-чекбоксы с иконками (`/public/icons/*`).
  - `daylight`, `blackout`, `parking`, `changing_room`,
  - `furniture`, `flash_light`, `continuous_light`, `cyclorama`
- Теги: backend поддержан, но UI скрыт (`SHOW_TAG_FILTERS = false`).

### 8.5 Catalog cards

- Фолбек изображения: `hall.images[0]` -> `studio.cover_images[0]` -> placeholder.
- Факты карточки собираются из boolean-колонок `Hall`.
- Теги карточки рендерятся отдельно из `Hall.tags` (без факт-тегов).
- CTA ведет в студию с deep-link:
  - `/{locale}/studios/{studioId}?hallId={hallId}#hall-{hallId}`.

## 9) Studio Page (`src/app/[locale]/studios/[id]/page.tsx`)

### 9.1 Studio info card

- Лого 1:1 (`logo_url`) или локализованный placeholder.
- Плашки: район и количество залов.
- Текстом: адрес + график работы.
- График fallback: `UI_STRINGS.working_hours_fallback`.

### 9.2 Studio CTA pills

- Instagram
- Телефон (`tel:`), в кнопке отображается номер
- Yandex Maps
- Google Maps

Правила:

- Instagram в БД хранится как nickname; на странице приводится к `https://instagram.com/{nickname}`.
- Внешние URL проходят через `safeExternalUrl`.

### 9.3 Hall cards on studio page

- Галерея зала + инфо-блок (цена, площадь/высота, теги, факты).
- Факты карточек на странице студии также строятся из boolean-колонок `Hall` (включая `cyclorama`).
- Нижний блок CTA: icon-only pills (Instagram/Phone/Yandex/Google), выравнивание по центру, hover inversion.

Примечание:

- Старый отдельный блок cover-фото студии удален.

## 10) Hall Gallery (`HallGalleryZoom.tsx`)

- Inline gallery: Embla carousel, стрелки (desktop), счетчик.
- Fullscreen modal:
  - `createPortal` в `document.body`
  - `AnimatePresence` + motion transitions
  - keyboard nav (`Esc`, `ArrowLeft`, `ArrowRight`)
  - body scroll lock
- Mobile swipe в modal:
  - horizontal swipe threshold `42px`
  - перелистывание влево/вправо.
- Если `images.length === 0`, компонент возвращает `null`.

## 11) Landing Page (`src/app/page.tsx`)

- Client page с локальным `useState` для выбора локали (без URL смены до нажатия CTA).
- Тексты `landing_title`, `landing_body`, `landing_cta` берутся из `UI_STRINGS`.
- CTA ведет на `/{locale}`.
- В header используется бренд `STUDIOS.MD`.

### 11.1 Landing media

- Используются локальные assets:
  - `design/central.png`
  - `design/hall1.png`
  - `design/hall2.png`
  - `design/hall3.png`
  - `design/hall4.png`

### 11.2 Landing responsive layout

- `<1024`: показывается центральное изображение, боковые карточки скрыты.
- `1024–1279`: fallback desktop layout с абсолютным позиционированием и увеличенной высотой сцены.
- `>=1280`: координатный desktop layout (Figma-like) через проценты и `aspect-ratio` сцены.
- Изображения настроены через `object-position: center top`, верхний crop минимизирован.

## 12) Ko-fi Integration

### 12.1 Desktop

Файл: `src/components/KofiOverlay.client.tsx`.

- Подключается скрипт `https://storage.ko-fi.com/cdn/scripts/overlay-widget.js` (`afterInteractive`).
- На `>=640px` рисуется overlay donate widget (`floating-chat`).
- Защита от двойного draw через `window.__kofiOverlayMounted`.

### 12.2 Mobile

Файл: `src/components/KofiMobileHeaderButton.client.tsx`.

- В header локализованного layout показывается компактная кнопка `Donate`.
- Ссылка: `https://ko-fi.com/voloshinw`.

### 12.3 CSS guard for overlay

Файл: `src/app/globals.css`.

- Чтобы overlay не ломал stacking контексты приложения:
  - `body > div[id^="kofi-widget-overlay-"] { position: static !important; z-index: auto !important; }`

## 13) URL Safety and Data Hygiene

Файл: `src/lib/url.ts`.

`safeExternalUrl(value)`:

- принимает только непустые строки;
- парсит через `new URL(...)`;
- разрешает только `http:` / `https:`;
- иначе возвращает `null`.

Используется для:

- внешних ссылок студии (`google_maps_url`, `yandex_maps_url`, `logo_url`),
- изображений залов/студий,
- других внешних URL в UI.

## 14) Styling System (StudiosMD)

Файл: `src/app/globals.css`.

- Семантические классы: `.page`, `.panel`, `.card`, `.pill`, `.btn`, `.btn-primary`, `.input`, `.select`, `.muted`, `.stack`.
- Базовый визуал: мягкий glass-like стиль, rounded surfaces, спокойные тени.
- Глобальные интерактивные состояния для кликабельных контролов:
  - hover inversion
  - active/selected инверсионный вариант.

## 15) Seed Data

Файл: `prisma/seed.ts`.

- Создает 5 студий и 10 залов.
- Перед сидированием очищает `Hall`, затем `Studio`.
- Для `Hall` использует актуальные boolean-факты:
  - `daylight`, `blackout`, `parking`, `changing_room`,
  - `furniture`, `flash_light`, `continuous_light`, `cyclorama`.
- Использует актуальные поля `Studio`:
  - `phone`, `instagram_nickname`, `google_maps_url`, `yandex_maps_url`, `logo_url`, `working_hours_i18n`.

## 16) Environment and Deployment

### 16.1 Environment variables

- `DATABASE_URL` — required.
- `NEXT_PUBLIC_SITE_URL` — optional (в текущем app-коде не используется напрямую).

Примечание:

- `NEXT_PUBLIC_KOFI_URL` в текущем коде не используется.

### 16.2 Deployment (Railway)

- Build: `npm run build`
- Start: `npm start`
- Migrations: `npm run db:migrate`
- Seed: `npm run db:seed` при явной необходимости

## 17) Known Limitations

- `eslint` warnings по `@next/next/no-img-element` в ряде компонентов (осознанно используется `<img>`).
- В `src/db/prisma.ts` остается предупреждение про `eslint-disable no-var`.
- Теги в query поддерживаются, но UI секция тегов скрыта (`SHOW_TAG_FILTERS = false`).
- Для landing используются локальные файлы `design/*.png`; эти assets должны присутствовать в рабочем дереве для корректного build.
