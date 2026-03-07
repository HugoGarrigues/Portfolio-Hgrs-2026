'use client'

import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import {
  Folder,
  Terminal,
  Briefcase,
  User,
  Mail,
  Bookmark,
  FileText,
  LucideIcon,
} from 'lucide-react'
import type { AppId } from '@/contexts/WindowManagerContext'
import type { AppConfig } from '@/lib/apps'

// ─── Icon map ──────────────────────────────────────────────────────────────────

const ICON_MAP: Record<AppId, LucideIcon> = {
  projects: Folder,
  terminal: Terminal,
  work:     Briefcase,
  about:    User,
  contact:  Mail,
  links:    Bookmark,
  resume:   FileText,
}

// Icon background colours (mimics macOS app colours)
const ICON_BG: Record<AppId, string> = {
  projects: 'bg-blue-500',
  terminal: 'bg-neutral-800',
  work:     'bg-violet-600',
  about:    'bg-teal-500',
  contact:  'bg-green-500',
  links:    'bg-orange-500',
  resume:   'bg-rose-500',
}

// ─── Constants ─────────────────────────────────────────────────────────────────

const ICON_SIZE    = 52
const MAGNIFY_SIZE = 76
const MAGNIFY_RANGE = 90

// ─── Types ─────────────────────────────────────────────────────────────────────

type OpenWindow = { id: string; app: AppId; minimized: boolean }

type DockProps = {
  apps: AppConfig[]
  openWindows: OpenWindow[]
  onOpen: (app: AppId) => void
  onFocus: (id: string) => void
}

// ─── Single icon ───────────────────────────────────────────────────────────────

type DockIconProps = {
  config: AppConfig
  isOpen: boolean
  isMinimized: boolean
  mouseX: ReturnType<typeof useMotionValue<number>>
  onClick: () => void
  launching: boolean
}

function DockIcon({ config, isOpen, mouseX, onClick, launching }: DockIconProps) {
  const ref = useRef<HTMLDivElement>(null)

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect()
    if (!bounds) return MAGNIFY_RANGE + 1
    return Math.abs(val - (bounds.left + bounds.width / 2))
  })

  const scale = useTransform(distance, [0, MAGNIFY_RANGE], [MAGNIFY_SIZE / ICON_SIZE, 1], {
    clamp: true,
  })
  const springScale = useSpring(scale, { stiffness: 320, damping: 22 })

  const Icon = ICON_MAP[config.id as AppId]
  const bg   = ICON_BG[config.id as AppId] ?? 'bg-neutral-700'

  return (
    <div data-dock-item className="flex flex-col items-center gap-1.5 relative">
      {/* Tooltip */}
      <div className="absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur text-white text-[11px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-10">
        {config.label}
      </div>

      <motion.div
        ref={ref}
        style={{
          scale: springScale,
          width:  ICON_SIZE,
          height: ICON_SIZE,
          originY: 1, // scale up from bottom
        }}
        animate={launching ? {
          y: [0, -18, 0, -10, 0],
          transition: { duration: 0.55, ease: 'easeInOut' },
        } : { y: 0 }}
        className="flex items-center justify-center"
      >
        <button
          aria-label={config.label}
          onClick={onClick}
          className={`
            w-full h-full flex items-center justify-center
            rounded-[14px] ${bg}
            shadow-lg shadow-black/40
            focus:outline-none
            active:brightness-75
            transition-[filter] duration-75
          `}
        >
          {Icon && <Icon size={28} color="white" strokeWidth={1.6} />}
        </button>
      </motion.div>

      {/* Open indicator dot */}
      <span
        data-open-dot
        className={`block w-1 h-1 rounded-full transition-opacity duration-200 ${
          isOpen ? 'bg-white/70 opacity-100' : 'opacity-0'
        }`}
        aria-hidden="true"
      />
    </div>
  )
}

// ─── Minimized thumbnail ───────────────────────────────────────────────────────

function MinimizedThumb({
  win,
  mouseX,
  onClick,
}: {
  win: OpenWindow
  mouseX: ReturnType<typeof useMotionValue<number>>
  onClick: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const Icon = ICON_MAP[win.app] ?? Folder
  const bg   = ICON_BG[win.app]  ?? 'bg-neutral-700'

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect()
    if (!bounds) return MAGNIFY_RANGE + 1
    return Math.abs(val - (bounds.left + bounds.width / 2))
  })
  const scale       = useTransform(distance, [0, MAGNIFY_RANGE], [MAGNIFY_SIZE / ICON_SIZE, 1], { clamp: true })
  const springScale = useSpring(scale, { stiffness: 320, damping: 22 })

  return (
    <div className="flex flex-col items-center gap-1.5">
      <motion.div
        ref={ref}
        style={{ scale: springScale, width: ICON_SIZE, height: ICON_SIZE, originY: 1 }}
        className="relative"
      >
        <button
          aria-label={`Restore ${win.app}`}
          onClick={onClick}
          className={`w-full h-full flex items-center justify-center rounded-[14px] ${bg} opacity-60 shadow-lg shadow-black/40 focus:outline-none`}
        >
          <Icon size={24} color="white" strokeWidth={1.6} />
        </button>
        {/* Minimized badge */}
        <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-white/40" />
      </motion.div>
      <span className="block w-1 h-1 rounded-full bg-white/40" aria-hidden="true" />
    </div>
  )
}

// ─── Dock ──────────────────────────────────────────────────────────────────────

export function Dock({ apps, openWindows, onOpen, onFocus }: DockProps) {
  const mouseX = useMotionValue(Infinity)
  const [launching, setLaunching] = useState<AppId | null>(null)

  const minimizedWindows = openWindows.filter((w) => w.minimized)
  const hasMinimized     = minimizedWindows.length > 0

  function handleIconClick(config: AppConfig) {
    const existing = openWindows.find((w) => w.app === config.id)
    if (!existing || existing.minimized) {
      setLaunching(config.id as AppId)
      setTimeout(() => setLaunching(null), 600)
      onOpen(config.id as AppId)
    } else {
      onFocus(existing.id)
    }
  }

  return (
    <div
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-[9000] group"
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
    >
      {/* Dock pill */}
      <div
        className="
          flex items-end gap-1.5 px-3 py-2
          rounded-2xl
          border border-white/[0.18]
          shadow-[0_8px_32px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)]
        "
        style={{
          background: 'rgba(30,30,35,0.55)',
          backdropFilter: 'blur(32px) saturate(180%)',
          WebkitBackdropFilter: 'blur(32px) saturate(180%)',
        }}
      >
        {/* Pinned apps */}
        {apps.map((app) => {
          const openWin = openWindows.find((w) => w.app === app.id)
          return (
            <DockIcon
              key={app.id}
              config={app}
              isOpen={!!openWin && !openWin.minimized}
              isMinimized={!!openWin?.minimized}
              mouseX={mouseX}
              onClick={() => handleIconClick(app)}
              launching={launching === app.id}
            />
          )
        })}

        {/* Separator — only shown when minimized windows exist */}
        <AnimatePresence>
          {hasMinimized && (
            <motion.div
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0 }}
              className="self-stretch w-px mx-1 bg-white/20 rounded-full"
            />
          )}
        </AnimatePresence>

        {/* Minimized windows */}
        <AnimatePresence>
          {minimizedWindows.map((win) => (
            <motion.div
              key={win.id}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.4 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            >
              <MinimizedThumb
                win={win}
                mouseX={mouseX}
                onClick={() => onFocus(win.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
