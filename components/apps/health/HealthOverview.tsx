import type { HealthSnapshot } from './healthTypes'
import { HealthMetricCard } from './HealthMetricCard'

export function HealthOverview({
  snapshot,
  translate,
}: {
  snapshot: HealthSnapshot
  translate: (key: string) => string
}) {
  return (
    <div className="p-5 sm:p-6 lg:p-7">
      <section className="rounded-[28px] border border-emerald-400/15 bg-gradient-to-br from-emerald-500/18 via-emerald-500/4 to-transparent p-6 shadow-xl shadow-black/10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/45">
          {translate(snapshot.hero.titleKey)}
        </p>
        <div className="mt-4 flex flex-wrap items-end gap-5">
          <div>
            <p className="text-[34px] font-semibold tracking-tight text-foreground/95">
              {snapshot.hero.currentWeight}
            </p>
            <p className="text-[12px] text-foreground/58">
              {translate('health.hero.targetLabel')} {snapshot.hero.targetWeight}
            </p>
          </div>
          <div className="flex flex-col gap-1 text-[12px] text-foreground/72">
            <span>
              {snapshot.hero.weeklyGain} {translate('health.hero.perWeek')}
            </span>
            <span>
              {snapshot.hero.adherence} {translate('health.hero.adherenceLabel')}
            </span>
          </div>
        </div>
        <p className="mt-4 text-[13px] text-foreground/72">
          {translate(snapshot.hero.detailKey)}
        </p>
      </section>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {snapshot.overviewCards.map((item) => (
            <HealthMetricCard key={item.id} item={item} translate={translate} />
          ))}
        </section>

        <aside className="grid gap-4">
          <HealthMetricCard item={snapshot.spotlight} translate={translate} />
          <HealthMetricCard item={snapshot.recoverySummary} translate={translate} />
          <article className="rounded-2xl border border-cyan-400/15 bg-gradient-to-br from-cyan-500/18 via-cyan-500/5 to-transparent p-4 shadow-lg shadow-black/10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/45">
              {translate(snapshot.insight.titleKey)}
            </p>
            <p className="mt-3 text-[14px] leading-relaxed text-foreground/82">
              {translate(snapshot.insight.bodyKey)}
            </p>
          </article>
        </aside>
      </div>
    </div>
  )
}
