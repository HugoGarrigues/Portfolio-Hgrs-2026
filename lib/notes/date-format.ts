import type { Locale } from '@/lib/i18n/locales'

function toIntlLocale(locale: Locale) {
  switch (locale) {
    case 'fr':
      return 'fr-FR'
    case 'de':
      return 'de-DE'
    case 'es':
      return 'es-ES'
    case 'it':
      return 'it-IT'
    case 'en':
    default:
      return 'en-GB'
  }
}

export function formatNotesCardDate(date: string, locale: Locale) {
  return new Intl.DateTimeFormat(toIntlLocale(locale), {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatNotesDetailDate(date: string, locale: Locale) {
  return new Intl.DateTimeFormat(toIntlLocale(locale), {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatNotesEditorTimestamp(date: string, locale: Locale) {
  return new Intl.DateTimeFormat(toIntlLocale(locale), {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}
