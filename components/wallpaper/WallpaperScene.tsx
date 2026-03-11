'use client'

import { useWallpaper } from '@/contexts/WallpaperContext'

export default function WallpaperScene() {
  const { currentStyle } = useWallpaper()

  return (
    <div
      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
      style={currentStyle}
    />
  )
}
