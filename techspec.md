# studiosmd — Technical Specification (Current State)

Этот документ фиксирует фактическое состояние проекта **studiosmd** на уровне кода. Он описывает то, что реально реализовано в репозитории на сегодня.

---

## 0) TL;DR архитектуры

- **Next.js App Router + TypeScript + Tailwind CSS (v4)**.
- **Prisma ORM + PostgreSQL**.
- **Мультиязычный роутинг**: locale — первый сегмент URL: `/ru`, `/ro`, `/en`.
- **Каталог работает по Hall**, районы берутся из **Studio**.
- **Deep‑link в студию на конкретный зал**: `?hallId=...#hall-...` + авто‑scroll + подсветка.
- **Фильтр tags = AND (hasEvery)**.
- **MVP‑поля Hall добавлены**: `minimum_hours`, `weekend_price`, `daylight`, `video_friendly`.
- **SEO metadata локализована** в `src/app/[locale]/layout.tsx` через `generateMetadata`.
- **Root html lang** сейчас фиксирован на `ru` (без динамики).
- **UI foundation**: milky‑тема, noise overlay, семантические классы (`.page/.panel/.card/.pill/.btn/.input/.muted/.stack`), focus‑visible outline.
- **Locale layout shell**: `.page` + `.panel`, header с `LocaleSwitcher` в pill‑обёртке.

---

## 1) Стек и окружение

### 1.1 Стек (текущий)
- Next.js App Router + TypeScript + Tailwind CSS 4.
- Prisma + PostgreSQL.

### 1.2 Переменные окружения
- `.env` локальный (игнорируется).
- `.env.example` в репозитории.
- Обязательная переменная: `DATABASE_URL`.
- Опционально: `NEXT_PUBLIC_SITE_URL`.

### 1.3 Команды (актуальные)
- `npm run dev`
- `npm run build`
- `npm start`
- `npm run prisma:generate`
- `npm run db:migrate` (migrate deploy)
- `npm run db:seed`
- `npx prisma migrate dev` (локальная разработка)

---

## 2) Роутинг, i18n и локализованный контент

### 2.1 URL‑структура
- `/` → редирект на `/ru`.
- `/[locale]/` — каталог залов.
- `/[locale]/studios/[id]` — страница студии.

Locales: `ru`, `ro`, `en`.

### 2.2 Где лежат словари
- Базовые словари: `src/i18n/{ru,ro,en}.ts`.
- Реэкспорт и функции: `src/i18n/index.ts` (`t`, `isLocale`, `locales`).
- UI строки: `src/domain/ui-strings.ts` (`UI_STRINGS[key][locale]`).

### 2.3 Что переводится сейчас
- UI‑строки для каталога/студии и facts‑лейблов (min/weekend/daylight/video).
- Контент из БД (`name_i18n`, `address_i18n`) разворачивается в `hall.name`, `studio.name`, `studio.address`.

### 2.4 App Router params/searchParams (важно для dev)
- В server components для страниц `params` и `searchParams` приходят как `Promise`.
- Доступ должен быть через `await` (`const { locale } = await params;`, `const query = (await searchParams) ?? {};`) иначе в dev будет warning `sync-dynamic-apis`.

### 2.5 Layout shell (UI)
- `src/app/[locale]/layout.tsx` использует `.page` + `.panel`.
- Header внутри панели: слева название, справа `LocaleSwitcher` в `.pill`.

---

## 3) Модель данных (Prisma / Postgres)

### 3.1 Сущности
1) **Studio**
2) **Hall**

Одна студия → несколько залов.

### 3.2 Enums
- `DistrictKey`: `botanica`, `ciocana`, `centru`, `buiucani`, `riscani`
- `Daylight`: `no`, `limited`, `yes`
- `VideoFriendly`: `no`, `limited`, `yes`

### 3.3 Studio — поля
- `id` (String, `cuid()`)
- `name_i18n` (Json)
- `address_i18n` (Json)
- `district_key` (enum DistrictKey)
- `cover_images` (Json — массив URL)
- `contacts` (Json)
- relation: `halls` (Hall[])

### 3.4 Hall — поля
- `id`
- `studioId` (FK)
- `name_i18n` (Json)
- `images` (Json — массив URL)
- `size_m2` (Int?)
- `minimum_hours` (Int, default 1)
- `weekend_price` (Int?)
- `daylight` (Daylight, default no)
- `video_friendly` (VideoFriendly, default no)
- `tags` (String[])
- `price_per_hour` (Int)

---

## 4) Seed и словари

### 4.1 Seed (факт)
Seed создаёт:
- 5 студий (по одному `district_key`)
- 2 зала на студию (всего 10 залов)
- RU/RO/EN для `name_i18n`, адреса в `address_i18n`
- разнообразные `tags`, `price_per_hour`, `minimum_hours`, `weekend_price`, `daylight`, `video_friendly`

Команда: `npm run db:seed` / `npx prisma db seed`.

