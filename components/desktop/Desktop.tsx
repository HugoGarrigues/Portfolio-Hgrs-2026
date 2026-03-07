'use client'

import dynamic from 'next/dynamic'
import { WindowManagerProvider, useWindowManager } from '@/contexts/WindowManagerContext'
import type { AppId } from '@/contexts/WindowManagerContext'
import { Window } from '@/components/desktop/Window'
import { MenuBar } from '@/components/desktop/MenuBar'
import { Dock } from '@/components/desktop/Dock'
import { APPS } from '@/lib/apps'

const WallpaperScene = dynamic(() => import('@/components/wallpaper/WallpaperScene'), {
  ssr: false,
})

function DesktopContent() {
  const { windows, openWindow, closeWindow, focusWindow, minimizeWindow, maximizeWindow } =
    useWindowManager()

  const activeApp = windows.find((w) => !w.minimized && w.zIndex === Math.max(...windows.map((x) => x.zIndex)))
  const activeAppConfig = APPS.find((a) => a.id === activeApp?.app)

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black select-none">
      {/* Wallpaper */}
      <WallpaperScene />

      {/* Menu bar */}
      <MenuBar activeApp={activeAppConfig?.label} />

      {/* Windows */}
      {windows.map((win) => {
        const config = APPS.find((a) => a.id === win.app)
        return (
          <Window
            key={win.id}
            id={win.id}
            title={`${config?.label ?? win.app}.app`}
            zIndex={win.zIndex}
            minimized={win.minimized}
            maximized={win.maximized}
            position={win.position}
            onClose={closeWindow}
            onMinimize={minimizeWindow}
            onMaximize={maximizeWindow}
            onFocus={focusWindow}
          >
            <div className="p-4 text-white/60 text-sm">
              {config?.label ?? win.app}
            </div>
          </Window>
        )
      })}

      {/* Dock */}
      <Dock
        apps={APPS}
        openWindows={windows.map((w) => ({ id: w.id, app: w.app as AppId, minimized: w.minimized }))}
        onOpen={(app) => openWindow(app)}
        onFocus={focusWindow}
      />
    </div>
  )
}

export function Desktop() {
  return (
    <WindowManagerProvider>
      <DesktopContent />
    </WindowManagerProvider>
  )
}
