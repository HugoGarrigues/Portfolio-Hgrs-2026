import type { HealthMetricCardData } from './healthTypes'

const TONE_STYLES: Record<HealthMetricCardData['tone'], string> = {
  rose: 'border-rose-400/15 bg-gradient-to-br from-rose-500/20 via-rose-500/5 to-transparent',
  orange: 'border-orange-400/15 bg-gradient-to-br from-orange-500/20 via-orange-500/5 to-transparent',
  emerald: 'border-emerald-400/15 bg-gradient-to-br from-emerald-500/20 via-emerald-500/5 to-transparent',
  cyan: 'border-cyan-400/15 bg-gradient-to-br from-cyan-500/20 via-cyan-500/5 to-transparent',
  violet: 'border-violet-400/15 bg-gradient-to-br from-violet-500/20 via-violet-500/5 to-transparent',
}

export function HealthMetricCard({
  item,
  translate,
}: {
  item: HealthMetricCardData
  translate: (key: string) => string
}) {
  const value = item.valueKey ? translate(item.valueKey) : item.value
  const detail = translate(item.detailKey)
  const delta = item.deltaKey ? translate(item.deltaKey) : item.delta

  return (
    <article className={`rounded-2xl border p-4 shadow-lg shadow-black/10 ${TONE_STYLES[item.tone]}`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/45">
        {translate(item.titleKey)}
      </p>
      <p className="mt-3 text-[24px] font-semibold tracking-tight text-foreground/95">{value}</p>
      <p className="mt-1 text-[12px] text-foreground/60">{detail}</p>
      {delta ? <p className="mt-3 text-[11px] font-medium text-foreground/72">{delta}</p> : null}
    </article>
  )
}
