import React, { createContext, useContext, type ReactNode } from 'react'
import { motion, useDragControls, DragControls, type PanInfo } from 'framer-motion'

// ─── Window Context ──────────────────────────────────────────────────────────

type WindowContextType = {
  dragControls: DragControls
  maximized: boolean
}

const WindowContext = createContext<WindowContextType | null>(null)

export function useWindow() {
  const ctx = useContext(WindowContext)
  if (!ctx) throw new Error('useWindow must be used within a Window component')
  return ctx
}

// ─── Types ───────────────────────────────────────────────────────────────────

export type WindowProps = {
  id: string
  title: string
  zIndex: number
  minimized: boolean
  maximized: boolean
  position: { x: number; y: number }
  size: { width: number; height: number }
  children: ReactNode
  disableMinimize?: boolean
  disableMaximize?: boolean
  onClose: (id: string) => void
  onMinimize: (id: string) => void
  onMaximize: (id: string) => void
  onMove: (id: string, position: { x: number; y: number }) => void
  onFocus: (id: string) => void
}

// ─── Traffic light button ──────────────────────────────────────────────────────

type TrafficLightProps = {
  label: string
  color: string
  hoverColor: string
  icon?: React.ReactNode
  onClick: (e: React.MouseEvent) => void
}

function TrafficLight({ label, color, hoverColor, icon, onClick }: TrafficLightProps) {
  return (
    <button
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation()
        onClick(e)
      }}
      className={`relative w-3 h-3 rounded-full ${color} ${hoverColor} transition-colors focus:outline-none group/btn flex items-center justify-center`}
    >
      <div className="opacity-0 group-hover/traffic:opacity-100 transition-opacity pointer-events-none text-black/40">
        {icon}
      </div>
    </button>
  )
}

const TrafficIcons = {
  Close: (
    <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
      <path d="M1 1L5 5M1 5L5 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  Minimize: (
    <svg width="6" height="1" viewBox="0 0 6 1" fill="none">
      <path d="M0 0.5H6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  Maximize: (
    <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
      <path d="M1 1V5H5V1H1ZM0 0H6V6H0V0Z" fill="currentColor" />
    </svg>
  ),
}

// ─── Window ────────────────────────────────────────────────────────────────────

export function Window({
  id,
  zIndex,
  minimized,
  maximized,
  position,
  size,
  children,
  disableMinimize,
  disableMaximize,
  onClose,
  onMinimize,
  onMaximize,
  onMove,
  onFocus,
}: WindowProps) {
  const dragControls = useDragControls()

  function handleDragEnd(_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    onMove(id, {
      x: Math.round(position.x + info.offset.x),
      y: Math.round(position.y + info.offset.y),
    })
  }

  return (
    <WindowContext.Provider value={{ dragControls, maximized }}>
      <motion.div
        data-minimized={minimized || undefined}
        data-maximized={maximized || undefined}
        drag={true}
        dragControls={dragControls}
        dragListener={false} // Disable default listener to avoid stealing events
        dragMomentum={false}
        dragElastic={0}
        onDragEnd={handleDragEnd}
        initial={{ x: position.x, opacity: 0, scale: 0.65, y: position.y + 40 }}
        animate={{
          x: position.x,
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
          maxWidth: '100vw',
          maxHeight: '100dvh',
          backgroundColor: '#161616',
          width: size.width,
          height: size.height,
        }}
        className="flex flex-col rounded-2xl overflow-hidden shadow-2xl shadow-black/60 isolate"
      >
        {/* Invisible default drag handle for areas not covered by app-specific handles */}
        <div
          onPointerDown={(e) => {
            dragControls.start(e)
          }}
          className="absolute top-0 left-0 right-0 h-10 select-none cursor-grab active:cursor-grabbing z-0"
        />

        {/* Traffic lights — fixed top overlay */}
        <div className="absolute top-2 left-2 w-32 h-12 flex items-center px-4 z-[100] pointer-events-none">
          <div className="flex items-center gap-2 pointer-events-auto group/traffic" onClick={(e) => e.stopPropagation()}>
            <TrafficLight
              label="Close"
              color="bg-[#FF5F56]"
              hoverColor="hover:bg-[#FF5F56]/80"
              icon={TrafficIcons.Close}
              onClick={() => onClose(id)}
            />
            <TrafficLight
              label="Minimize"
              color={disableMinimize ? 'bg-black/20 dark:bg-white/20' : 'bg-[#FFBD2E]'}
              hoverColor={disableMinimize ? '' : 'hover:bg-[#FFBD2E]/80'}
              icon={disableMinimize ? undefined : TrafficIcons.Minimize}
              onClick={() => { if (!disableMinimize) onMinimize(id) }}
            />
            <TrafficLight
              label="Maximize"
              color={disableMaximize ? 'bg-black/20 dark:bg-white/20' : 'bg-[#27C93F]'}
              hoverColor={disableMaximize ? '' : 'hover:bg-[#27C93F]/80'}
              icon={disableMaximize ? undefined : TrafficIcons.Maximize}
              onClick={() => { if (!disableMaximize) onMaximize(id) }}
            />
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-auto bg-transparent relative z-10 w-full h-full">
          {children}
        </div>
      </motion.div>
    </WindowContext.Provider>
  )
}
