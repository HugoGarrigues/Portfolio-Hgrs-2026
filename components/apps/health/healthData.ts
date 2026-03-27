import type { HealthSnapshot } from './healthTypes'

export const HEALTH_SNAPSHOT: HealthSnapshot = {
  hero: {
    titleKey: 'health.hero.title',
    currentWeight: '81.4 kg',
    targetWeight: '86.0 kg',
    weeklyGain: '+0.24 kg / week',
    adherence: '89%',
    detailKey: 'health.hero.detail',
  },
  overviewCards: [
    { id: 'weight', titleKey: 'health.card.weight', value: '81.4 kg', detailKey: 'health.detail.7DayAverage', delta: '+0.3 kg', tone: 'rose' },
    { id: 'calories', titleKey: 'health.card.calories', value: '3,340 kcal', detailKey: 'health.detail.target3450Calories', delta: '-110 kcal', tone: 'orange' },
    { id: 'protein', titleKey: 'health.card.protein', value: '182 g', detailKey: 'health.detail.target180Protein', delta: '+2 g', tone: 'emerald' },
    { id: 'sleep', titleKey: 'health.card.sleep', value: '7 h 42', detailKey: 'health.detail.lastNight', delta: '+18 min', tone: 'cyan' },
    { id: 'volume', titleKey: 'health.card.volume', value: '84 sets', detailKey: 'health.detail.thisWeek', delta: '+6 sets', tone: 'violet' },
  ],
  spotlight: {
    id: 'pr',
    titleKey: 'health.card.prSpotlight',
    value: 'Bench Press 110 kg',
    valueKey: 'health.value.benchPress110',
    detailKey: 'health.detail.prVsLast',
    tone: 'rose',
  },
  recoverySummary: {
    id: 'overview-recovery',
    titleKey: 'health.card.recoverySummary',
    value: '78 / 100',
    detailKey: 'health.detail.readyUpperTomorrow',
    tone: 'emerald',
  },
  insight: {
    titleKey: 'health.card.insight',
    bodyKey: 'health.insight.today',
  },
  sections: {
    training: {
      titleKey: 'health.section.training',
      introKey: 'health.section.trainingIntro',
      cards: [
        { id: 'sessions', titleKey: 'health.card.sessions', value: '4 / 5', detailKey: 'health.detail.completedThisWeek', delta: '80%', tone: 'emerald' },
        { id: 'split', titleKey: 'health.card.splitFocus', value: 'Push / Pull / Legs', valueKey: 'health.value.splitPushPullLegs', detailKey: 'health.detail.nextPull', tone: 'cyan' },
        { id: 'load', titleKey: 'health.card.trainingLoad', value: 'Moderate+', valueKey: 'health.value.trainingLoadModeratePlus', detailKey: 'health.detail.goodRecoveryMargin', tone: 'orange' },
      ],
    },
    prs: {
      titleKey: 'health.section.prs',
      introKey: 'health.section.prsIntro',
      cards: [
        { id: 'bench', titleKey: 'health.card.bench', value: '110 kg', detailKey: 'health.detail.oneRepMax', delta: '+2.5 kg', tone: 'rose' },
        { id: 'squat', titleKey: 'health.card.squat', value: '150 kg', detailKey: 'health.detail.oneRepMax', delta: '+5 kg', tone: 'violet' },
        { id: 'deadlift', titleKey: 'health.card.deadlift', value: '190 kg', detailKey: 'health.detail.oneRepMax', delta: '+5 kg', tone: 'orange' },
      ],
    },
    nutrition: {
      titleKey: 'health.section.nutrition',
      introKey: 'health.section.nutritionIntro',
      cards: [
        { id: 'calories', titleKey: 'health.card.calories', value: '3,340 kcal', detailKey: 'health.detail.target3450Calories', delta: '-110 kcal', tone: 'orange' },
        { id: 'protein', titleKey: 'health.card.protein', value: '182 g', detailKey: 'health.detail.target180Protein', delta: '+2 g', tone: 'emerald' },
        { id: 'weightTrend', titleKey: 'health.card.weightTrend', value: '+1.1 kg', detailKey: 'health.detail.trend30Days', tone: 'rose' },
      ],
    },
    recovery: {
      titleKey: 'health.section.recovery',
      introKey: 'health.section.recoveryIntro',
      cards: [
        { id: 'sleep', titleKey: 'health.card.sleep', value: '7 h 42', detailKey: 'health.detail.lastNight', delta: '+18 min', tone: 'cyan' },
        { id: 'readiness', titleKey: 'health.card.readiness', value: '78 / 100', detailKey: 'health.detail.readyToTrain', tone: 'emerald' },
        { id: 'fatigue', titleKey: 'health.card.fatigue', value: 'Low', valueKey: 'health.value.fatigueLow', detailKey: 'health.detail.legSorenessImproving', tone: 'violet' },
      ],
    },
  },
}
