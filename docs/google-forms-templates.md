# Google Forms Templates For StudiosMD

This file contains ready-to-copy templates for two Google Forms:
- Studio Intake (one response = one studio)
- Hall Intake (one response = one hall)

Use internal field codes in square brackets in each question title. They simplify mapping to Prisma.

## 1) Form: Studio Intake

Form title:
- StudiosMD - Studio Intake

Form description:
- Fill this form once for your studio. Halls are added in a separate Hall Intake form.

Questions:

1. Studio legal/contact person name [META_contact_name]
- Type: Short answer
- Required: yes

2. Contact phone for clarifications [META_contact_phone]
- Type: Short answer
- Required: yes

3. Studio name (main language) [ST_name]
- Type: Short answer
- Required: yes
- Prisma mapping: `Studio.name_i18n.ru`

4. Studio address (main language) [ST_address]
- Type: Short answer
- Required: yes
- Prisma mapping: `Studio.address_i18n.ru`

5. District [ST_district_key]
- Type: Dropdown
- Required: yes
- Options:
  - botanica
  - ciocana
  - centru
  - buiucani
  - riscani
- Prisma mapping: `Studio.district_key`

6. Cover image URLs (one per line) [ST_cover_images]
- Type: Paragraph
- Required: yes
- Validation note: each line must be full `https://...` URL
- Prisma mapping: `Studio.cover_images[]`

7. Public phone [ST_phone]
- Type: Short answer
- Required: no
- Prisma mapping: `Studio.phone`

8. Instagram nickname or URL [ST_instagram_nickname]
- Type: Short answer
- Required: no
- Prisma mapping: `Studio.instagram_nickname`

9. Google Maps URL [ST_google_maps_url]
- Type: Short answer
- Required: no
- Validation: URL
- Prisma mapping: `Studio.google_maps_url`

10. Yandex Maps URL [ST_yandex_maps_url]
- Type: Short answer
- Required: no
- Validation: URL
- Prisma mapping: `Studio.yandex_maps_url`

11. Logo URL [ST_logo_url]
- Type: Short answer
- Required: no
- Validation: URL
- Prisma mapping: `Studio.logo_url`

12. Working hours (main language) [ST_working_hours]
- Type: Short answer
- Required: no
- Prisma mapping: `Studio.working_hours_i18n.ru`

## 2) Form: Hall Intake

Form title:
- StudiosMD - Hall Intake

Form description:
- One response = one hall in one existing studio.

Questions:

1. Studio ID (from database) [HL_studioId]
- Type: Short answer
- Required: yes
- Prisma mapping: `Hall.studioId`

2. Hall name (main language) [HL_name]
- Type: Short answer
- Required: yes
- Prisma mapping: `Hall.name_i18n.ru`

3. Hall image URLs (one per line) [HL_images]
- Type: Paragraph
- Required: yes
- Validation note: each line must be full `https://...` URL
- Prisma mapping: `Hall.images[]`

4. Price per hour (MDL) [HL_price_per_hour]
- Type: Short answer
- Required: yes
- Validation: number, min 1
- Prisma mapping: `Hall.price_per_hour`

5. Weekend price (MDL) [HL_weekend_price]
- Type: Short answer
- Required: no
- Validation: number, min 1
- Prisma mapping: `Hall.weekend_price`

6. Area m2 [HL_area_sqm]
- Type: Short answer
- Required: no
- Validation: number, min 1
- Prisma mapping: `Hall.area_sqm`

7. High ceiling (meters) [HL_high_ceiling]
- Type: Short answer
- Required: no
- Validation: number, min 1
- Prisma mapping: `Hall.high_ceiling`

8. Daylight [HL_daylight]
- Type: Multiple choice
- Required: yes
- Options: yes, no
- Prisma mapping: `Hall.daylight` (boolean)

9. Blackout [HL_blackout]
- Type: Multiple choice
- Required: yes
- Options: yes, no
- Prisma mapping: `Hall.blackout` (boolean)

10. Parking [HL_parking]
- Type: Multiple choice
- Required: yes
- Options: yes, no
- Prisma mapping: `Hall.parking` (boolean)

11. Changing room [HL_changing_room]
- Type: Multiple choice
- Required: yes
- Options: yes, no
- Prisma mapping: `Hall.changing_room` (boolean)

12. Furniture [HL_furniture]
- Type: Multiple choice
- Required: yes
- Options: yes, no
- Prisma mapping: `Hall.furniture` (boolean)

13. Flash light [HL_flash_light]
- Type: Multiple choice
- Required: yes
- Options: yes, no
- Prisma mapping: `Hall.flash_light` (boolean)

14. Continuous light [HL_continuous_light]
- Type: Multiple choice
- Required: yes
- Options: yes, no
- Prisma mapping: `Hall.continuous_light` (boolean)

15. Tags (select up to 6) [HL_tags]
- Type: Checkboxes
- Required: yes
- Options (current project tags):
  - sunny_morning
  - sunny_evening
  - portrait
  - fashion
  - content
  - family
  - product
  - minimal
  - classic
  - loft
  - boho
  - bright
  - dark
  - pastel
  - cyclorama
  - colored_walls
  - texture_walls
  - paper_backdrops
  - mirror
  - small
  - spacious
- Response validation:
  - set "Select at most" to `6`
- Prisma mapping: `Hall.tags[]`

Important for tags:
- Do not include these facts in tags anymore:
  - daylight
  - blackout
  - parking
  - changing_room
  - furniture
  - flash_light
  - continuous_light

## 3) Form Settings

Recommended Google Form settings:
- Collect email addresses: ON
- Limit to 1 response: OFF
- Edit after submit: ON
- Show progress bar: ON

## 4) Data language policy

To simplify collection:
- Owners fill only one language (recommended: Russian) for text fields.
- Assistant translates to `ro` and `en` before insert.
