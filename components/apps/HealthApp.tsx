'use client'

import { useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { useWindow } from '@/components/desktop/Window'
import { useScrollbarActivity } from '@/hooks/useScrollbarActivity'
import { useTranslation } from '@/lib/i18n/useTranslation'
import { HEALTH_SNAPSHOT } from './health/healthData'
import { HealthOverview } from './health/HealthOverview'
import { HealthSectionView } from './health/HealthSectionView'
import { HealthSidebar } from './health/HealthSidebar'
import { HealthToolbar } from './health/HealthToolbar'
import type { HealthSectionId } from './health/healthTypes'

const HEALTH_FALLBACK_TEXT: Record<string, string> = {
  'health.section.overview': 'Overview',
  'health.section.training': 'Training',
  'health.section.prs': 'PRs',
  'health.section.nutrition': 'Nutrition',
  'health.section.recovery': 'Recovery',
  'health.hero.title': 'Lean bulk progress',
  'health.hero.detail': 'Steady gain with good adherence this month.',
  'health.hero.targetLabel': 'Target',
  'health.hero.perWeek': '/ week',
  'health.hero.adherenceLabel': 'adherence',
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
  'health.value.benchPress110': 'Bench Press 110 kg',
  'health.value.splitPushPullLegs': 'Push / Pull / Legs',
  'health.value.trainingLoadModeratePlus': 'Moderate+',
  'health.value.fatigueLow': 'Low',
  'health.detail.7DayAverage': '7-day average',
  'health.detail.target3450Calories': 'Target 3,450 kcal',
  'health.detail.target180Protein': 'Target 180 g',
  'health.detail.lastNight': 'Last night',
  'health.detail.thisWeek': 'This week',
  'health.detail.prVsLast': '+2.5 kg vs last PR',
  'health.detail.readyUpperTomorrow': 'Ready to push upper body tomorrow',
  'health.detail.completedThisWeek': 'Completed this week',
  'health.detail.nextPull': 'Next: Pull',
  'health.detail.goodRecoveryMargin': 'Good recovery margin',
  'health.detail.oneRepMax': '1RM',
  'health.detail.trend30Days': '30-day trend',
  'health.detail.readyToTrain': 'Ready to train',
  'health.detail.legSorenessImproving': 'Leg soreness improving',
  'health.section.trainingIntro': 'Recent work and workload balance.',
  'health.section.prsIntro': 'Current strength standards and recent records.',
  'health.section.nutritionIntro': 'Lean bulk intake and bodyweight direction.',
  'health.section.recoveryIntro': 'Sleep, readiness, and recovery signal.',
}

export function HealthApp() {
  const { dragControls } = useWindow()
  const { t } = useTranslation()
  const sidebarScrollbarRef = useScrollbarActivity<HTMLElement>()
  const contentScrollbarRef = useScrollbarActivity<HTMLElement>()
  const [history, setHistory] = useState<HealthSectionId[]>(['overview'])
  const [historyIdx, setHistoryIdx] = useState(0)

  const activeSection = history[historyIdx]

  const translate = (key: string) => {
    const translated = t(key)
    return translated === key ? (HEALTH_FALLBACK_TEXT[key] ?? key) : translated
  }

  const onDragStart = (event: ReactPointerEvent) => {
    dragControls.start(event)
  }

  const navigateTo = (section: HealthSectionId) => {
    if (section === activeSection) return
    const nextHistory = history.slice(0, historyIdx + 1)
    nextHistory.push(section)
    setHistory(nextHistory)
    setHistoryIdx(nextHistory.length - 1)
  }

  const goBack = () => {
    if (historyIdx > 0) {
      setHistoryIdx((current) => current - 1)
    }
  }

  const goForward = () => {
    if (historyIdx < history.length - 1) {
      setHistoryIdx((current) => current + 1)
    }
  }

  const activeSecondarySection = activeSection === 'overview' ? null : HEALTH_SNAPSHOT.sections[activeSection]

  return (
    <div className="h-full flex p-2 gap-2 overflow-hidden text-foreground font-sans bg-background">
      <HealthSidebar
        appTitle={t('app.health')}
        activeSection={activeSection}
        translate={translate}
        onSelect={navigateTo}
        onDragStart={onDragStart}
        scrollbarRef={sidebarScrollbarRef}
      />

      <div className="flex-1 flex flex-col bg-black/[0.02] dark:bg-black/[0.03] dark:bg-white/[0.02] rounded-2xl border border-border-subtle overflow-hidden">
        <HealthToolbar
          title={translate(`health.section.${activeSection}`)}
          canBack={historyIdx > 0}
          canForward={historyIdx < history.length - 1}
          onBack={goBack}
          onForward={goForward}
          onDragStart={onDragStart}
        />

        <main
          ref={contentScrollbarRef}
          className="app-scrollbar flex-1 overflow-y-auto overscroll-contain cursor-default"
        >
          {activeSection === 'overview' ? (
            <HealthOverview snapshot={HEALTH_SNAPSHOT} translate={translate} />
          ) : activeSecondarySection ? (
            <HealthSectionView
              title={translate(activeSecondarySection.titleKey)}
              intro={translate(activeSecondarySection.introKey)}
              cards={activeSecondarySection.cards}
              translate={translate}
            />
          ) : null}
        </main>
      </div>
    </div>
  )
}
