'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { type Locale, DEFAULT_LOCALE } from '@/lib/i18n/locales'
import { readStorage, writeStorage } from '@/lib/browser-storage'
import { isLocale } from '@/lib/i18n/is-locale'

type LocaleContextType = {
  locale: Locale
  setLocale: (locale: Locale) => void
}

const LocaleContext = createContext<LocaleContextType | null>(null)

const STORAGE_KEY = 'hgrs-locale'

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const stored = readStorage(STORAGE_KEY)
    return isLocale(stored) ? stored : DEFAULT_LOCALE
  })

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
  }, [])

  useEffect(() => {
    writeStorage(STORAGE_KEY, locale)
    document.documentElement.lang = locale
  }, [locale])

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within a LocaleProvider')
  return ctx
}
