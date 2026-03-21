import type { Locale } from './locales'

const VALID_LOCALES: Locale[] = ['fr', 'en', 'de', 'es', 'it']

export function isLocale(value: string | null): value is Locale {
  return value !== null && VALID_LOCALES.includes(value as Locale)
}
