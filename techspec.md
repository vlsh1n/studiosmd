# studiosmd — Technical Specification (Current State)

Документ фиксирует фактическое состояние репозитория `studiosmd` на текущий момент.

## 0) TL;DR

- Продукт: каталог залов фотостудий Кишинева, основной объект выбора — `Hall` (зал), а не `Studio`.
- Стек: Next.js 16 App Router + TypeScript + Tailwind v4 + Prisma/PostgreSQL.
- Локали в URL: `ru`, `ro`, `en`.
- Каталог: поиск + фильтры + карточки залов, deep-link на конкретный зал студии.
- Страница студии: шапка студии, один cover, список залов, inline-карусель + fullscreen gallery.
- Есть минимальная админка `/admin` c `ADMIN_TOKEN` и server actions (создание studio/hall).

## 1) Актуальный стек и зависимости

- `next@16.1.6`
- `react@19.2.3`, `react-dom@19.2.3`
- `typescript@5`
- `tailwindcss@4`
- `prisma@6.19.2`, `@prisma/client@6.19.2`
- `framer-motion@12.33.0`
- `embla-carousel-react@8.6.0`
- `react-medium-image-zoom@5.4.0` (legacy dependency; в текущем UI не используется напрямую, но CSS импортируется в `globals.css`)

### Scripts

- `npm run dev`
- `npm run build`
- `npm start`
- `npm run prisma:generate`
- `npm run db:migrate`
- `npm run db:seed`

## 2) Роутинг и страницы

- `/` — landing (клиентский выбор языка RU/RO/EN + CTA в `/{locale}`)
- `/[locale]` — каталог залов
- `/[locale]/studios/[id]` — страница студии
- `/admin` — минимальная админка (без locale)

## 3) i18n и middleware

- Поддерживаемые локали: `ru`, `ro`, `en` (`src/i18n/index.ts`).
- `middleware.ts` читает первый сегмент URL и выставляет header `x-locale`.
- `src/app/layout.tsx` использует `x-locale` для `<html lang="...">`.
- Локализованные строки UI — `src/domain/ui-strings.ts`.
- Локализованные словари районов/тегов — `src/domain/dictionaries.ts`.

## 4) Модель данных (Prisma)

### Enums

- `DistrictKey`: `botanica | ciocana | centru | buiucani | riscani`
- `Daylight`: `no | limited | yes`
- `VideoFriendly`: `no | limited | yes`

### Studio

- `id`, `name_i18n`, `address_i18n`, `district_key`, `cover_images`, `contacts`
- relation: `halls[]`

### Hall

- `id`, `studioId`, `name_i18n`, `images`
- `size_m2?`, `area_sqm?`
- `minimum_hours` (default 1) — в UI не показывается и из админки не редактируется
- `weekend_price?`, `price_per_hour`
- `daylight`, `video_friendly`
- `props_available`, `equipment_available`
- `flash_available`, `continuous_available`
- `tags: String[]`

### Миграции

- `20260129201848_init`
- `20260130172656_hall_mvp_fields`
- `20260205191056_hall_mvp_facts`
- `20260206182000_day5_hall_light_flags`

## 5) Data layer (`src/db/queries.ts`)

### `listHalls(params)`

- Фильтр по тегам: `hasEvery` (AND)
- Фильтр по районам: `studio.district_key in [...]`
- Сортировка: только `price_asc` / `price_desc` в запросе
- Поиск `q`: post-filter по локализованным `hall.name` и `studio.name`

### `getStudioById(id, locale)`

- Загружает студию и залы
- Сортирует залы по `price_per_hour asc`
- Локализует `name`/`address`

## 6) Каталог `/{locale}`

Файл: `src/app/[locale]/page.tsx` + `src/app/[locale]/HallCardList.client.tsx`

### Query params

- `q`
- `districts` (CSV/multi)
- `tags` (CSV/multi)
- `sort`: `random | price_asc | price_desc`

### Поведение

- `random` реализован перемешиванием массива на серверной странице
- Карточки рендерятся клиентским компонентом с Framer Motion
- Deep-link CTA: `/{locale}/studios/{studioId}?hallId={hallId}#hall-{hallId}`

### Layout карточек каталога

- Список: single-column, `max-w-5xl mx-auto`
- Mobile: фото сверху, инфо снизу
- `lg+`: split layout (`visual` слева, компактный инфо-блок справа)
- Фото: нормализованная композиция через `aspect-[4/3] sm:aspect-[16/10]`, `object-cover`
- Факты: 2 колонки, `✅/❌` выравниваются вправо
- Теги: `inline-flex flex-wrap gap-2`
- CTA внизу инфо-блока (`mt-auto`)

## 7) Страница студии `/{locale}/studios/[id]`

Файл: `src/app/[locale]/studios/[id]/page.tsx`

### Верхний блок студии

- Название, район, адрес
- Контакты: только телефон (`tel:` с минимальной санитизацией) и кнопка `Instagram`
- Показывается только `cover_images[0]`; если его нет — блок не рендерится

### Список залов

Файл: `src/app/[locale]/studios/[id]/HallCardList.client.tsx`

