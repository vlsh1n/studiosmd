# studiosmap — Product Specification (Current State)

Этот документ фиксирует текущее продуктовое состояние `studiosmap` по коду на март 2026.

## 1) Product Summary

`studiosmap` — мультиязычный каталог фотостудий и залов в Chișinău.

Основная ценность:
- пользователь быстро находит подходящий зал;
- сравнивает по фото, району, цене и опциям;
- переходит на страницу студии с фокусом на выбранный зал;
- связывается со студией напрямую.

## 2) Scope (What Is In)

Реализовано:
- Локали: `ro` (default), `ru`, `en`.
- Landing page на `/` с переключением языка и CTA в каталог.
- Каталог залов на `/{locale}`.
- Страница студии на `/{locale}/studios/{studioSlug}`.
- Hall-friendly URL: `/{locale}/studios/{studioSlug}/{hallSlug}`.
- SEO metadata (canonical, hreflang, OpenGraph, Twitter).
- JSON-LD `LocalBusiness` на страницах студий.
- GA4 события по ключевым действиям.

## 3) Core User Flow

1. Пользователь открывает `/`.
2. Выбирает язык и переходит в каталог.
3. Использует поиск/фильтры/сортировку.
4. Открывает карточку зала.
5. Попадает на страницу студии с фокусом на конкретном зале.
6. Переходит по контактам студии.

## 4) Catalog Experience

Каталог (`/{locale}`) работает по сущности `Hall`.

Доступно в интерфейсе:
- Поиск по названию зала/студии (`q`).
- Фильтр по районам (`districts`, multi-select).
- Фильтр по опциям (`facts`, multi-select):
  - daylight
  - blackout
  - parking
  - changing_room
  - furniture
  - flash_light
  - continuous_light
  - cyclorama
- Сортировка:
  - `random` (default)
  - `price_asc`
  - `price_desc`
- Пагинация, `PAGE_SIZE = 12`.

Дополнительно:
- Фильтр по тегам поддержан в backend/query params, но скрыт в UI (`SHOW_TAG_FILTERS = false`).
- Для отсутствующей цены выводится локализованное `price_on_request`.

## 5) Studio Experience

Страница студии включает:
- Блок студии: название, район, адрес, график, контакты.
- Контактные CTA: Telegram/Instagram/Phone/Maps (если данные заполнены).
- Список залов с галереей и фактами.
- Фокус на выбранный зал (при переходе из hall-friendly URL).
- Трекинг кликов по контактам (`studio_contact_clicked`).

Canonical поведение:
- Канонический URL студии: `/{locale}/studios/{id}-{studio-slug}`.
- Неканонические варианты корректируются через permanent redirect.

## 6) Localization and Language Behavior

- Локаль задается первым сегментом URL (`/ro`, `/ru`, `/en`).
- На сервере `<html lang>` выставляется из `x-locale`, который прокидывает `src/proxy.ts`.
- На client-side переходах между локалями `<html lang>` синхронизируется компонентом `HtmlLangSync.client.tsx`.

Итог: язык документа корректно обновляется и при SSR, и при client navigation.

## 7) SEO and Discovery

- Для `/`, каталога и студий генерируются metadata + alternates.
- `x-default` указывает на румынскую локаль (`/ro`).
- `robots.txt` разрешает обычных краулеров и блокирует список AI-ботов.
- `sitemap.xml` включает:
  - локализованные корни,
  - канонические URL студий.
- Hall-friendly URL в sitemap не включаются намеренно.

## 8) Analytics

События GA4:
- `search_used`
- `filter_used`
- `hall_clicked`
- `studio_contact_clicked`

GA4 подключается только если задан `NEXT_PUBLIC_GA_MEASUREMENT_ID`.

## 9) Data Model (Product View)

Сущности:
- `Studio`: бренд/адрес/контакты/район.
- `Hall`: фото/параметры/цена/факты/теги.

Ключевой принцип каталога:
- выбор делается по залу;
- студия выступает контейнером для залов.

## 10) Non-Goals in Current Version

Пока не реализовано:
- online booking / payment;
- личные кабинеты студий;
- календарь занятости;
- пользовательские аккаунты/избранное;
- ранжирование/рейтинг студий;
- публичная админка (контент поддерживается через БД/seed/миграции).

## 11) Operational Notes

- Rate limit в `src/proxy.ts` in-memory, best-effort, per runtime instance.
- Контентная актуальность (цены, фото, контакты) остается ключевой операционной задачей.
- Для стабильного SEO важно сохранять canonical структуру URL студий.
