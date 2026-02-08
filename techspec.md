# studiosmd — Technical Specification (Current State)

Документ фиксирует фактическое состояние репозитория `studiosmd`.

## 0) TL;DR

- Продукт: каталог залов фотостудий Кишинева, основной объект выбора — `Hall`.
- Стек: Next.js 16 App Router + TypeScript + Tailwind v4 + Prisma/PostgreSQL.
- Локали в URL: `ru`, `ro`, `en`.
- Главные сценарии:
  - каталог `/{locale}` с фильтрами/поиском/сортировкой/пагинацией;
  - страница студии `/{locale}/studios/[id]` с deep-link на зал;
  - галерея зала (inline + fullscreen).

## 1) Стек и зависимости

- `next@16.1.6`
- `react@19.2.3`, `react-dom@19.2.3`
- `typescript@5`
- `tailwindcss@4`
- `prisma@6.19.2`, `@prisma/client@6.19.2`
- `framer-motion@12.33.0`
- `embla-carousel-react@8.6.0`

### Scripts

- `npm run dev`
- `npm run lint`
- `npm run build` (`lint` -> `next build`)
- `npm start`
- `npm run prisma:generate`
- `npm run db:migrate`
- `npm run db:seed`

## 2) Роутинг

- `/` — landing (выбор языка + CTA)
- `/[locale]` — каталог залов
- `/[locale]/studios/[id]` — страница студии

## 3) i18n и locale resolution

- Поддерживаемые локали: `ru`, `ro`, `en` (`src/i18n/index.ts`).
- `middleware.ts` берет первый сегмент URL и ставит `x-locale` header.
- `src/app/layout.tsx` читает `x-locale` для `<html lang="...">`.
- UI-строки: `src/domain/ui-strings.ts`.
- Словари районов/тегов: `src/domain/dictionaries.ts`.

## 4) Модель данных (Prisma)

Файл: `prisma/schema.prisma`.

### Enums

- `DistrictKey`: `botanica | ciocana | centru | buiucani | riscani`
- `Daylight`: `no | yes`
- `VideoFriendly`: `no | yes`

### Studio

- `id`, `name_i18n`, `address_i18n`, `district_key`, `cover_images`, `contacts`
- relation: `halls[]`

### Hall

- `id`, `studioId`, `name_i18n`, `images`
- `area_sqm?`, `weekend_price?`, `price_per_hour`
- `daylight`, `video_friendly`
- `props_available`, `flash_available`, `continuous_available`
- `tags: String[]`

### Индексы (актуальные миграции)

- индекс по `Hall.price_per_hour`
- индекс по `Hall.studioId`
- индекс по `Studio.district_key`
- GIN индекс по `Hall.tags`

## 5) Data layer (`src/db/queries.ts`)

### `listHalls(params)`

- Фильтр по тегам: `hasEvery` (AND)
- Фильтр по районам: `studio.district_key in [...]`
- Поиск: JSON-path по локализованным `hall.name_i18n[locale]` и `studio.name_i18n[locale]`
- Сортировка: `price_asc` / `price_desc`
- Пагинация: `take` + `skip`
- Стабилизация order: `price_per_hour`, затем `id`

### `getStudioById(id, locale)`

- Загружает студию и залы
- Сортирует залы по `price_per_hour asc`
- Локализует `name` / `address`

## 6) Каталог `/{locale}`

Файлы: `src/app/[locale]/page.tsx`, `src/app/[locale]/HallCardList.client.tsx`.

### Query params

- `q` (ограничен до 80 символов)
- `districts` (CSV/multi)
- `tags` (CSV/multi)
- `sort`: `random | price_asc | price_desc`
- `page`

### Поведение

- Карточки рендерятся клиентским компонентом с Framer Motion.
- Deep-link CTA: `/{locale}/studios/{studioId}?hallId={hallId}#hall-{hallId}`.
- Пагинация на уровне каталога: `PAGE_SIZE = 12`, кнопки Previous/Next.

## 7) Страница студии `/{locale}/studios/[id]`

Файлы: `src/app/[locale]/studios/[id]/page.tsx`, `src/app/[locale]/studios/[id]/HallCardList.client.tsx`.

- Верхний блок: название, район, адрес, телефон, Instagram.
- Cover: рендерится первый валидный URL из `cover_images`.
- Список залов: single-column, у каждой карточки галерея + факт-блок + теги.
- Deep-link фокус на зал: `src/components/HallFocus.tsx`.

## 8) Галерея зала

Файл: `src/app/[locale]/studios/[id]/HallGalleryZoom.tsx`.

- Inline carousel: Embla (`loop: false`).
- Fullscreen modal: Framer Motion + `createPortal`.
- UX: `Esc`, `ArrowLeft/ArrowRight`, overlay click to close, body scroll lock.
- Hooks-порядок стабилизирован (без conditional hook calls).

## 9) URL hygiene

Файл: `src/lib/url.ts`.

- `safeExternalUrl(value)` принимает только `http/https` URL.
- Применяется для:
  - `NEXT_PUBLIC_KOFI_URL`;
  - `studio.contacts.instagram`;
  - изображений в каталоге/на странице студии.

## 10) UI foundation

Файл: `src/app/globals.css`.

- Семантические классы: `.page`, `.panel`, `.card`, `.pill`, `.btn`, `.btn-primary`, `.input`, `.select`, `.muted`, `.stack`.
- Liquid-glass tokens + fallback для окружений без `backdrop-filter`.

## 11) Seed

Файл: `prisma/seed.ts`.

- 5 студий / 10 залов.
- `contacts` содержит `phone` и `instagram`.
- Для залов используются поля текущей схемы (без удаленных legacy-полей).

## 12) Известные ограничения

- В lint остаются предупреждения `@next/next/no-img-element` в галерее/cover.
- В `src/db/prisma.ts` есть предупреждение про лишний eslint-disable-комментарий.

## 13) Рабочий протокол изменений

- PLAN -> подтверждение `ОК` -> IMPLEMENT.
- После изменений:
  1) `npm run build`
  2) отчёт (`git diff --stat`, ключевые hunks, build tail)
  3) один commit на задачу.
