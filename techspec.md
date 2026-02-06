# studiosmd — Technical Specification (Current State)

Документ фиксирует фактическое состояние репозитория **studiosmd** на сегодня.
Актуализация выполнена по коду и текущим скриптам проекта.

---

## 0) TL;DR

- Стек: **Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + Prisma + PostgreSQL**.
- Локали в URL: `ru`, `ro`, `en`.
- Каталог работает на сущности **Hall** (залы), с привязкой к **Studio**.
- Фильтры каталога: `q`, `districts`, `tags`, `sort`.
- `tags` фильтруются по логике **AND** (`hasEvery`).
- Сортировка: `random` (перемешивание на странице), `price_asc`, `price_desc`.
- Deep-link на конкретный зал реализован: `?hallId=...#hall-...` + авто-scroll + временная подсветка.
- Lightbox для галереи залов реализован через `react-medium-image-zoom`.
- Корневой `<html lang>` динамический: значение приходит из middleware через `x-locale`.
- Проект уже задеплоен на **Railway** (операционный факт), деплой-процедура отражена в README.

---

## 1) Stack и окружение

### 1.1 Технологии
- `next@16.1.6`
- `react@19.2.3`, `react-dom@19.2.3`
- `@prisma/client@6.19.2`, `prisma@6.19.2`
- `tailwindcss@4`
- Доп. UI-зависимость: `react-medium-image-zoom`

### 1.2 Переменные окружения
Файл `.env.example`:
- `DATABASE_URL` (required)
- `NEXT_PUBLIC_SITE_URL` (optional)
- `NEXT_PUBLIC_KOFI_URL` (optional)

### 1.3 Команды
- `npm run dev`
- `npm run build`
- `npm start`
- `npm run prisma:generate`
- `npm run db:migrate` (`prisma migrate deploy`)
- `npm run db:seed`

---

## 2) Роутинг, i18n, metadata

### 2.1 Роуты
- `/` — landing с hero, language pills и CTA.
- `/[locale]` — каталог залов.
- `/[locale]/studios/[id]` — страница студии.

Поддерживаемые локали: `ru`, `ro`, `en`.

### 2.2 Middleware и язык документа
- `middleware.ts` читает первый сегмент пути.
- Устанавливает request header `x-locale` (`ru` по умолчанию).
- `src/app/layout.tsx` читает `x-locale` через `headers()` и ставит `<html lang={lang}>`.

### 2.3 Локализация контента
- Базовые словари: `src/i18n/ru.ts`, `src/i18n/ro.ts`, `src/i18n/en.ts`.
- Общие UI строки: `src/domain/ui-strings.ts`.
- Словари районов/тегов: `src/domain/dictionaries.ts`.
- Поля из БД `name_i18n` / `address_i18n` разворачиваются в `src/db/queries.ts`.

### 2.4 SEO
- `src/app/layout.tsx`: базовый `metadata`.
- `src/app/[locale]/layout.tsx`: локализованный `generateMetadata`.

---

## 3) Модель данных (Prisma / Postgres)

### 3.1 Сущности
- `Studio`
- `Hall`

Связь: `Studio 1 -> N Hall`.

### 3.2 Enums
- `DistrictKey`: `botanica | ciocana | centru | buiucani | riscani`
- `Daylight`: `no | limited | yes`
- `VideoFriendly`: `no | limited | yes`

### 3.3 Studio
- `id` (`cuid`)
- `name_i18n` (Json)
- `address_i18n` (Json)
- `district_key` (enum)
- `cover_images` (Json)
- `contacts` (Json)
- `halls` (relation)

### 3.4 Hall
- `id` (`cuid`)
- `studioId` (FK)
- `name_i18n` (Json)
- `images` (Json)
- `size_m2` (Int?)
- `area_sqm` (Int?)
- `minimum_hours` (Int, default 1)
- `weekend_price` (Int?)
- `daylight` (Daylight, default `no`)
- `video_friendly` (VideoFriendly, default `no`)
- `props_available` (Boolean, default `false`)
- `equipment_available` (Boolean, default `false`)
- `tags` (String[])
- `price_per_hour` (Int)

### 3.5 Миграции в репозитории
- `20260129201848_init`
- `20260130172656_hall_mvp_fields`
- `20260205191056_hall_mvp_facts`

