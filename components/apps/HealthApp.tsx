'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useWindow } from '@/components/desktop/Window'
import { useScrollbarActivity } from '@/hooks/useScrollbarActivity'
import { useTheme } from '@/contexts/ThemeContext'

// ─── Icons ────────────────────────────────────────────────────────────────────

function Ico({ d, className = '' }: { d: string; className?: string }) {
  return (
    <svg className={`shrink-0 ${className}`} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d={d} stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const ICONS = {
  summary: 'M2 4.5a1 1 0 0 1 1-1h3.586a1 1 0 0 1 .707.293L8.414 5H13a1 1 0 0 1 1 1V12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4.5Z',
  activity: 'M8 2.5a5.5 5.5 0 1 0 0 11A5.5 5.5 0 0 0 8 2.5Zm0 2v3.25l2.1 1.4',
  nutrition: 'M4 1.5h5.5l3 3V14a.5.5 0 0 1-.5.5H4a.5.5 0 0 1-.5-.5V2a.5.5 0 0 1 .5-.5Zm5.5 0V4.5H12',
  workouts: 'M2 11.5l6 3 6-3M2 8l6 3 6-3M2 4.5l6 3 6-3M8 1.5L2 4.5l6 3 6-3z',
  sleep: 'M8 1.5v1.5M8 13v1.5M1.5 8h1.5M13 8h1.5M3.5 3.5l1 1M11.5 11.5l1 1M3.5 12.5l1-1M11.5 4.5l1-1M5.5 8a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0z',
  progress: 'M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM8 4.5v1M8 7v4',
  chevL: 'M10 3.5 6 8l4 4.5',
  chevR: 'M6 3.5 10 8l-4 4.5'
}

type SectionId = 'summary' | 'activity' | 'nutrition' | 'workouts' | 'sleep' | 'progress'

type NavItem = {
  id: SectionId
  label: string
  icon: keyof typeof ICONS
  activeColor: string
}

const SIDEBAR_SECTIONS: { title?: string; items: NavItem[] }[] = [
  {
    items: [
      { id: 'summary', label: 'Summary', icon: 'summary', activeColor: 'text-sky-500' },
    ],
  },
  {
    title: 'Categories',
    items: [
      { id: 'activity', label: 'Activity', icon: 'activity', activeColor: 'text-orange-500' },
      { id: 'nutrition', label: 'Nutrition', icon: 'nutrition', activeColor: 'text-lime-500' },
      { id: 'workouts', label: 'Workouts', icon: 'workouts', activeColor: 'text-rose-500' },
      { id: 'sleep', label: 'Sleep', icon: 'sleep', activeColor: 'text-violet-500' },
      { id: 'progress', label: 'Progress', icon: 'progress', activeColor: 'text-cyan-500' },
    ],
  },
]

type HealthCardMetric = {
  label: string
  value: string
  emphasisClass?: string
}

type HealthCard = {
  id: string
  title: string
  subtitle: string
  timestamp: string
  summary: string
  detail: string
  accentClass: string
  metrics?: HealthCardMetric[]
  visual?: 'bars' | 'trend' | 'ring'
}

const HEALTH_CARDS: Record<SectionId, HealthCard[]> = {
  summary: [
    {
      id: 'c1',
      title: 'Activity',
      subtitle: 'Daily movement',
      timestamp: '9:45 AM',
      summary: '9,860 steps',
      detail: '12 min incline walk after training',
      accentClass: 'text-orange-500',
      metrics: [
        { label: 'Move', value: '640 kcal' },
        { label: 'Cardio', value: '24 min' },
      ],
      visual: 'ring',
    },
    {
      id: 'c2',
      title: 'Calories & macros',
      subtitle: 'Nutrition',
      timestamp: 'Today',
      summary: '3,180 kcal',
      detail: '210g protein / 355g carbs / 88g fat',
      accentClass: 'text-lime-500',
      metrics: [
        { label: 'Protein', value: '210g', emphasisClass: 'text-lime-600 dark:text-lime-400' },
        { label: 'Carbs', value: '355g', emphasisClass: 'text-sky-600 dark:text-sky-400' },
        { label: 'Fat', value: '88g', emphasisClass: 'text-amber-600 dark:text-amber-400' },
      ],
    },
    {
      id: 'c3',
      title: 'Workout summary',
      subtitle: 'Push day',
      timestamp: '9:45 AM',
      summary: '75 min',
      detail: 'Chest, shoulders, triceps',
      accentClass: 'text-rose-500',
      metrics: [
        { label: 'Sets', value: '22' },
        { label: 'Volume', value: '14.2k' },
      ],
      visual: 'bars',
    },
    {
      id: 'c4',
      title: 'Sleep',
      subtitle: 'Recovery',
      timestamp: '7:13 AM',
      summary: '8h 12m',
      detail: 'Recovery trend is stable',
      accentClass: 'text-violet-500',
      visual: 'bars',
    },
  ],
  activity: [
    {
      id: 'a1',
      title: 'Activity',
      subtitle: 'Daily movement',
      timestamp: '9:45 AM',
      summary: '9,860 steps',
      detail: '12 min incline walk after training',
      accentClass: 'text-orange-500',
      metrics: [
        { label: 'Move', value: '640 kcal' },
        { label: 'Cardio', value: '24 min' },
      ],
      visual: 'ring',
    },
  ],
  nutrition: [
    {
      id: 'n1',
      title: 'Calories & macros',
      subtitle: 'Nutrition',
      timestamp: 'Today',
      summary: '3,180 kcal',
      detail: '210g protein / 355g carbs / 88g fat',
      accentClass: 'text-lime-500',
      metrics: [
        { label: 'Protein', value: '210g', emphasisClass: 'text-lime-600 dark:text-lime-400' },
        { label: 'Carbs', value: '355g', emphasisClass: 'text-sky-600 dark:text-sky-400' },
        { label: 'Fat', value: '88g', emphasisClass: 'text-amber-600 dark:text-amber-400' },
      ],
    },
  ],
  workouts: [
    {
      id: 'w1',
      title: 'Workout summary',
      subtitle: 'Push day',
      timestamp: '9:45 AM',
      summary: '75 min',
      detail: 'Chest, shoulders, triceps',
      accentClass: 'text-rose-500',
      metrics: [
        { label: 'Sets', value: '22' },
        { label: 'Volume', value: '14.2k' },
      ],
      visual: 'bars',
    },
  ],
  sleep: [
    {
      id: 's1',
      title: 'Sleep',
      subtitle: 'Recovery',
      timestamp: '7:13 AM',
      summary: '8h 12m',
      detail: 'Recovery trend is stable',
      accentClass: 'text-violet-500',
      visual: 'bars',
    },
  ],
  progress: [
    {
      id: 'p1',
      title: 'Weight trend',
      subtitle: 'Body composition',
      timestamp: 'Today',
      summary: '78.4 kg',
      detail: '+0.4 kg this week',
      accentClass: 'text-sky-500',
      visual: 'trend',
    },
    {
      id: 'p2',
      title: 'Progress',
      subtitle: 'Lean bulk',
      timestamp: 'Weekly',
      summary: 'Lean bulk on track',
      detail: '+0.4 kg this week',
      accentClass: 'text-cyan-500',
      visual: 'trend',
    },
  ],
}

// ─── NavBtn ───────────────────────────────────────────────────────────────────

function NavBtn({
  item,
  active,
  onSelect,
}: {
  item: NavItem
  active: SectionId
  onSelect: (id: SectionId) => void
}) {
  const isSel = active === item.id
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onSelect(item.id) }}
      onPointerDown={(e) => e.stopPropagation()}
      className={`w-[calc(100%-16px)] flex items-center gap-3 mx-2 px-3 py-1.5 rounded-lg text-[13px] transition-all group ${isSel
        ? `bg-black/5 dark:bg-black/10 dark:bg-white/10 ${item.activeColor} font-semibold`
        : 'text-foreground/60 hover:bg-black/[0.05] dark:hover:bg-white/[0.08] hover:text-foreground'
        }`}
    >
      <div className={`shrink-0 flex items-center justify-center w-4 h-4 transition-colors ${isSel ? item.activeColor : 'text-foreground/40 group-hover:text-foreground/70'}`}>
        <Ico d={ICONS[item.icon]} className="w-full h-full" />
      </div>
      <span className="truncate">{item.label}</span>
    </button>
  )
}

