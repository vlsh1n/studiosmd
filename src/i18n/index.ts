import { en } from "@/i18n/en";
import { ro } from "@/i18n/ro";
import { ru } from "@/i18n/ru";

export const dictionaries = { en, ro, ru } as const;
export const locales = ["ro", "ru", "en"] as const;

export type Locale = (typeof locales)[number];
export type DictionaryKey = keyof typeof ru;

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function t(locale: Locale, key: DictionaryKey) {
  return dictionaries[locale][key];
}
