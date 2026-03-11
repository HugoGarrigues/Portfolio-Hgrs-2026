export type Locale = 'fr' | 'en'

export const DEFAULT_LOCALE: Locale = 'fr'

export const LOCALE_DATE_FORMAT: Record<Locale, string> = {
  fr: 'fr-FR',
  en: 'en-US',
}
