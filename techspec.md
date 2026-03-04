# studiosmap — Technical Specification (Current State)

Документ описывает фактическое состояние кода проекта `studiosmap`.

## 0) Purpose

- Зафиксировать текущую архитектуру и поведение.
- Синхронизировать продуктовые и технические решения.
- Упростить планирование следующих задач и онбординг.

## 1) Product Scope

- Продукт: мультиязычный каталог фотостудий и залов в Кишинёве.
- Локали: `ro`, `ru`, `en`.
- Основной flow:
  - `/` — landing с выбором языка.
  - `/{locale}` — каталог (поиск/фильтры/сортировка/пагинация).
  - `/{locale}/studios/{id}-{slug}` — страница студии.
  - `/{locale}/studios/{studioSlug}/{hallSlug}` — человекочитаемый вход на конкретный зал с фокусом.

## 2) Stack

- `next@16.1.6` (App Router)
- `react@19.2.3`, `react-dom@19.2.3`
- TypeScript 5
- Tailwind CSS v4
- Prisma + PostgreSQL
- Framer Motion + Embla Carousel

## 3) Routing and Layout

### 3.1 Routes

- `/` — landing page.
- `/[locale]` — каталог.
- `/[locale]/studios/[studioSlug]` — студия (включая поддержку legacy id/id-slug через resolver).
- `/[locale]/studios/[studioSlug]/[hallSlug]` — hall-friendly URL.
- `/robots.txt` — правила индексации.
- `/sitemap.xml` — sitemap.
- `/og-image` — динамическая social image.

### 3.2 Root layout (`src/app/layout.tsx`)