- Single-column список (`max-w-5xl mx-auto`)
- Карточка:
  - Mobile: вертикально
  - `lg+`: визуал слева + узкий инфо-блок справа (`16rem`)
  - Правый инфо-блок сделан `lg:sticky lg:top-4`
- Факты: 2-колоночная сетка label/status
- Теги: compact pills
- CTA: `/{locale}/studios/{studioId}?hallId={hallId}`

### Deep-link и подсветка

Файл: `src/components/HallFocus.tsx`

- Читает `hallId` из query
- Скроллит к `#hall-{id}`
- Временно добавляет ring-highlight, затем снимает

## 8) Галерея зала

Файл: `src/app/[locale]/studios/[id]/HallGalleryZoom.tsx`

### Inline preview

- Embla carousel (`embla-carousel-react`)
- `viewport`: `w-full touch-pan-y overflow-hidden rounded`
- `slide`: `flex-none w-full`
- 1 фото = 1 слайд
- Aspect ratio: `aspect-[4/3] sm:aspect-[16/10]`
- Desktop arrows + counter

### Fullscreen modal

- Framer Motion overlay (fade) + modal (fade/scale)
- Один `motion.img` для `modalIndex` (crossfade через `key={modalIndex}`)
- UX:
  - `Esc` закрыть
  - `ArrowLeft/ArrowRight` листать
  - клик по overlay закрывает
  - клик внутри останавливает propagation
  - lock scroll body при открытом modal
- `prefers-reduced-motion` учитывается

## 9) Админка `/admin`

Файлы: `src/app/admin/page.tsx`, `src/app/admin/actions.ts`

### Доступ

- Только по query token: `/admin?token=...`
- Проверка в page + повторная проверка в actions
- Если `ADMIN_TOKEN` не задан или не совпадает -> `Access denied`

### Функции

- Create Studio:
  - `name_i18n` (ru/ro/en)
  - `address_i18n` (ru/ro/en)
  - `district_key`
  - `cover_images` (URL per line)
  - `contacts.phone`, `contacts.instagram`
- Create Hall:
  - `studio_id`
  - `name_i18n` (ru/ro/en)
  - `images` (URL per line)
  - `price_per_hour` (>0 обязательно)
  - `weekend_price` optional
  - `daylight` yes/no
  - `video_friendly` yes/no
  - `props_available`, `flash_available`, `continuous_available`
  - `tags` через чекбоксы только из `TAGS`

### Валидация/поведение

- URL-листы фильтруются по `^https?://`
- Теги фильтруются allowed-set + dedupe
- После submit redirect обратно в `/admin?token=...&ok=...` / `&error=price`

## 10) Стили и UI foundation

Файл: `src/app/globals.css`

- Семантические классы: `.page`, `.panel`, `.card`, `.pill`, `.btn`, `.btn-primary`, `.input`, `.select`, `.muted`, `.stack`
- Liquid Glass baseline:
  - glass tokens (`--glass-*`), blur/saturate, soft border/shadow
  - fallback для окружений без `backdrop-filter`
- Системный font stack (`--font-sans`, `--font-mono`) без `next/font/google`
- Важно: hover/active glass-эффект ограничен на `.btn:not(.btn-primary)`, чтобы не терять контраст на `.btn-primary`

## 11) Словари и seed

### TAGS (`src/domain/dictionaries.ts`)

- Сейчас 28 тегов (включая расширение релизного словаря и дополнительные ключи)
- Новые ключи присутствуют: `sunny_morning`, `sunny_evening`, `colored_walls`, `texture_walls`, `small`, `spacious`, `high_ceiling`, `easy_access`, `changing_room`, `shower`

### Seed (`prisma/seed.ts`)

- 5 студий, 10 залов
- В tags используются только ключи из `TAGS`
- Добавлены size/rare теги в соответствии с последними правками
- `limited` из seed для `daylight/video_friendly` удален (остались `yes/no`)

## 12) Что считается MVP scope сейчас

В MVP реализовано:

- Локализованный каталог с фильтрами и сортировкой
- Карточки залов с standardized facts
- Страница студии с deep-link focus на зал
- Галерея зала (inline + fullscreen)
- Базовая админка создания Studio/Hall

Вне MVP/частично:

- Бронирование/оплаты/календарь
- Публичная авторизация пользователей
- Тесты (unit/integration/e2e)
- Полный административный CRUD (edit/delete)

## 13) Тонкие места и риски

- `Daylight` / `VideoFriendly` в Prisma всё ещё содержат `limited`, но UI трактует `limited` как `❌`.
- `minimum_hours` и `equipment_available` остаются в схеме, но исключены из текущего UI-потока.
- `react-medium-image-zoom` остаётся зависимостью и CSS-импортом, хотя основной gallery flow уже на Embla + Framer Motion.
- Админка защищена query-token без полноценной auth-сессии (достаточно для MVP, но не для high-security).

## 14) Рабочий протокол изменений (текущий процесс команды)

- PLAN phase -> подтверждение `ОК` -> IMPLEMENT
- После изменений всегда:
  1) `npm run build`
  2) отчёт (`git diff --stat`, ключевые hunks, build tail)
  3) один commit на задачу

