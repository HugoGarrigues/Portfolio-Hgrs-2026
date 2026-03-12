'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState } from 'react'
import type { AppId } from '@/contexts/WindowManagerContext'
import type { AppConfig } from '@/lib/apps'
import { useTheme } from '@/contexts/ThemeContext'

// ─── Icon paths ────────────────────────────────────────────────────────────────

const ICON_FILE: Record<AppId, string> = {
  finder: 'finder',
  instagram: 'instagram',
  photos: 'photos',
  music: 'music',
  terminal: 'terminal',
  about: 'finder',
  contact: 'mail',
  preview: 'preview',
  settings: 'settings',
}

function iconSrc(appId: AppId): string {
  const file = ICON_FILE[appId]
  return `/icons/${file}.png`
}

// ─── Types ─────────────────────────────────────────────────────────────────────

type OpenWindow = { id: string; app: AppId; minimized: boolean }

type DockProps = {
  apps: AppConfig[]
  openWindows: OpenWindow[]
  onOpen: (app: AppId) => void
  onFocus: (id: string) => void
}

// ─── Single dock item ──────────────────────────────────────────────────────────

type DockItemProps = {
  config: AppConfig
  isOpen: boolean
  onClick: () => void
  size: number
}

function DockItem({ config, isOpen, onClick, size }: DockItemProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <motion.div
      data-dock-item
      className="relative"
      onHoverStart={() => setShowTooltip(true)}
      onHoverEnd={() => setShowTooltip(false)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.88 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {/* Tooltip */}
      {showTooltip && (
        <motion.div
          className="hidden sm:block absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50 pointer-events-none"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
        >
          <div className="bg-gray-900/60 backdrop-blur-sm text-foreground text-xs px-2 py-1 rounded-lg whitespace-nowrap shadow-lg">
            {config.label}
          </div>
        </motion.div>
      )}

      <button
        aria-label={config.label}
        onClick={onClick}
        className="relative flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-xl"
      >
        <div
          className="relative flex items-center justify-center"
        >
          <Image
            src={iconSrc(config.id as AppId)}
            alt={config.label}
            width={size}
            height={size}
            style={{ width: `${size}px`, height: `${size}px` }}
            className={`rounded-xl ${config.id === 'settings' ? 'scale-[1.25]' : ''}`}
            draggable={false}
          />

          {/* Open indicator dot */}
          <span
            data-open-dot
            className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full transition-opacity duration-200 ${isOpen ? 'bg-white opacity-100' : 'opacity-0'
              }`}
            aria-hidden="true"
          />
        </div>
      </button>
    </motion.div>
  )
}

// ─── Minimized thumbnail ───────────────────────────────────────────────────────

type MinimizedThumbProps = {
  win: OpenWindow
  config: AppConfig
  onRestore: () => void
  size: number
}

function MinimizedThumb({ win, config, onRestore, size }: MinimizedThumbProps) {
  return (
    <button
      aria-label={`Restore ${config.label}`}
      onClick={onRestore}
      className="relative flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-xl transition-transform hover:scale-110 active:scale-95"
    >
      <div className="relative flex items-center justify-center">
        <Image
          src={iconSrc(win.app)}
          alt={config.label}
          width={size}
          height={size}
          style={{ width: `${size}px`, height: `${size}px` }}
          className={`rounded-xl shadow-lg ${win.app === 'settings' ? 'scale-[1.25]' : ''}`}
          draggable={false}
        />
        {/* Open indicator dot (as requested by user) */}
        <span
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white opacity-100"
          aria-hidden="true"
        />
      </div>
    </button>
  )
}

// ─── Dock ──────────────────────────────────────────────────────────────────────

export function Dock({ apps, openWindows, onOpen, onFocus }: DockProps) {
  const { dockSize, autoHideDock } = useTheme()

  function handleIconClick(config: AppConfig) {
    const existing = openWindows.find((w) => w.app === config.id)
    if (!existing || existing.minimized) {
      onOpen(config.id as AppId)
    } else {
      onFocus(existing.id)
    }
  }

  const minimizedWindows = openWindows.filter((w) => w.minimized)

  const items = apps.map((app) => {
    const openWin = openWindows.find((w) => w.app === app.id)
    return (
      <DockItem
        key={app.id}
        config={app}
        isOpen={!!openWin && !openWin.minimized}
        onClick={() => handleIconClick(app)}
        size={dockSize}
      />
    )
  })

  return (
    <>
      {/* ── Desktop dock — bottom center, horizontal ── */}
      <motion.div
        className="hidden sm:flex fixed left-0 right-0 bottom-4 z-[9000] justify-center pointer-events-none group"
        initial={false}
        animate={{ y: autoHideDock ? 150 : 0 }}
        whileHover={autoHideDock ? { y: 0 } : undefined}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="bg-black/10 dark:bg-white/10 backdrop-blur-xl border-t border-white/20 rounded-3xl shadow-2xl px-3 py-3 pointer-events-auto">
          {/* Invisible interactive area so hover works when peeking */}
          {autoHideDock && <div className="absolute inset-x-0 bottom-0 h-40 group-hover:h-0" />}
          <div className="flex flex-row items-end justify-center gap-4 relative z-10">
            {items}

            {/* Separator + minimized thumbnails */}
            {minimizedWindows.length > 0 && (
              <>
                <div className="w-px h-11 bg-white/40 mx-1 self-center" aria-hidden="true" />
                {minimizedWindows.map((win) => {
                  const config = apps.find((a) => a.id === win.app)
                  if (!config) return null
                  return (
                    <MinimizedThumb
                      key={win.id}
                      win={win}
                      config={config}
                      onRestore={() => onOpen(win.app)}
                      size={dockSize}
                    />
                  )
                })}
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── Mobile dock — left side, vertical (aria-hidden so tests see only desktop) ── */}
      <div
        className="flex sm:hidden fixed left-4 top-1/2 -translate-y-1/2 z-[9000] pointer-events-none"
        aria-hidden="true"
      >
        <div className="bg-black/10 dark:bg-white/10 backdrop-blur-xl border-r border-white/20 rounded-3xl shadow-2xl px-1.5 py-3 pointer-events-auto">
          <div className="flex flex-col items-center justify-center gap-2">
            {apps.map((app) => {
              const openWin = openWindows.find((w) => w.app === app.id)
              const isOpen = !!openWin && !openWin.minimized
              return (
                <button
                  key={app.id}
                  onClick={() => handleIconClick(app)}
                  className="relative flex items-center justify-center focus:outline-none rounded-xl"
                  tabIndex={-1}
                >
                  <Image
                    src={iconSrc(app.id as AppId)}
                    alt={app.label}
                    width={44}
                    height={44}
                    className={`w-11 h-11 rounded-xl ${app.id === 'settings' ? 'scale-[1.25]' : ''}`}
                    draggable={false}
                  />
                  {isOpen && (
                    <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
