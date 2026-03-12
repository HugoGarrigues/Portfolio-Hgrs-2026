'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

export type WallpaperId = 'default' | 'void' | 'gradient' | 'monterey_dark' | 'sierra_sunset' | 'tahoe' | 'sierra_evening' | 'monterey_wwdc'

export type WallpaperOption = {
  id: WallpaperId
  labelKey: string
  style: React.CSSProperties
}

export const WALLPAPERS: WallpaperOption[] = [
  {
    id: 'default',
    labelKey: 'settings.wallpaper.default',
    style: { backgroundImage: "url('/background/wallpaper.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' },
  },
  {
    id: 'monterey_dark',
    labelKey: 'settings.wallpaper.monterey_dark',
    style: { backgroundImage: "url('/background/macos-monterey-stock-black-dark-mode-layers-5k-3840x2160-5889.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' },
  },
  {
    id: 'sierra_sunset',
    labelKey: 'settings.wallpaper.sierra_sunset',
    style: { backgroundImage: "url('/background/macos-sierra-mountain-peak-sunset-evening-stock-5k-3840x2160-3987.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' },
  },
  {
    id: 'tahoe',
    labelKey: 'settings.wallpaper.tahoe',
    style: { backgroundImage: "url('/background/26-Tahoe-Dark-6K.png')", backgroundSize: 'cover', backgroundPosition: 'center' },
  },
  {
    id: 'sierra_evening',
    labelKey: 'settings.wallpaper.sierra_evening',
    style: { backgroundImage: "url('/background/macos-sierra-sierra-nevada-mountain-range-evening-sunlight-3840x2160-4048.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' },
  },
  {
    id: 'monterey_wwdc',
    labelKey: 'settings.wallpaper.monterey_wwdc',
    style: { backgroundImage: "url('/background/macos-monterey-wwdc-21-stock-dark-mode-5k-6016x6016-5585.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' },
  }
]

type WallpaperContextType = {
  wallpaper: WallpaperId
  setWallpaper: (id: WallpaperId) => void
  currentStyle: React.CSSProperties
}

const WallpaperContext = createContext<WallpaperContextType | null>(null)

const STORAGE_KEY = 'hgrs-wallpaper'
const VALID_WALLPAPERS = WALLPAPERS.map(w => w.id)

export function WallpaperProvider({ children }: { children: ReactNode }) {
  const [wallpaper, setWallpaperState] = useState<WallpaperId>('default')

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as WallpaperId | null
    if (stored && VALID_WALLPAPERS.includes(stored as WallpaperId)) {
      setWallpaperState(stored as WallpaperId)
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