- Устанавливает `metadataBase` из `NEXT_PUBLIC_SITE_URL` fallback.
- Подключает favicon/apple icons и `site.webmanifest`.
- Подключает GA4 через `next/script` (`afterInteractive`) при наличии `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
- Проставляет `<html lang>` на основе `x-locale` из middleware.
- Рендерит `KofiOverlay`.

### 3.3 Locale layout (`src/app/[locale]/layout.tsx`)

- Валидация локали.
- Header: бренд, переключатель языка, Telegram contacts CTA.
- Donate-кнопки в mobile header нет.
- Footer: disclaimer на всех локалях (`UI_STRINGS.footer_disclaimer`).

## 4) Middleware (`middleware.ts`)

- Поддерживаемые локали: `ro`, `ru`, `en`.
- Default locale fallback: `ro`.
- Пишет `x-locale` в request headers для server components/layout.
- Rate limiting (best-effort in-memory per instance):
  - `RATE_LIMIT_WINDOW_MS` (default `60000`)
  - `RATE_LIMIT_MAX_REQUESTS` (default `240`)
- На лимите возвращает `429` + rate-limit headers.
- Выставляет rate-limit headers и на обычные ответы.

## 5) i18n and Dictionaries

- `src/i18n/index.ts`:
  - `locales = ["ro", "ru", "en"]`
  - `projectName = "studiosmap"` для всех локалей.
- `src/domain/ui-strings.ts`:
  - Полный UI copy для landing, catalog, studio.
  - `support_project_cta` и `footer_disclaimer` на всех локалях.
- `src/domain/dictionaries.ts`:
  - Районы (`DISTRICTS`) и теги (`TAGS`).
  - Тег `wedding` присутствует и локализован.

## 6) Data Model (Prisma)

Файл: `prisma/schema.prisma`.

### 6.1 `Studio`

- `id`, `name_i18n`, `address_i18n`, `district_key`
- `phone`, `instagram_nickname`, `google_maps_url`, `yandex_maps_url`
- `logo_url`, `working_hours_i18n`
- relation: `halls`

### 6.2 `Hall`

- `id`, `studioId`, `name_i18n`, `images`
- `area_sqm`, `high_ceiling`, `weekend_price`
- boolean facts:
  - `daylight`, `blackout`, `parking`, `changing_room`
  - `furniture`, `flash_light`, `continuous_light`, `cyclorama`
- `tags` (`String[]`), `price_per_hour` (`Int?`, nullable)

Price notes:

- Часовая цена может отсутствовать (`NULL` в БД).
- Для отсутствующей цены UI показывает явный fallback:
  - `ru`: `Цена по запросу`
  - `ro`: `Preț la cerere`
  - `en`: `Price on request`

Migration notes:

- `20260304224937_make_hall_price_nullable`:
  - служебная миграция, удалившая часть индексов.
- `20260305005500_make_hall_price_nullable_and_restore_indexes`:
  - делает `Hall.price_per_hour` nullable,
  - восстанавливает индексы каталога.

## 7) Query Layer (`src/db/queries.ts`)

- `listHalls(params)`:
  - filters by district/tags/facts/search
  - supports sort `price_asc | price_desc`
  - сортировка цен использует `nulls: last`
  - returns localized hall/studio fields
- `getStudioById(id, locale)`:
  - loads studio + halls, localizes output
  - сортировка залов по цене также с `nulls: last`
- `listHallRouteEntries(locale)`:
  - route helper для hall-friendly URL resolution
  - возвращает `hall.id`, `hall.name`, `studio.id`, `studio.name`

## 8) Catalog Page (`src/app/[locale]/page.tsx`)

- Параметры query:
  - `q`, `page`, `districts`, `tags`, `facts`, `sort`
- `PAGE_SIZE = 12`.
- Сортировка:
  - `price_asc`, `price_desc` в БД
  - `NULL` цены всегда в конце списка
  - `random` — server-side shuffle текущей страницы
- UI tags filter секция скрыта (`SHOW_TAG_FILTERS = false`), backend tags filter активен.
- В карточках каталога:
  - title: `"{hallName} | {studioName}"`
  - studio name убран из блока под заголовком
  - при `price_per_hour = null` отображается локализованное `price_on_request`
  - CTA ведет на hall-friendly URL:
    - `/{locale}/studios/{studioSlug}/{hallSlug}`
- Tracking:
  - `search_used`
  - `filter_used`
  - `hall_clicked`

## 9) Studio Pages

### 9.1 Canonical studio route (`src/app/[locale]/studios/[studioSlug]/page.tsx`)

- Принимает `studioSlug`, резолвит:
  - legacy id
  - id-slug
- Канонизирует URL:
  - permanent redirect на `/{locale}/studios/{id}-{normalized-studio-slug}` при неканоничном сегменте.
- Рендерит:
  - карточку студии (logo/address/hours)
  - контактные CTA (Instagram/Phone/Yandex/Google)
  - список залов с галереей и фактами
  - при `price_per_hour = null` в карточке зала показывается локализованное `price_on_request`
- Фокус на зал:
  - по `hallId` (query), компонент `HallFocus`.
- Tracking кликов по контактам:
  - event: `studio_contact_clicked`
  - placements: `studio_header`, `hall_card_footer`.
- JSON-LD:
  - `LocalBusiness` (`application/ld+json`) на странице студии.

### 9.2 Hall-friendly route (`src/app/[locale]/studios/[studioSlug]/[hallSlug]/page.tsx`)

- Резолвит `studioSlug/hallSlug` через `listHallRouteEntries`.
- Делегирует рендер на canonical studio page + передает `hallId` для фокуса.
- Метадата наследуется от студийной страницы.
- Специального SEO для hall pages не добавлено (канонический документ — страница студии).

## 10) SEO

### 10.1 Global helpers (`src/seo/site.ts`, `src/seo/studio.ts`)

- `SITE_NAME = studiosmap`
- `DEFAULT_LOCALE = ro`
- `absUrl`, `localePath`
- studio/hall slug builders and parsers

### 10.2 Metadata coverage

- `/`:
  - localized-friendly title/description (RO copy)
  - canonical + hreflang + `x-default -> /ro`
  - OpenGraph + Twitter
- `/{locale}`:
  - localized title/description
  - canonical + hreflang + `x-default`
  - OpenGraph + Twitter
  - `noindex,follow` when filter/search query exists
- `/{locale}/studios/{id}-{slug}`:
  - data-driven localized title/description
  - canonical + hreflang + `x-default`
  - OpenGraph + Twitter
  - JSON-LD LocalBusiness

### 10.3 Robots and Sitemap

- `src/app/robots.ts`:
  - allow `*`
  - explicit disallow for selected AI crawlers (`GPTBot`, `ClaudeBot`, `Bytespider`, `CCBot`, etc.)
- `src/app/sitemap.ts`:
  - locale roots and canonical studio URLs only
  - alternates with `x-default`
  - hall-friendly URLs intentionally не включены

## 11) Analytics

- GA4:
  - `gtag.js` в root layout через `next/script`.
- Event helper:
  - `src/lib/analytics.ts` (`trackEvent`).
- Кастомные события:
  - `search_used`
  - `filter_used`
  - `hall_clicked`
  - `studio_contact_clicked`

## 12) Brand, Assets, and Verification

- Бренд в UI и SEO: `studiosmap`.
- Domain source: `NEXT_PUBLIC_SITE_URL` (e.g. `https://studiosmap.co`).
- Favicons/manifest подключены через metadata в root layout.
- Public verification files:
  - `public/google67b22732033f93ac.html`
  - `public/yandex_01966a39087652e3.html`

## 13) Landing and Donations

- Landing расположен на `/` (без редиректа в каталог).
- На landing есть:
  - `Find a studio` CTA
  - `Support project` CTA (localized)
- Desktop Ko-fi overlay активен через `KofiOverlay`.
- Legacy `KofiMobileHeaderButton` компонент присутствует в репозитории, но в layout не используется.

## 14) Environment Variables

Обязательные/используемые:

- `DATABASE_URL`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` (optional)
- `RATE_LIMIT_WINDOW_MS` (optional)
- `RATE_LIMIT_MAX_REQUESTS` (optional)

## 15) Build and Deployment

Scripts:

- `npm run dev`
- `npm run lint`
- `npm run build`
- `npm start`
- `npm run db:migrate`
- `npm run db:seed`

Deployment (Railway or similar):

- Build: `npm run build`
- Start: `npm start`
- Migrations: `npm run db:migrate`

## 16) Known Limitations

- Lint warnings по `no-img-element` остаются (не блокируют build).
- Rate limit store in-memory (не shared между инстансами).
- Hall-friendly route resolution использует match по локализованным slug имени студии/зала; при дублях имен возможны коллизии.
