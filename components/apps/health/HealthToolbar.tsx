import type { PointerEvent as ReactPointerEvent } from 'react'

function Ico({ d, className = '' }: { d: string; className?: string }) {
  return (
    <svg className={`shrink-0 ${className}`} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d={d} stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const ICONS = {
  chevL: 'M10 3.5 6 8l4 4.5',
  chevR: 'M6 3.5 10 8l-4 4.5',
}

export function HealthToolbar({
  title,
  canBack,
  canForward,
  onBack,
  onForward,
  onDragStart,
}: {
  title: string
  canBack: boolean
  canForward: boolean
  onBack: () => void
  onForward: () => void
  onDragStart: (event: ReactPointerEvent<HTMLElement>) => void
}) {
  return (
    <nav
      onPointerDown={onDragStart}
      className="h-12 flex items-center px-6 gap-6 select-none border-b border-border-subtle cursor-grab active:cursor-grabbing"
    >
      <div
        className="flex items-center gap-1.5 pointer-events-auto cursor-default"
        onPointerDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Back"
          onClick={(event) => {
            event.stopPropagation()
            onBack()
          }}
          disabled={!canBack}
          className={`p-1 px-2.5 bg-black/[0.05] dark:bg-black/[0.05] dark:bg-white/[0.05] border border-border-subtle rounded-lg transition-all active:scale-95 flex items-center justify-center shadow-lg shadow-black/5 dark:shadow-black/20 ${
            !canBack ? 'opacity-10 cursor-default' : 'hover:bg-black/[0.08] dark:hover:bg-white/[0.12] active:bg-black/[0.12] dark:active:bg-white/[0.2] cursor-default'
          }`}
        >
          <Ico d={ICONS.chevL} className="w-4 h-4 text-foreground/70" />
        </button>
        <button
          type="button"
          aria-label="Forward"
          onClick={(event) => {
            event.stopPropagation()
            onForward()
          }}
          disabled={!canForward}
          className={`p-1 px-2.5 bg-black/[0.05] dark:bg-black/[0.05] dark:bg-white/[0.05] border border-border-subtle rounded-lg transition-all active:scale-95 flex items-center justify-center shadow-lg shadow-black/5 dark:shadow-black/20 ${
            !canForward ? 'opacity-10 cursor-default' : 'hover:bg-black/[0.08] dark:hover:bg-white/[0.12] active:bg-black/[0.12] dark:active:bg-white/[0.2] cursor-default'
          }`}
        >
          <Ico d={ICONS.chevR} className="w-4 h-4 text-foreground/70" />
        </button>
      </div>

      <span
        onPointerDown={(event) => event.stopPropagation()}
        className="text-[13px] font-bold text-foreground/95 tracking-tight pointer-events-auto cursor-default"
      >
        {title}
      </span>
    </nav>
  )
}
