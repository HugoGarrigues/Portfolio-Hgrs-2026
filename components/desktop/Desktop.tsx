'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { WindowManagerProvider, useWindowManager } from '@/contexts/WindowManagerContext'
import type { AppId } from '@/contexts/WindowManagerContext'
import { Window } from '@/components/desktop/Window'
import { MenuBar } from '@/components/desktop/MenuBar'
import { Dock } from '@/components/desktop/Dock'
import { BootScreen } from '@/components/desktop/BootScreen'
import { APPS } from '@/lib/apps'
import { AboutApp } from '@/components/apps/AboutApp'
import { FinderApp } from '@/components/apps/FinderApp'
import { ProjectsApp } from '@/components/apps/ProjectsApp'
import { TerminalApp } from '@/components/apps/TerminalApp'

const WallpaperScene = dynamic(() => import('@/components/wallpaper/WallpaperScene'), {
  ssr: false,
})

function AppContent({ appId }: { appId: AppId }) {
  switch (appId) {
    case 'about':    return <AboutApp />
    case 'finder':   return <FinderApp />
    case 'terminal': return <TerminalApp />
    case 'projects': return <ProjectsApp />
    default:
      return (
        <div className="h-full flex items-center justify-center text-white/30 text-sm">
          {appId} — bientôt disponible
        </div>
      )
  }
}

function DesktopContent() {
  const { windows, openWindow, closeWindow, focusWindow, minimizeWindow, maximizeWindow } =
    useWindowManager()

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black select-none" data-desktop-container>
      {/* Wallpaper */}
      <WallpaperScene />

      {/* Overlay tint — matches gucduck's bg-black/10 */}
      <div className="absolute inset-0 bg-black/10 pointer-events-none" />

      {/* Menu bar */}
      <MenuBar onOpenAbout={() => openWindow('about')} />

      {/* Windows */}
      <AnimatePresence>
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
            <AppContent appId={win.app} />
          </Window>
        )
      })}
      </AnimatePresence>

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
  const [booted, setBooted] = useState(false)

  return (
    <WindowManagerProvider>
      {!booted && <BootScreen onComplete={() => setBooted(true)} />}
      <DesktopContent />
    </WindowManagerProvider>
  )
}
