import type { HealthMetricCardData } from './healthTypes'
import { HealthMetricCard } from './HealthMetricCard'

export function HealthSectionView({
  title,
  intro,
  cards,
  translate,
}: {
  title: string
  intro: string
  cards: HealthMetricCardData[]
  translate: (key: string) => string
}) {
  return (
    <div className="p-5 sm:p-6 lg:p-7">
      <header className="mb-6">
        <h2 className="text-[28px] font-semibold tracking-tight text-foreground/95">{title}</h2>
        <p className="mt-2 max-w-2xl text-[14px] text-foreground/65">{intro}</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((item) => (
          <HealthMetricCard key={item.id} item={item} translate={translate} />
        ))}
      </div>
    </div>
  )
}
