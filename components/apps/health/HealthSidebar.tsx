import type { PointerEvent as ReactPointerEvent } from 'react'
import type { HealthSectionId } from './healthTypes'

function Ico({ d, className = '' }: { d: string; className?: string }) {
  return (
    <svg className={`shrink-0 ${className}`} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d={d} stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const ICONS: Record<HealthSectionId, string> = {
  overview: 'M2.5 3.5h11v9h-11zM5 12V7.5M8 12V5.5M11 12V9',
  training: 'M3 6.5h3l2-2 2 7 1.5-3H13',
  prs: 'M8 2.5 9.8 6.1l4 .6-2.9 2.8.7 3.9L8 11.5l-3.6 1.9.7-3.9L2.2 6.7l4-.6L8 2.5Z',
  nutrition: 'M5 2.5v5M11 2.5v5M5 7.5c0 3-1.2 4-2.5 5M11 7.5c0 3 1.2 4 2.5 5M5 2.5h6',
  recovery: 'M8 13c-2.8-1.8-4.5-3.7-4.5-6A2.5 2.5 0 0 1 8 5a2.5 2.5 0 0 1 4.5 2c0 2.3-1.7 4.2-4.5 6Z',
}

const HEALTH_SECTIONS: HealthSectionId[] = ['overview', 'training', 'prs', 'nutrition', 'recovery']

export function HealthSidebar({
  appTitle,
  activeSection,
  translate,
  onSelect,
  onDragStart,
  scrollbarRef,
}: {
  appTitle: string
  activeSection: HealthSectionId
  translate: (key: string) => string
  onSelect: (section: HealthSectionId) => void
  onDragStart: (event: ReactPointerEvent<HTMLElement>) => void
  scrollbarRef: (node: HTMLElement | null) => void
}) {
  return (
    <aside
      ref={scrollbarRef}
      onPointerDown={onDragStart}
      className="app-scrollbar w-[190px] shrink-0 flex flex-col pt-10 pb-3 overflow-y-auto overscroll-contain bg-black/5 dark:bg-black/[0.04] dark:bg-white/[0.04] backdrop-blur-3xl rounded-2xl border border-border-subtle shadow-xl cursor-grab active:cursor-grabbing"
    >
      <h3 className="px-5 mb-2 text-[10px] font-bold text-foreground/30 uppercase tracking-widest select-none">
        {appTitle}
      </h3>

      <div className="pointer-events-auto flex flex-col gap-0.5">
        {HEALTH_SECTIONS.map((section) => {
          const isActive = activeSection === section

          return (
            <button
              key={section}
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                onSelect(section)
              }}
              onPointerDown={(event) => event.stopPropagation()}
              className={`w-[calc(100%-16px)] flex items-center gap-3 mx-2 px-3 py-1.5 rounded-lg text-[13px] transition-all group ${
                isActive
                  ? 'bg-black/5 dark:bg-black/10 dark:bg-white/10 text-[var(--accent-color)] font-semibold'
                  : 'text-foreground/60 hover:bg-black/[0.05] dark:hover:bg-white/[0.08] hover:text-foreground'
              }`}
            >
              <div className={`shrink-0 flex items-center justify-center w-4 h-4 transition-colors ${
                isActive ? 'text-[var(--accent-color)]' : 'text-foreground/40 group-hover:text-foreground/70'
              }`}>
                <Ico d={ICONS[section]} className="w-full h-full" />
              </div>
              <span className="truncate">{translate(`health.section.${section}`)}</span>
            </button>
          )
        })}
      </div>
    </aside>
  )
}
