export type Locale = 'fr' | 'en' | 'de' | 'es' | 'it'

export const DEFAULT_LOCALE: Locale = 'fr'

export const LOCALE_DATE_FORMAT: Record<Locale, string> = {
  fr: 'fr-FR',
  en: 'en-US',
  de: 'de-DE',
  es: 'es-ES',
  it: 'it-IT',
}
