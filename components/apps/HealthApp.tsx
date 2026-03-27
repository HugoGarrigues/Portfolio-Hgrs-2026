'use client'

import { useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { useWindow } from '@/components/desktop/Window'
import { useScrollbarActivity } from '@/hooks/useScrollbarActivity'
import { useTranslation } from '@/lib/i18n/useTranslation'
import { HEALTH_SNAPSHOT } from './health/healthData'
import type { HealthMetricCardData, HealthSectionId } from './health/healthTypes'

const HEALTH_SECTION_ORDER: HealthSectionId[] = ['overview', 'training', 'prs', 'nutrition', 'recovery']

const HEALTH_FALLBACK_TEXT: Record<string, string> = {
  'health.section.overview': 'Overview',
  'health.section.training': 'Training',
  'health.section.prs': 'PRs',
  'health.section.nutrition': 'Nutrition',
  'health.section.recovery': 'Recovery',
  'health.hero.title': 'Lean bulk progress',
  'health.hero.detail': 'Steady gain with good adherence this month.',
  'health.card.prSpotlight': 'PR spotlight',
  'health.card.recoverySummary': 'Recovery status',
  'health.card.insight': 'Insight of the day',
  'health.insight.today': 'Recovery is strong enough to push intensity on your next upper session.',
  'health.card.weight': 'Bodyweight',
  'health.card.calories': 'Calories',
  'health.card.protein': 'Protein',
  'health.card.sleep': 'Sleep',
  'health.card.volume': 'Weekly volume',
  'health.card.sessions': 'Sessions',
  'health.card.splitFocus': 'Split focus',
  'health.card.trainingLoad': 'Training load',
  'health.card.bench': 'Bench press',
  'health.card.squat': 'Squat',
  'health.card.deadlift': 'Deadlift',
  'health.card.weightTrend': 'Weight trend',
  'health.card.readiness': 'Readiness',
  'health.card.fatigue': 'Fatigue',
  'health.section.trainingIntro': 'Recent work and workload balance.',
  'health.section.prsIntro': 'Current strength standards and recent records.',
  'health.section.nutritionIntro': 'Lean bulk intake and bodyweight direction.',
  'health.section.recoveryIntro': 'Sleep, readiness, and recovery signal.',
}

function Ico({ d, className = '' }: { d: string; className?: string }) {
  return (
    <svg className={`shrink-0 ${className}`} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d={d} stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const ICONS = {
  overview: 'M2.5 3.5h11v9h-11zM5 12V7.5M8 12V5.5M11 12V9',
  training: 'M3 6.5h3l2-2 2 7 1.5-3H13',
  prs: 'M8 2.5 9.8 6.1l4 .6-2.9 2.8.7 3.9L8 11.5l-3.6 1.9.7-3.9L2.2 6.7l4-.6L8 2.5Z',
  nutrition: 'M5 2.5v5M11 2.5v5M5 7.5c0 3-1.2 4-2.5 5M11 7.5c0 3 1.2 4 2.5 5M5 2.5h6',
  recovery: 'M8 13c-2.8-1.8-4.5-3.7-4.5-6A2.5 2.5 0 0 1 8 5a2.5 2.5 0 0 1 4.5 2c0 2.3-1.7 4.2-4.5 6Z',
  chevL: 'M10 3.5 6 8l4 4.5',
  chevR: 'M6 3.5 10 8l-4 4.5',
}

const TONE_STYLES: Record<HealthMetricCardData['tone'], string> = {
  rose: 'border-rose-400/15 bg-gradient-to-br from-rose-500/20 via-rose-500/5 to-transparent',
  orange: 'border-orange-400/15 bg-gradient-to-br from-orange-500/20 via-orange-500/5 to-transparent',
  emerald: 'border-emerald-400/15 bg-gradient-to-br from-emerald-500/20 via-emerald-500/5 to-transparent',
  cyan: 'border-cyan-400/15 bg-gradient-to-br from-cyan-500/20 via-cyan-500/5 to-transparent',
  violet: 'border-violet-400/15 bg-gradient-to-br from-violet-500/20 via-violet-500/5 to-transparent',
}

function MetricCard({
  item,
  translate,
}: {
  item: HealthMetricCardData
  translate: (key: string) => string
}) {
  return (
    <article className={`rounded-2xl border p-4 shadow-lg shadow-black/10 ${TONE_STYLES[item.tone]}`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/45">
        {translate(item.titleKey)}
      </p>
      <p className="mt-3 text-[24px] font-semibold tracking-tight text-foreground/95">{item.value}</p>
      <p className="mt-1 text-[12px] text-foreground/60">{item.detail}</p>
      {item.delta ? <p className="mt-3 text-[11px] font-medium text-foreground/72">{item.delta}</p> : null}
    </article>
  )
}

export function HealthApp() {
  const { dragControls } = useWindow()
  const { t } = useTranslation()
  const sidebarScrollbarRef = useScrollbarActivity<HTMLElement>()
  const contentScrollbarRef = useScrollbarActivity<HTMLElement>()
  const [activeSection, setActiveSection] = useState<HealthSectionId>('overview')

  const translate = (key: string) => {
    const translated = t(key)
    return translated === key ? (HEALTH_FALLBACK_TEXT[key] ?? key) : translated
  }

  const onDragStart = (event: ReactPointerEvent) => {
    dragControls.start(event)
  }

  return (
    <div className="h-full flex p-2 gap-2 overflow-hidden text-foreground font-sans bg-background">
      <aside
        ref={sidebarScrollbarRef}
        onPointerDown={onDragStart}
        className="app-scrollbar w-[190px] shrink-0 flex flex-col pt-10 pb-3 overflow-y-auto overscroll-contain bg-black/5 dark:bg-black/[0.04] dark:bg-white/[0.04] backdrop-blur-3xl rounded-2xl border border-border-subtle shadow-xl cursor-grab active:cursor-grabbing"
      >
        <h3 className="px-5 mb-2 text-[10px] font-bold text-foreground/30 uppercase tracking-widest select-none">
          {t('app.health')}
        </h3>

        <div className="pointer-events-auto flex flex-col gap-0.5">
          {HEALTH_SECTION_ORDER.map((section) => {
            const isActive = activeSection === section

            return (
              <button
                key={section}
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  setActiveSection(section)
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

      <div className="flex-1 flex flex-col bg-black/[0.02] dark:bg-black/[0.03] dark:bg-white/[0.02] rounded-2xl border border-border-subtle overflow-hidden">
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
              disabled
              className="p-1 px-2.5 bg-black/[0.05] dark:bg-black/[0.05] dark:bg-white/[0.05] border border-border-subtle rounded-lg opacity-10"
            >
              <Ico d={ICONS.chevL} className="w-4 h-4 text-foreground/70" />
            </button>
            <button
              type="button"
              aria-label="Forward"
              disabled
              className="p-1 px-2.5 bg-black/[0.05] dark:bg-black/[0.05] dark:bg-white/[0.05] border border-border-subtle rounded-lg opacity-10"
            >
              <Ico d={ICONS.chevR} className="w-4 h-4 text-foreground/70" />
            </button>
          </div>

          <span
            onPointerDown={(event) => event.stopPropagation()}
            className="text-[13px] font-bold text-foreground/95 tracking-tight pointer-events-auto cursor-default"
          >
            {translate(`health.section.${activeSection}`)}
          </span>
        </nav>

        <main
          ref={contentScrollbarRef}
          className="app-scrollbar flex-1 overflow-y-auto overscroll-contain cursor-default"
        >
          <div className="p-5 sm:p-6 lg:p-7">
            <section className="rounded-[28px] border border-emerald-400/15 bg-gradient-to-br from-emerald-500/18 via-emerald-500/4 to-transparent p-6 shadow-xl shadow-black/10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/45">
                {translate(HEALTH_SNAPSHOT.hero.titleKey)}
              </p>
              <div className="mt-4 flex flex-wrap items-end gap-5">
                <div>
                  <p className="text-[34px] font-semibold tracking-tight text-foreground/95">
                    {HEALTH_SNAPSHOT.hero.currentWeight}
                  </p>
                  <p className="text-[12px] text-foreground/58">
                    Target {HEALTH_SNAPSHOT.hero.targetWeight}
                  </p>
                </div>
                <div className="flex flex-col gap-1 text-[12px] text-foreground/72">
                  <span>{HEALTH_SNAPSHOT.hero.weeklyGain}</span>
                  <span>{HEALTH_SNAPSHOT.hero.adherence} adherence</span>
                </div>
              </div>
              <p className="mt-4 text-[13px] text-foreground/72">
                {translate(HEALTH_SNAPSHOT.hero.detailKey)}
              </p>
            </section>

            <div className="mt-4 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {HEALTH_SNAPSHOT.overviewCards.map((item) => (
                  <MetricCard key={item.id} item={item} translate={translate} />
                ))}
              </section>

              <aside className="grid gap-4">
                <MetricCard item={HEALTH_SNAPSHOT.spotlight} translate={translate} />
                <MetricCard item={HEALTH_SNAPSHOT.recoverySummary} translate={translate} />
                <article className="rounded-2xl border border-cyan-400/15 bg-gradient-to-br from-cyan-500/18 via-cyan-500/5 to-transparent p-4 shadow-lg shadow-black/10">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/45">
                    {translate(HEALTH_SNAPSHOT.insight.titleKey)}
                  </p>
                  <p className="mt-3 text-[14px] leading-relaxed text-foreground/82">
                    {translate(HEALTH_SNAPSHOT.insight.bodyKey)}
                  </p>
                </article>
              </aside>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
