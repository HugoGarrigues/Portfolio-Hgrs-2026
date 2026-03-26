'use client'

import dynamic from 'next/dynamic'
import { useState, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import { WindowManagerProvider, useWindowManager } from '@/contexts/WindowManagerContext'
import type { AppId } from '@/contexts/WindowManagerContext'
import { Window } from '@/components/desktop/Window'
import { MenuBar } from '@/components/desktop/MenuBar'
import { Dock } from '@/components/desktop/Dock'
import { BootScreen } from '@/components/desktop/BootScreen'
import { DesktopIcons } from '@/components/desktop/DesktopIcons'
import { APPS } from '@/lib/apps'
import { AboutApp } from '@/components/apps/AboutApp'
import { FinderApp } from '@/components/apps/FinderApp'
import { MailApp } from '@/components/apps/MailApp'
import { NotesApp } from '@/components/apps/NotesApp'
import { PreviewApp } from '@/components/apps/PreviewApp'
import { SettingsApp } from '@/components/apps/SettingsApp'
import { HealthApp } from '@/components/apps/HealthApp'
import { useTranslation } from '@/lib/i18n/useTranslation'

const WallpaperScene = dynamic(() => import('@/components/wallpaper/WallpaperScene'), {
  ssr: false,
})

function AppContent({ appId }: { appId: AppId }) {
  const { t } = useTranslation()

  switch (appId) {
    case 'about': return <AboutApp />
    case 'finder': return <FinderApp />
    case 'contact': return <MailApp />
    case 'notes': return <NotesApp />
    case 'health': return <HealthApp />
    case 'preview': return <PreviewApp />
    case 'settings': return <SettingsApp />
    default:
      return (
        <div className="h-full flex items-center justify-center text-foreground/65 dark:text-foreground/40 text-sm font-medium tracking-tight">
          {appId} — {t('desktop.comingSoon')}
        </div>
      )
  }
}

type Rect = { x: number; y: number; w: number; h: number }

function DesktopContent() {
  const { windows, openWindow, closeWindow, focusWindow, minimizeWindow, maximizeWindow, moveWindow } =
    useWindowManager()

  const [sel, setSel] = useState<Rect | null>(null)
  const origin = useRef<{ x: number; y: number } | null>(null)
  const layerRef = useRef<HTMLDivElement>(null)

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.button !== 0) return
    origin.current = { x: e.clientX, y: e.clientY }
    setSel({ x: e.clientX, y: e.clientY, w: 0, h: 0 })
    layerRef.current?.setPointerCapture(e.pointerId)
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!origin.current) return
    const { x: ox, y: oy } = origin.current
    setSel({
      x: Math.min(ox, e.clientX),
      y: Math.min(oy, e.clientY),
      w: Math.abs(e.clientX - ox),
      h: Math.abs(e.clientY - oy),
    })
  }

  function onPointerUp() {
    origin.current = null
    setSel(null)
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black select-none" data-desktop-container>
      {/* Wallpaper */}
      <WallpaperScene />

      {/* Overlay tint — matches gucduck's bg-black/10 */}
      <div className="absolute inset-0 bg-black/10 pointer-events-none" />

      {/* Desktop selection layer — sits below windows (z-1) */}
      <div
        ref={layerRef}
        className="absolute inset-0 z-[1]"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        {sel && sel.w > 4 && sel.h > 4 && (
          <div
            className="absolute pointer-events-none rounded-[3px]"
            style={{
              left: sel.x,
              top: sel.y,
              width: sel.w,
              height: sel.h,
              background: 'rgba(255, 255, 255, 0.10)',
              border: '1px solid rgba(255, 255, 255, 0.35)',
            }}
          />
        )}
      </div>

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
              size={win.size}
              disableMinimize={win.app === 'about'}
              disableMaximize={win.app === 'about'}
              onClose={closeWindow}
              onMinimize={minimizeWindow}
              onMaximize={maximizeWindow}
              onMove={moveWindow}
              onFocus={focusWindow}
            >
              <AppContent appId={win.app} />
            </Window>
          )
        })}
      </AnimatePresence>

      {/* Desktop Icons */}
      <DesktopIcons />

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
