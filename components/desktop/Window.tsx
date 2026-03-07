'use client'

import React, { useRef, type ReactNode } from 'react'
import { motion, useDragControls } from 'framer-motion'

// ─── Types ─────────────────────────────────────────────────────────────────────

export type WindowProps = {
  id: string
  title: string
  zIndex: number
  minimized: boolean
  maximized: boolean
  position: { x: number; y: number }
  size: { width: number; height: number }
  children: ReactNode
  onClose: (id: string) => void
  onMinimize: (id: string) => void
  onMaximize: (id: string) => void
  onFocus: (id: string) => void
}

// ─── Traffic light button ──────────────────────────────────────────────────────

type TrafficLightProps = {
  label: string
  color: string
  hoverColor: string
  onClick: (e: React.MouseEvent) => void
}

function TrafficLight({ label, color, hoverColor, onClick }: TrafficLightProps) {
  return (
    <button
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation()
        onClick(e)
      }}
      className={`w-3.5 h-3.5 rounded-full ${color} ${hoverColor} transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/90 focus-visible:ring-offset-1 focus-visible:ring-offset-gray-900`}
    />
  )
}

// ─── Window ────────────────────────────────────────────────────────────────────

export function Window({
  id,
  title,
  zIndex,
  minimized,
  maximized,
  position,
  size,
  children,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
}: WindowProps) {
  const constraintsRef = useRef<HTMLDivElement>(null)
  const dragControls = useDragControls()

  const maximizedStyles: React.CSSProperties = maximized
    ? { top: 0, left: 0, width: '100vw', height: '100vh', transform: 'none' }
    : { width: size.width, height: size.height }

  return (
    <motion.div
      data-minimized={minimized || undefined}
      data-maximized={maximized || undefined}
      drag={!maximized}
      dragControls={dragControls}
      dragMomentum={false}
      dragElastic={0}
      initial={{ x: position.x, y: position.y, opacity: 0, scale: 0.65, y: position.y + 40 }}
      animate={{
        opacity: minimized ? 0 : 1,
        scale: minimized ? 0.6 : 1,
        y: minimized ? position.y + 60 : position.y,
      }}
      exit={{ opacity: 0, scale: 0.75, transition: { duration: 0.15, ease: 'easeIn' } }}
      transition={
        minimized
          ? { duration: 0.2, ease: 'easeIn' }
          : { type: 'spring', stiffness: 320, damping: 28, mass: 0.9 }
      }
      onMouseDown={() => onFocus(id)}
      style={{
        zIndex,
        position: 'fixed',
        pointerEvents: minimized ? 'none' : 'auto',
        transformOrigin: '50% 100%',
        ...maximizedStyles,
      }}
      className="flex flex-col rounded-xl overflow-hidden shadow-2xl shadow-black/60 min-w-[400px] backdrop-blur-xl"
    >
      {/* Title bar — drag handle */}
      <div
        onPointerDown={(e) => {
          if (!maximized) dragControls.start(e)
        }}
        className="flex items-center gap-2 px-3 h-9 bg-[rgba(40,40,40,0.95)] border-b border-white/[0.06] select-none cursor-grab active:cursor-grabbing shrink-0"
      >
        {/* Traffic lights */}
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <TrafficLight
            label="Close"
            color="bg-red-500"
            hoverColor="hover:bg-red-600"
            onClick={() => onClose(id)}
          />
          <TrafficLight
            label="Minimize"
            color="bg-yellow-500"
            hoverColor="hover:bg-yellow-600"
            onClick={() => onMinimize(id)}
          />
          <TrafficLight
            label="Maximize"
            color="bg-green-500"
            hoverColor="hover:bg-green-600"
            onClick={() => onMaximize(id)}
          />
        </div>

        {/* Centered title */}
        <span className="absolute left-1/2 -translate-x-1/2 text-[13px] font-medium text-white/70 pointer-events-none">
          {title}
        </span>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-auto bg-[rgba(28,28,30,0.92)]">
        {children}
      </div>
    </motion.div>
  )
}
