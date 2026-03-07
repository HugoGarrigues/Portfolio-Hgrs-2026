'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import type { AppId } from '@/contexts/WindowManagerContext'
import type { AppConfig } from '@/lib/apps'

type OpenWindow = { id: string; app: AppId; minimized: boolean }

type DockProps = {
  apps: AppConfig[]
  openWindows: OpenWindow[]
  onOpen: (app: AppId) => void
  onFocus: (id: string) => void
}

const ICON_SIZE = 56
const MAGNIFY_SIZE = 80
const MAGNIFY_RANGE = 80

type DockIconProps = {
  config: AppConfig
  isOpen: boolean
  mouseX: ReturnType<typeof useMotionValue<number>>
  onClick: () => void
}

function DockIcon({ config, isOpen, mouseX, onClick }: DockIconProps) {
  const ref = useRef<HTMLDivElement>(null)

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect()
    if (!bounds) return MAGNIFY_RANGE + 1
    return Math.abs(val - (bounds.left + bounds.width / 2))
  })

  const scale = useTransform(distance, [0, MAGNIFY_RANGE], [MAGNIFY_SIZE / ICON_SIZE, 1], {
    clamp: true,
  })
  const springScale = useSpring(scale, { stiffness: 300, damping: 24 })

  return (
    <div data-dock-item className="flex flex-col items-center gap-1">
      <motion.div
        ref={ref}
        style={{ scale: springScale, width: ICON_SIZE, height: ICON_SIZE }}
        className="flex items-center justify-center rounded-2xl bg-white/10 backdrop-blur cursor-pointer hover:bg-white/15 transition-colors"
      >
        <button
          aria-label={config.label}
          onClick={onClick}
          className="w-full h-full flex items-center justify-center text-3xl focus:outline-none"
        >
          {config.icon}
        </button>
      </motion.div>

      {/* Open indicator dot */}
      {isOpen && (
        <span
          data-open-dot
          className="block w-1 h-1 rounded-full bg-white/60"
          aria-hidden="true"
        />
      )}
      {/* Reserve space when not open so dock doesn't shift */}
      {!isOpen && <span className="block w-1 h-1" aria-hidden="true" />}
    </div>
  )
}

export function Dock({ apps, openWindows, onOpen, onFocus }: DockProps) {
  const mouseX = useMotionValue(Infinity)

  function handleIconClick(config: AppConfig) {
    const existing = openWindows.find((w) => w.app === config.id)
    if (!existing || existing.minimized) {
      onOpen(config.id)
    } else {
      onFocus(existing.id)
    }
  }

  return (
    <div
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-[9000]"
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
    >
      <div className="flex items-end gap-2 px-4 py-2 rounded-2xl bg-white/[0.08] backdrop-blur-2xl border border-white/[0.12] shadow-2xl shadow-black/40">
        {apps.map((app) => {
          const openWin = openWindows.find((w) => w.app === app.id)
          return (
            <DockIcon
              key={app.id}
              config={app}
              isOpen={!!openWin && !openWin.minimized}
              mouseX={mouseX}
              onClick={() => handleIconClick(app)}
            />
          )
        })}
      </div>
    </div>
  )
}
