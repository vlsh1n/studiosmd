# studiosmd — Technical Specification (Current State)

Документ описывает текущее техническое состояние проекта `studiosmd` по коду в репозитории.

## 0) Назначение документа

- Зафиксировать текущую архитектуру, ограничения и ключевые решения.
- Упростить онбординг и планирование следующих изменений.
- Дать единый источник правды по текущему прод-состоянию.

## 1) Product Scope (актуально)

- Продукт: каталог залов фотостудий в Кишиневе.
- Главная сущность выбора: `Hall` (зал), не `Studio`.
- Поддерживаемые локали: `ru`, `ro`, `en`.
- Основные пользовательские сценарии:
  - Landing на `/` с выбором языка и CTA в каталог.
  - Каталог `/{locale}`: поиск, фильтры, сортировка, пагинация.
  - Страница студии `/{locale}/studios/[id]` с deep-link на конкретный зал.
  - Галерея зала (inline carousel + fullscreen modal).

## 2) Tech Stack

- Framework: `next@16.1.6` (App Router).
- UI runtime: `react@19.2.3`, `react-dom@19.2.3`.
- Язык: TypeScript (`typescript@5`).
- Стили: Tailwind CSS v4.
- Анимации/галерея: `framer-motion`, `embla-carousel-react`.
- Data layer: Prisma + PostgreSQL (`prisma`, `@prisma/client`).

## 3) Scripts и эксплуатационный цикл

### 3.1 NPM scripts

- `npm run dev` — локальный dev сервер.
- `npm run lint` — ESLint.
- `npm run build` — quality gate (`lint`) + production build (`next build`).
- `npm start` — запуск production build.
- `npm run prisma:generate` — Prisma Client generate.
- `npm run db:migrate` — `prisma migrate deploy`.
- `npm run db:seed` — seed данных.

### 3.2 Текущий quality gate

- Build блокируется ошибками lint.
- Warnings lint не блокируют build, но остаются видимыми в CI/локально.

## 4) Routing и App structure

### 4.1 Роуты

- `/` — landing.
- `/[locale]` — каталог.
- `/[locale]/studios/[id]` — страница студии.

### 4.2 Ключевые файлы App Router

- `src/app/layout.tsx` — root layout, установка `<html lang>`.
- `src/app/page.tsx` — landing.
- `src/app/[locale]/layout.tsx` — localized shell (header/switcher/support).
- `src/app/[locale]/page.tsx` — каталог.
- `src/app/[locale]/studios/[id]/page.tsx` — студия.

## 5) i18n и locale resolution

### 5.1 Источник локали

- `middleware.ts` читает первый сегмент path и выставляет `x-locale`.
- `src/app/layout.tsx` читает `x-locale` и задает `<html lang>`.

### 5.2 Локализованные данные

- UI copy: `src/domain/ui-strings.ts`.
- Словари значений: `src/domain/dictionaries.ts`.
- Базовый i18n контракт: `src/i18n/index.ts`.

## 6) Data Model (Prisma)

Файл: `prisma/schema.prisma`.

### 6.1 Enums

- `DistrictKey`: `botanica | ciocana | centru | buiucani | riscani`.
- `Daylight`: `no | yes`.
- `VideoFriendly`: `no | yes`.

### 6.2 Model: Studio

- `id: String @id @default(cuid())`
- `name_i18n: Json`
- `address_i18n: Json`
- `district_key: DistrictKey`
- `cover_images: Json`
- `contacts: Json`
- Relation: `halls: Hall[]`

### 6.3 Model: Hall

- `id: String @id @default(cuid())`
- `studioId: String` (FK на `Studio`)
- `name_i18n: Json`
- `images: Json`
- `area_sqm: Int?`
- `weekend_price: Int?`
- `daylight: Daylight`
- `video_friendly: VideoFriendly`
- `props_available: Boolean`
- `flash_available: Boolean`
- `continuous_available: Boolean`
- `tags: String[]`
- `price_per_hour: Int`

### 6.4 Индексы для каталога

Миграция: `prisma/migrations/20260208173000_add_catalog_indexes/migration.sql`.

- `Hall(price_per_hour)`
- `Hall(studioId)`
- `Studio(district_key)`
- `Hall(tags)` через GIN

## 7) Query Layer (`src/db/queries.ts`)

### 7.1 `listHalls(params)`

Поддерживаемые параметры:

- `locale`
- `q?`
- `district_keys?`
- `tags?`
- `sort?: price_asc | price_desc`
- `take?`
- `skip?`

Поведение:

- Фильтр по тегам: `hasEvery` (AND semantics).
- Фильтр по районам: через relation на `studio.district_key`.
- Поиск: JSON path по локализованным `name_i18n` для hall/studio.
- Order: `price_per_hour`, затем `id` (стабильный порядок).
- Возврат: hall + локализованные `name/address` в map-phase.

### 7.2 `getStudioById(id, locale)`

- `findUnique` по id с include halls.
- Сортировка halls по `price_per_hour asc`.
- Локализация `name/address` для studio и `name` для halls.

## 8) Catalog page (`src/app/[locale]/page.tsx`)

