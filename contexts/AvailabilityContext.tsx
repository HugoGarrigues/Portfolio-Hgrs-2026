'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

type AvailabilityContextType = {
  available: boolean
  setAvailable: (v: boolean) => void
}

const AvailabilityContext = createContext<AvailabilityContextType | null>(null)

const STORAGE_KEY = 'hgrs-availability'

export function AvailabilityProvider({ children }: { children: ReactNode }) {
  const [available, setAvailableState] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored !== null) {
      setAvailableState(stored === 'true')
    }
  }, [])

  const setAvailable = useCallback((v: boolean) => {
    setAvailableState(v)
    localStorage.setItem(STORAGE_KEY, String(v))
  }, [])

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