---

## 4) Seed-данные

`prisma/seed.ts`:
- очищает `Hall` и `Studio` перед заполнением;
- создаёт 5 студий;
- создаёт по 2 зала на студию (итого 10 залов);
- заполняет i18n-поля (`ru/ro/en`), контакты, теги, цены и hall-facts (`area_sqm`, `minimum_hours`, `weekend_price`, `daylight`, `video_friendly`, `props_available`, `equipment_available`).

Запуск: `npm run db:seed`.

---

## 5) Data layer

Файл: `src/db/queries.ts`

### 5.1 listHalls
Сигнатура:
- `listHalls({ locale, q, district_keys, tags, sort })`

Поведение:
- фильтр по тегам: `hasEvery` (AND);
- фильтр по районам: `studio.district_key in [...]`;
- сортировка в БД: по `price_per_hour` (`asc`/`desc`);
- `q` применяется post-query по `hall.name` и `studio.name` (уже локализованным);
- возвращает hall + локализованные `name`, `studio.name`, `studio.address`.

### 5.2 getStudioById
- загружает студию и её залы;
- сортирует залы по цене (`price_per_hour asc`);
- локализует `name` и `address`.

---

## 6) Каталог (`/[locale]`)

### 6.1 Query params
- `q`
- `districts` (CSV / multiple)
- `tags` (CSV / multiple)
- `sort` (`random | price_asc | price_desc`)

### 6.2 UI и поведение
- форма фильтров в `.card`;
- секция тегов в `<details>` с отображением выбранных;
- сортировка вынесена в `<select>`;
- `random` реализован перемешиванием массива на странице (`shuffleArray`);
- карточки залов показывают:
  - изображение;
  - имя зала (ссылка на deep-link);
  - имя студии + район;
  - цену в час;
  - факты: `area_sqm` (если есть), `minimum_hours`, `weekend_price` (если есть), `daylight`, `video_friendly`;
  - теги;
  - CTA `view_hall_cta`.

### 6.3 Deep-link
Ссылка на зал:
- `/{locale}/studios/{studioId}?hallId={hallId}#hall-{hallId}`

---

## 7) Страница студии (`/[locale]/studios/[id]`)

- Заголовок: название, адрес, район.
- Контакты: phone / instagram / telegram (если присутствуют).
- Галерея обложек студии.
- Список залов (`article#hall-{id}`) с:
  - ценой;
  - фактами (включая `area_sqm`, `props_available`, `equipment_available`, daylight/video);
  - галереей фото зала c zoom/lightbox;
  - тегами.
- Подсветка и прокрутка до зала выполняется клиентским `HallFocus`.

---

## 8) Компоненты

- `src/components/LocaleSwitcher.tsx`
- `src/components/HallFocus.tsx`
- `src/app/[locale]/studios/[id]/HallGalleryZoom.tsx`

---

## 9) Стили и UI foundation

Файл: `src/app/globals.css`

- Семантические классы: `.page`, `.panel`, `.card`, `.pill`, `.btn`, `.btn-primary`, `.input`, `.select`, `.muted`, `.stack`.
- Milky-тема с мягкими тенями.
- Noise overlay на `body::before`.
- Общий `focus-visible` outline.
- Импорт стилей zoom-компонента: `react-medium-image-zoom/dist/styles.css`.

---

## 10) Деплой и Railway

Текущее состояние:
- Проект уже задеплоен на Railway.

Зафиксированный процесс (по README и скриптам):
- Build: `npm run build`
- Start: `npm start`
- Migration step: `npm run db:migrate`
- Seed (опционально, осторожно): `npm run db:seed`

Примечание:
- URL/ID Railway-сервиса не хранится в репозитории.

---

## 11) Текущие ограничения / gaps

- Админ-панели/CRUD-интерфейса нет.
- Автотесты (unit/integration/e2e) не настроены.

---

## 12) Definition of Done (текущее)

1. `npm run dev` стартует приложение.
2. `npm run build` проходит успешно.
3. Landing доступен на `/`.
4. Каталог доступен на `/ru`, `/ro`, `/en`.
5. Фильтрация `q/districts/tags/sort` работает.
6. Deep-link на конкретный зал работает (scroll + highlight).
7. Галерея зала поддерживает zoom/lightbox.