function CardVisual({ variant }: { variant?: HealthCard['visual'] }) {
  if (variant === 'ring') {
    return (
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[conic-gradient(from_210deg,_#fb923c_0_28%,_#38bdf8_28%_62%,_#f43f5e_62%_100%)] p-[5px] shadow-sm">
        <div className="h-full w-full rounded-full bg-white dark:bg-[#1a1c23]" />
      </div>
    )
  }

  if (variant === 'trend') {
    return (
      <div className="flex h-14 w-20 items-end gap-1">
        <span className="w-2 rounded-full bg-sky-300/80" style={{ height: '40%' }} />
        <span className="w-2 rounded-full bg-sky-400/85" style={{ height: '52%' }} />
        <span className="w-2 rounded-full bg-cyan-400/85" style={{ height: '58%' }} />
        <span className="w-2 rounded-full bg-cyan-500/90" style={{ height: '74%' }} />
        <span className="w-2 rounded-full bg-cyan-600/95" style={{ height: '100%' }} />
      </div>
    )
  }

  if (variant === 'bars') {
    return (
      <div className="flex h-14 w-20 items-end gap-1">
        <span className="w-2 rounded-full bg-foreground/10" style={{ height: '28%' }} />
        <span className="w-2 rounded-full bg-foreground/10" style={{ height: '48%' }} />
        <span className="w-2 rounded-full bg-foreground/10" style={{ height: '63%' }} />
        <span className="w-2 rounded-full bg-foreground/10" style={{ height: '40%' }} />
        <span className="w-2 rounded-full bg-[var(--accent-color)]" style={{ height: '92%' }} />
      </div>
    )
  }

  return null
}

function HealthSummaryCard({ card }: { card: HealthCard }) {
  return (
    <article className="group flex min-h-[166px] flex-col justify-between rounded-[28px] border border-black/[0.04] bg-white/60 p-5 shadow-sm backdrop-blur-3xl transition-all hover:bg-white/80 hover:shadow-md dark:border-white/[0.04] dark:bg-white/[0.02] dark:hover:bg-white/[0.04] cursor-default">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className={`text-[13px] font-semibold ${card.accentClass}`}>{card.title}</p>
          <p className="text-[12px] text-foreground/50">{card.subtitle}</p>
        </div>
        <p className="text-[12px] text-foreground/40">{card.timestamp}</p>
      </div>

      <div className="mt-4 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-[30px] font-semibold tracking-[-0.04em] text-foreground transition-transform group-hover:scale-[1.02] origin-left">{card.summary}</h3>
          <p className="mt-1 text-[13px] text-foreground/60">{card.detail}</p>
        </div>
        <div className="transition-transform group-hover:scale-105 origin-bottom">
            <CardVisual variant={card.visual} />
        </div>
      </div>

      {card.metrics ? (
        <div className="mt-5 flex flex-wrap gap-3 border-t border-black/5 pt-4 dark:border-white/[0.04]">
          {card.metrics.map((metric) => (
            <div key={metric.label} className="min-w-[84px]">
              <p className="text-[11px] uppercase tracking-[0.12em] text-foreground/40">{metric.label}</p>
              <p className={`mt-1 text-[14px] font-semibold text-foreground ${metric.emphasisClass ?? ''}`}>
                {metric.value}
              </p>
            </div>
          ))}
        </div>
      ) : null}
    </article>
  )
}

// ─── HealthApp ──────────────────────────────────────────────────────────────

export function HealthApp() {
  const { dragControls } = useWindow()
  const { reduceMotion } = useTheme()
  const sidebarScrollbarRef = useScrollbarActivity<HTMLElement>()
  const contentScrollbarRef = useScrollbarActivity<HTMLElement>()

  const [history, setHistory] = useState<SectionId[]>(['summary'])
  const [historyIdx, setHistoryIdx] = useState(0)

  const activeTab = history[historyIdx]

  const navigateTo = (id: SectionId) => {
    if (activeTab === id) return
    const newHistory = history.slice(0, historyIdx + 1)
    newHistory.push(id)
    setHistory(newHistory)
    setHistoryIdx(newHistory.length - 1)
  }

  const goBack = () => {
    if (historyIdx > 0) setHistoryIdx(historyIdx - 1)
  }

  const goForward = () => {
    if (historyIdx < history.length - 1) setHistoryIdx(historyIdx + 1)
  }

  const canBack = historyIdx > 0
  const canForward = historyIdx < history.length - 1

  const onDragStart = (e: React.PointerEvent) => {
    dragControls.start(e)
  }

  const currentSection = SIDEBAR_SECTIONS.flatMap(s => s.items).find(i => i.id === activeTab)
  const currentTitle = currentSection ? currentSection.label : ''
  const cards = HEALTH_CARDS[activeTab] || HEALTH_CARDS.summary

  return (
    <div className="h-full flex p-2 gap-2 overflow-hidden text-foreground font-sans bg-background">
      {/* ── Sidebar ── */}
      <aside
        ref={sidebarScrollbarRef}
        onPointerDown={onDragStart}
        className="app-scrollbar w-[190px] shrink-0 flex flex-col pt-10 pb-3 overflow-y-auto overscroll-contain bg-black/5 dark:bg-black/[0.04] dark:bg-white/[0.04] backdrop-blur-3xl rounded-2xl border border-border-subtle shadow-xl cursor-grab active:cursor-grabbing"
      >
        {SIDEBAR_SECTIONS.map((section, idx) => (
          <div key={idx} className="mb-4 pointer-events-none">
            {section.title && (
              <h3 className="px-5 mb-2 text-[10px] font-bold text-foreground/30 uppercase tracking-widest select-none">
                {section.title}
              </h3>
            )}
            <div className="pointer-events-auto flex flex-col gap-0.5">
              {section.items.map((item) => (
                <NavBtn
                  key={item.id}
                  item={item}
                  active={activeTab}
                  onSelect={navigateTo}
                />
              ))}
            </div>
          </div>
        ))}
      </aside>

      {/* ── Main Island ── */}
      <div className="flex-1 flex flex-col bg-black/[0.02] dark:bg-black/[0.03] dark:bg-white/[0.02] rounded-2xl border border-border-subtle overflow-hidden relative">
        {/* Toolbar */}
        <nav
          onPointerDown={onDragStart}
          className="h-12 flex items-center px-6 gap-6 select-none border-b border-border-subtle cursor-grab active:cursor-grabbing shrink-0"
        >
          <div
            className="flex items-center gap-1.5 pointer-events-auto cursor-default"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <button
              aria-label="Back"
              onClick={(e) => { e.stopPropagation(); goBack() }}
              disabled={!canBack}
              className={`p-1 px-2.5 bg-black/[0.05] dark:bg-black/[0.05] dark:bg-white/[0.05] border border-border-subtle rounded-lg transition-all active:scale-95 flex items-center justify-center shadow-lg shadow-black/5 dark:shadow-black/20 ${!canBack ? 'opacity-10 cursor-default' : 'hover:bg-black/[0.08] dark:hover:bg-white/[0.12] active:bg-black/[0.12] dark:active:bg-white/[0.2] cursor-default'}`}
            >
              <Ico d={ICONS.chevL} className="w-4 h-4 text-foreground/70" />
            </button>
            <button
              aria-label="Forward"
              onClick={(e) => { e.stopPropagation(); goForward() }}
              disabled={!canForward}
              className={`p-1 px-2.5 bg-black/[0.05] dark:bg-black/[0.05] dark:bg-white/[0.05] border border-border-subtle rounded-lg transition-all active:scale-95 flex items-center justify-center shadow-lg shadow-black/5 dark:shadow-black/20 ${!canForward ? 'opacity-10 cursor-default' : 'hover:bg-black/[0.08] dark:hover:bg-white/[0.12] active:bg-black/[0.12] dark:active:bg-white/[0.2] cursor-default'}`}
            >
              <Ico d={ICONS.chevR} className="w-4 h-4 text-foreground/70" />
            </button>
          </div>
          <span
            onPointerDown={(e) => e.stopPropagation()}
            className="text-[13px] font-bold text-foreground/95 tracking-tight pointer-events-auto cursor-default"
          >
            {currentTitle}
          </span>
        </nav>

        {/* Content Area */}
        <main ref={contentScrollbarRef} className="app-scrollbar flex-1 overflow-y-auto overscroll-contain p-6 sm:p-8 cursor-default flex flex-col items-center">
            
            {activeTab === 'summary' && (
                <div className="w-full max-w-4xl flex items-center gap-5 mb-8 bg-black/5 dark:bg-white/5 p-6 rounded-[28px] border border-black/5 dark:border-white/5 shadow-sm backdrop-blur-sm">
                    <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-white/20 shadow-lg dark:border-white/10 dark:shadow-black/50 shrink-0">
                        <Image src="/profile_picture.avif" alt="Hugo Garrigues" fill className="object-cover" />
                    </div>
                    <div>
                        <h1 className="text-[32px] font-bold tracking-[-0.04em] text-foreground leading-tight">Hugo Garrigues</h1>
                        <p className="text-[14px] font-medium text-foreground/50">Profil Santé</p>
                    </div>
                </div>
            )}

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: 10 }}
                    animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
                    exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: -10 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-5 pb-10"
                >
                    {cards.map(card => (
                        <HealthSummaryCard key={card.id} card={card} />
                    ))}
                </motion.div>
            </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
