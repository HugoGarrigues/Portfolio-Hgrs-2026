import { useCallback } from 'react'
import { useLocale } from '@/contexts/LocaleContext'
import type { Locale } from './locales'

import fr from './translations/fr.json'
import en from './translations/en.json'

const TRANSLATIONS: Record<Locale, Record<string, string>> = { fr, en }

export function useTranslation() {
  const { locale } = useLocale()

  const t = useCallback(
    (key: string): string => {
      return TRANSLATIONS[locale]?.[key] ?? TRANSLATIONS.fr[key] ?? key
    },
    [locale],
  )

  return { t, locale }
}
