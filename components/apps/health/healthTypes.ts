export type HealthSectionId = 'overview' | 'training' | 'prs' | 'nutrition' | 'recovery'

export type HealthMetricTone = 'rose' | 'orange' | 'emerald' | 'cyan' | 'violet'

export type HealthMetricCardData = {
  id: string
  titleKey: string
  value: string
  valueKey?: string
  detailKey: string
  delta?: string
  deltaKey?: string
  tone: HealthMetricTone
}

export type HealthSectionSnapshot = {
  titleKey: string
  introKey: string
  cards: HealthMetricCardData[]
}

export type HealthSnapshot = {
  hero: {
    titleKey: string
    currentWeight: string
    targetWeight: string
    weeklyGain: string
    adherence: string
    detailKey: string
  }
  overviewCards: HealthMetricCardData[]
  spotlight: HealthMetricCardData
  recoverySummary: HealthMetricCardData
  insight: {
    titleKey: string
    bodyKey: string
  }
  sections: Record<Exclude<HealthSectionId, 'overview'>, HealthSectionSnapshot>
}