### 4.2 Словари ключей
Файл: `src/domain/dictionaries.ts`
- `DISTRICTS` (district_key → {ru, ro, en})
- `TAGS` (tag_key → {ru, ro, en})

Ключи TAGS (текущий набор):
`bright, dark, loft, minimal, interior, cyclorama, video, catalog, portrait, daylight, big, small`

---

## 5) Слой данных (Prisma Client + queries)

### 5.1 Prisma singleton
Файл: `src/db/prisma.ts`

### 5.2 Запросы
Файл: `src/db/queries.ts`
- `listHalls({ locale, q, district_keys, tags, price_min, price_max })`
- `getStudioById(id, locale)`

`listHalls` делает выборку всех полей Hall (select не ограничен), `studio` подтягивается через include/select.

---

## 6) Фильтрация и поиск (серверно, по query string)

### 6.1 Параметры
- `q`
- `districts` (множественный, CSV)
- `tags` (множественный, CSV)
- `priceMin`, `priceMax`

### 6.2 Реализованные фильтры
- District: `studio.district_key IN [...]`
- Price range: `price_per_hour` между `priceMin` и `priceMax`
- Tags: **AND логика** (`hasEvery`)

### 6.3 Поиск `q`
JS‑фильтрация по локализованным названиям (`hall`/`studio`) после выборки из БД.

---

## 7) Каталог: карточка и переходы

### 7.1 Карточка результата (Hall card)
Показывается:
- изображение (hall image или cover студии)
- hall name (ссылка)
- studio name (текст) + district
- цена за час
- facts‑блок: `min`, `weekend` (если задан), `daylight`, `video` + символы ✓/~ /—
- список tag chips (стилизованы как `.pill`)
- карточка оформлена как `.card` с `stack`‑отступами

### 7.2 Переход на студию (deep‑link)
Ссылка с hall name ведёт на:
`/[locale]/studios/[studioId]?hallId=<hallId>#hall-<hallId>`

На странице студии есть авто‑scroll и подсветка через `HallFocus`.

---

## 8) Страница студии: блоки

- Header: name + address + district
- Contacts: телефон / Instagram / Telegram (если есть)
- Галерея cover images (если есть)
- Секция залов:
  - `<article id="hall-<id>">`
  - name, price
  - facts‑блок (min/weekend/daylight/video)
  - изображения, теги (теги как `.pill`)
  - карточки залов оформлены как `.card` с `stack`‑отступами

---

## 9) Компоненты

- `src/components/LocaleSwitcher.tsx`
- `src/components/HallFocus.tsx` (client component: читает `hallId` из query, scroll + highlight)

---

## 10) Структура проекта (факт)

```
src/
  app/
    layout.tsx
    [locale]/
      layout.tsx
      page.tsx
      studios/
        [id]/
          page.tsx
  components/
    LocaleSwitcher.tsx
    HallFocus.tsx
  i18n/
    {ru,ro,en}.ts
    index.ts
  domain/
    dictionaries.ts
    ui-strings.ts
  db/
    prisma.ts
    queries.ts
prisma/
  schema.prisma
  seed.ts
README.md
.env.example
```

---

## 11) Форматирование цен и фактов

- Цена за час: `{hall.price_per_hour} {UI_STRINGS.per_hour[locale]}`
- Facts‑лейблы локализованы через `UI_STRINGS`.

### 11.1 UI foundation (globals.css)
- Токены и семантические классы в `src/app/globals.css`: `.page/.panel/.card/.pill/.btn/.input/.muted/.stack`.
- Noise overlay через `body::before`.
- Focus‑visible оформлен через `outline` + `outline-offset`.
- Защита от mobile overflow: `max-width/min-width` на `.page/.panel/.card` и `max-width` для media.

---

## 12) SEO

- `src/app/layout.tsx` содержит статическое `metadata`.
- `src/app/[locale]/layout.tsx` использует `generateMetadata` с локализованными title/description.
- `<html lang>` в root layout сейчас фиксирован на `ru`.

---

## 13) Деплой

В `README.md` есть инструкции:
- переменные окружения (`DATABASE_URL`, optional `NEXT_PUBLIC_SITE_URL`)
- команды build/start
- migrate deploy + optional seed

---

## 14) Definition of Done (факт)

1) `npm run dev` — стартует.
2) `/` редиректит на `/ru`.
3) `npm run build` — проходит.
4) `npm run db:seed` — заполняет БД, 5 студий и 10 залов.
5) Каталог работает с фильтрами `q`, `districts`, `tags`, `priceMin/priceMax`.
6) Deep‑link на зал работает (scroll + highlight).

---

## 15) Оставшиеся gaps

- Нет size‑фильтров (`sizeMin/sizeMax`).
- Нет фильтров по `daylight`/`video_friendly`/`minimum_hours`.
- Поиск `q` — не SQL‑поиск (JS‑фильтрация).
- `<html lang>` не привязан к текущей локали (фиксирован `ru`).
- Нет админки.
