'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

export type WallpaperId = 'default' | 'void' | 'gradient'

export type WallpaperOption = {
  id: WallpaperId
  labelKey: string
  style: React.CSSProperties
}

export const WALLPAPERS: WallpaperOption[] = [
  {
    id: 'default',
    labelKey: 'settings.wallpaper.default',
    style: { backgroundImage: "url('/wallpaper.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' },
  },
  {
    id: 'void',
    labelKey: 'settings.wallpaper.void',
    style: { background: '#080808' },
  },
  {
    id: 'gradient',
    labelKey: 'settings.wallpaper.gradient',
    style: { background: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 40%, #0a1a2e 70%, #080808 100%)' },
  },
]

type WallpaperContextType = {
  wallpaper: WallpaperId
  setWallpaper: (id: WallpaperId) => void
  currentStyle: React.CSSProperties
}

const WallpaperContext = createContext<WallpaperContextType | null>(null)

const STORAGE_KEY = 'hgrs-wallpaper'

export function WallpaperProvider({ children }: { children: ReactNode }) {
  const [wallpaper, setWallpaperState] = useState<WallpaperId>('default')

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'default' || stored === 'void' || stored === 'gradient') {
      setWallpaperState(stored)
    }
  }, [])

  const setWallpaper = useCallback((id: WallpaperId) => {
    setWallpaperState(id)
    localStorage.setItem(STORAGE_KEY, id)
  }, [])

  const currentStyle = WALLPAPERS.find((w) => w.id === wallpaper)?.style ?? WALLPAPERS[0].style

  return (
    <WallpaperContext.Provider value={{ wallpaper, setWallpaper, currentStyle }}>
      {children}
    </WallpaperContext.Provider>
  )
}

export function useWallpaper() {
  const ctx = useContext(WallpaperContext)
  if (!ctx) throw new Error('useWallpaper must be used within a WallpaperProvider')
  return ctx
}
