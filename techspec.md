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
  - `/{locale}/studios/{studioSlug}` — страница студии (`studioSlug` = `Studio.slug` в БД).
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
- `/[locale]/studios/[studioSlug]` — студия; прямой lookup по `Studio.slug`.
- `/[locale]/studios/[studioSlug]/[hallSlug]` — hall-friendly URL.
- `/robots.txt` — правила индексации.
- `/sitemap.xml` — sitemap.
- `/og-image` — динамическая social image.

### 3.2 Root layout (`src/app/layout.tsx`)

- Устанавливает `metadataBase` из `NEXT_PUBLIC_SITE_URL` fallback.
- Подключает favicon/apple icons и `site.webmanifest`.
- Подключает GA4 через `next/script` (`afterInteractive`) при наличии `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
- Проставляет `<html lang>` на основе `x-locale` из `src/proxy.ts`.
- Рендерит `KofiOverlay`.

### 3.3 Locale layout (`src/app/[locale]/layout.tsx`)

- Валидация локали.
- Header: бренд, переключатель языка, Telegram contacts CTA.
- Footer: disclaimer на всех локалях (`UI_STRINGS.footer_disclaimer`).
- Подключает `HtmlLangSync.client.tsx`, который синхронизирует `document.documentElement.lang` на client-side переходах между локалями.

## 4) Proxy (`src/proxy.ts`)

- Поддерживаемые локали: `ro`, `ru`, `en`.
- Default locale fallback: `ro`.
- Пишет `x-locale` в request headers для server components/layout.
- Rate limiting (best-effort in-memory per instance):
  - `RATE_LIMIT_WINDOW_MS` (default `60000`)
  - `RATE_LIMIT_MAX_REQUESTS` (default `240`)
- На лимите возвращает `429` + rate-limit headers.
- Работает через file convention Next.js 16 (`proxy.ts`), legacy `middleware.ts` в проекте не используется.

## 5) i18n and Dictionaries

- `src/i18n/index.ts`:
  - `locales = ["ro", "ru", "en"]`
  - `projectName = "studiosmap"` для всех локалей.
- `src/domain/ui-strings.ts`:
  - Полный UI copy для landing, catalog, studio.
  - `support_project_cta` и `footer_disclaimer` на всех локалях.
- `src/domain/dictionaries.ts`:
  - Районы (`DISTRICTS`) и теги (`TAGS`).

Важно: названия студий и залов не локализуются. Хранятся как одна строка (английский язык), используются напрямую на всех локалях.

## 6) Data Model (Prisma)

Файл: `prisma/schema.prisma`.

### 6.1 `Studio`

- `id` (cuid), `slug` (unique), `name`, `address`, `district_key`
- `phone`, `instagram_nickname`, `google_maps_url`, `yandex_maps_url`
- `logo_url`, `working_hours` (nullable)
- relation: `halls`

### 6.2 `Hall`

- `id` (cuid), `studioId`, `name`
- `images` (`String[]`)
- `area_sqm`, `high_ceiling`, `weekend_price`
- boolean facts: `daylight`, `blackout`, `parking`, `changing_room`, `furniture`, `flash_light`, `continuous_light`, `cyclorama`
- `tags` (`String[]`), `price_per_hour` (`Int?`, nullable)

Price notes:

- Часовая цена может отсутствовать (`NULL` в БД).
- Для отсутствующей цены UI показывает локализованное `price_on_request`.

Migration notes:

- `20260304224937_make_hall_price_nullable` — служебная миграция.
- `20260305005500_make_hall_price_nullable_and_restore_indexes` — делает `Hall.price_per_hour` nullable, восстанавливает индексы каталога.
- `20260316120000_flatten_name_fields` — заменяет `*_i18n Json` поля плоскими `String`; пересчитывает `Studio.slug` от английского названия; удаляет `name_i18n`, `address_i18n`, `working_hours_i18n`.

## 7) Query Layer (`src/db/queries.ts`)

- `listHalls(params)`:
  - filters by district/tags/facts/search
  - поиск по `hall.name` и `studio.name` (plain string, case-insensitive)
  - supports sort `price_asc | price_desc`
  - сортировка цен использует `nulls: last`
- `getStudioBySlug(slug)`:
  - loads studio + halls
  - сортировка залов по цене с `nulls: last`
- `listHallRouteEntries()`:
  - route helper для hall-friendly URL resolution
  - возвращает `hall.id`, `hall.name`, `studio.id`, `studio.slug`

## 8) Catalog Page (`src/app/[locale]/page.tsx`)

- Параметры query: `q`, `page`, `districts`, `tags`, `facts`, `sort`
- `PAGE_SIZE = 12`.
- Сортировка:
  - `price_asc`, `price_desc` в БД
  - `NULL` цены всегда в конце списка
  - `random` — server-side shuffle текущей страницы
- UI tags filter секция скрыта (`SHOW_TAG_FILTERS = false`), backend tags filter активен.
- В карточках каталога:
  - title: `"{hallName} | {studioName}"`
  - при `price_per_hour = null` отображается локализованное `price_on_request`
  - CTA ведет на hall-friendly URL: `/{locale}/studios/{studioSlug}/{hallSlug}`
- Tracking: `search_used`, `filter_used`, `hall_clicked`

## 9) Studio Pages

### 9.1 Canonical studio route (`src/app/[locale]/studios/[studioSlug]/page.tsx`)

- Принимает `studioSlug`, выполняет `getStudioBySlug(studioSlug)`.
- URL-канонизация:
  - permanent redirect на `/{locale}/studios/{studio.slug}` если `studioSlug !== studio.slug`.
- Рендерит:
  - карточку студии (logo/address/hours)
  - контактные CTA (Instagram/Phone/Yandex/Google)
  - список залов с галереей и фактами
  - при `price_per_hour = null` показывается локализованное `price_on_request`
- Фокус на зал: по `hallId` (query param), компонент `HallFocus`.
- Tracking: event `studio_contact_clicked`, placements `studio_header` / `hall_card_footer`.
- JSON-LD: `LocalBusiness` (`application/ld+json`).

### 9.2 Hall-friendly route (`src/app/[locale]/studios/[studioSlug]/[hallSlug]/page.tsx`)

- Резолвит `studioSlug/hallSlug` через `listHallRouteEntries()`:
  - `studio.slug === normalizedStudioSlug`
  - `slugifyStudioName(hall.name) === normalizedHallSlug`
- Делегирует рендер на canonical studio page + передает `hallId` для фокуса.
- Метадата наследуется от студийной страницы.
- Hall-friendly URLs — convenience URLs; canonical документ — страница студии.

## 10) SEO

### 10.1 Global helpers (`src/seo/site.ts`, `src/seo/studio.ts`)

- `SITE_NAME = studiosmap`, `DEFAULT_LOCALE = ro`
- `DEFAULT_CITY = "Chișinău"`, `DEFAULT_COUNTRY = "MD"` — используется в JSON-LD
- `absUrl`, `localePath`
- `buildStudioPath(slug)` → `/studios/{slug}`
- `buildStudioHallPath(studioName, hallName)`
- `slugifyStudioName`, `normalizeStudioSlug`

### 10.2 Metadata coverage

- `/`:
  - localized-friendly title/description (RO copy)
  - canonical + hreflang + `x-default -> /ro`
  - OpenGraph + Twitter
- `/{locale}`:
  - localized title/description
  - canonical + hreflang + `x-default`
  - `noindex,follow` when filter/search query exists
- `/{locale}/studios/{studioSlug}`:
  - data-driven title/description
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

- GA4: `gtag.js` в root layout через `next/script`.
- Event helper: `src/lib/analytics.ts` (`trackEvent`).
- Кастомные события:
  - `search_used`
  - `filter_used`
  - `hall_clicked`
  - `studio_contact_clicked`

## 12) Brand, Assets, and Verification

- Бренд: `studiosmap`. Domain: `NEXT_PUBLIC_SITE_URL` (e.g. `https://studiosmap.co`).
- Favicons/manifest подключены в root layout.
- Public verification files:
  - `public/google67b22732033f93ac.html`
  - `public/yandex_01966a39087652e3.html`