### 8.1 Query contract

- `q` — search query (ограничена до 80 символов).
- `districts` — CSV или multiple params.
- `tags` — CSV или multiple params.
- `sort` — `random | price_asc | price_desc`.
- `page` — номер страницы (>=1).

### 8.2 Pagination

- `PAGE_SIZE = 12`.
- В запрос уходит `take = PAGE_SIZE + 1` для вычисления `hasNext`.
- `skip = (page - 1) * PAGE_SIZE`.
- UI: две кнопки `Previous/Next` с сохранением остальных query params.

### 8.3 Sorting

- `price_asc` / `price_desc` — через БД.
- `random` — перемешивание на сервере в памяти после выборки страницы.

### 8.4 Data hygiene (images)

- Для images используется `safeExternalUrl`.
- Невалидные URL отбрасываются.

## 9) Studio page (`src/app/[locale]/studios/[id]/page.tsx`)

- Проверка локали (`isLocale`) и наличия студии (`notFound`).
- Контакты:
  - телефон: `tel:` после базовой sanitize-функции;
  - instagram: пропускается через `safeExternalUrl`.
- Cover image: берется первый валидный URL.
- Hall images: фильтрация через `safeExternalUrl`.
- Deep-link фокус: `src/components/HallFocus.tsx`.

## 10) Hall Gallery (`src/app/[locale]/studios/[id]/HallGalleryZoom.tsx`)

- Wrapper возвращает `null`, если `images.length === 0`.
- Контент-компонент держит hooks без условных вызовов.
- Inline: Embla carousel + arrows + counter.
- Modal: `createPortal`, `AnimatePresence`, keyboard nav (`Esc`, arrows), body scroll lock.
- Учитывается reduced motion.

## 11) URL Safety Layer

Файл: `src/lib/url.ts`.

`safeExternalUrl(value)`:

- принимает только непустые строки;
- парсит через `new URL(...)`;
- разрешает только `http:` и `https:`;
- возвращает `null` для всего остального.

Использование:

- `NEXT_PUBLIC_KOFI_URL`
- `studio.contacts.instagram`
- gallery/cover URLs в каталоге и странице студии

## 12) UI Foundation

Файл: `src/app/globals.css`.

- Семантические классы: `.page`, `.panel`, `.card`, `.pill`, `.btn`, `.btn-primary`, `.input`, `.select`, `.muted`, `.stack`.
- Визуальная модель: мягкий glass-like стиль, rounded surfaces, спокойные тени.
- Fallback для окружений без `backdrop-filter`.

## 13) Seed Data

Файл: `prisma/seed.ts`.

- Заполняет 5 студий и 10 залов.
- Использует текущие enum/поля схемы.
- Контакты: `phone`, `instagram`.
- Перед записью чистит таблицы `Hall` и `Studio`.

## 14) Environment и Deployment

### 14.1 Переменные окружения

- `DATABASE_URL` — обязательно.
- `NEXT_PUBLIC_SITE_URL` — опционально.
- `NEXT_PUBLIC_KOFI_URL` — опционально.

### 14.2 Railway

- Build command: `npm run build`.
- Start command: `npm start`.
- Миграции: `npm run db:migrate`.
- Seed: вручную при необходимости.

## 15) Known limitations и техдолг

- В lint остаются предупреждения `@next/next/no-img-element` для `<img>` в галерее/cover.
- В `src/db/prisma.ts` есть лишний eslint-disable комментарий (`no-var`).

### 15.1 Риски и точки роста (логический блок)

1. `[Средний]` `random` реализован перемешиванием в памяти после запроса (`src/app/[locale]/page.tsx:49`, `src/app/[locale]/page.tsx:100`). Это нестабильно и плохо масштабируется.
Простой фикс: убрать `random` как default, либо делать random в БД с лимитом и детерминированным seed.

2. `[Средний]` Сильная связка `middleware -> header -> <html lang>` (`middleware.ts:12`, `src/app/layout.tsx:15`, `src/app/layout.tsx:16`). Работает, но создает скрытую связность и лишнюю динамику root layout.
Простой фикс: держать root-layout максимально статичным, локаль/SEO в `[locale]-layout`, middleware использовать только там, где реально нужно.

3. `[Средний]` Модель Prisma использует много “свободных” полей (`Json`/`String[]`: `prisma/schema.prisma:36`, `prisma/schema.prisma:39`, `prisma/schema.prisma:40`, `prisma/schema.prisma:56`). Это гибко, но хуже для контроля качества данных и будущей эволюции схемы.
Простой фикс: поэтапно типизировать критичные поля (сначала централизованная валидация входа, потом нормализация модели).

4. `[Низкий]` Риск расхождения документации и кода (исторически уже встречался).
Простой фикс: синхронно обновлять README/techspec в каждом инфраструктурном PR и добавить CI-проверку на актуальность ключевых секций документации.

## 16) Change Protocol

- PLAN -> подтверждение `ОК` -> IMPLEMENT.
- После изменений:
  1) `npm run build`
  2) отчёт (`git diff --stat`, ключевые hunks, build tail)
  3) один commit на задачу.
