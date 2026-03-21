import { siteConfig } from '@/lib/site'

export function Experience() {
  return (
    <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-[0_20px_70px_rgba(15,23,42,0.05)]">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-700">Approche</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
          Construire des interfaces remarquables, mais jamais au détriment de la clarté ou de la maintenabilité.
        </h2>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-600">{siteConfig.about.summary}</p>
      </div>

      <div className="rounded-[1.75rem] border border-slate-200 bg-[#06131d] p-7 text-slate-100 shadow-[0_24px_80px_rgba(2,6,23,0.25)]">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200/75">Aujourd’hui</p>
        <h3 className="mt-3 text-2xl font-semibold">{siteConfig.role}</h3>
        <p className="mt-2 text-sm text-slate-300">{siteConfig.location}</p>
        <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-300">
          {siteConfig.about.principles.map((principle) => (
            <li key={principle} className="flex gap-3">
              <span className="mt-2 h-2 w-2 rounded-full bg-cyan-300" />
              <span>{principle}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