## 13) Landing and Donations

- Landing на `/`.
- Desktop Ko-fi overlay через `KofiOverlay.client.tsx`.
- `KofiMobileHeaderButton` — legacy компонент, в layout не используется.

## 14) Environment Variables

- `DATABASE_URL` (required)
- `NEXT_PUBLIC_SITE_URL` (recommended)
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` (optional)
- `RATE_LIMIT_WINDOW_MS` (optional, default `60000`)
- `RATE_LIMIT_MAX_REQUESTS` (optional, default `240`)

## 15) Build and Deployment

Scripts:

- `npm run dev`
- `npm run lint`
- `npm run build`
- `npm start`
- `npm run db:migrate` — `prisma migrate deploy`
- `npm run db:seed`

Deployment (Railway):

- Build: `npm run build`
- Start: `npm start`
- Migrations: `npm run db:migrate` перед деплоем кода при наличии новых миграций.

## 16) Non-Goals (Current Version)

Пока не реализовано:

- Online booking / payment.
- Личные кабинеты студий.
- Календарь занятости.
- Пользовательские аккаунты / избранное.
- Ранжирование / рейтинг студий.
- Публичная админка (контент поддерживается через БД / seed / миграции).

## 17) Known Limitations and Operational Notes

- Lint warnings по `no-img-element` остаются (не блокируют build).
- Rate limit store in-memory — не shared между инстансами Railway.
- Контентная актуальность (цены, фото, контакты) — ключевая операционная задача.
- Canonical структура URL студий (`/{locale}/studios/{slug}`) должна оставаться стабильной для SEO.
