'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { readStorage, writeStorage } from '@/lib/browser-storage'

type AvailabilityContextType = {
  available: boolean
  setAvailable: (v: boolean) => void
}

const AvailabilityContext = createContext<AvailabilityContextType | null>(null)

const STORAGE_KEY = 'hgrs-availability'

export function AvailabilityProvider({ children }: { children: ReactNode }) {
  const [available, setAvailableState] = useState(() => {
    const stored = readStorage(STORAGE_KEY)
    return stored !== null ? stored === 'true' : true
  })

  const setAvailable = useCallback((v: boolean) => {
    setAvailableState(v)
    writeStorage(STORAGE_KEY, String(v))
  }, [])

  useEffect(() => {
    writeStorage(STORAGE_KEY, String(available))
  }, [available])

  return (
    <AvailabilityContext.Provider value={{ available, setAvailable }}>
      {children}
    </AvailabilityContext.Provider>
  )
}

export function useAvailability() {
  const ctx = useContext(AvailabilityContext)
  if (!ctx) throw new Error('useAvailability must be used within an AvailabilityProvider')
  return ctx
}
