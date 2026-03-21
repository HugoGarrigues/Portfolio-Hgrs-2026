const skillGroups = [
  {
    title: 'Produit & interface',
    items: ['UI systems sur-mesure', 'Prototypage haute fidélité', 'Narration produit', 'Responsive mobile-first'],
  },
  {
    title: 'Front-end & perf',
    items: ['Next.js App Router', 'React 19', 'TypeScript strict', 'Framer Motion et optimisation'],
  },
  {
    title: 'Back-end & automation',
    items: ['API routes et services', 'Supabase', 'Workflows IA', 'Tooling local et agents'],
  },
]

export function Skills() {
  return (
    <section className="grid gap-6">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-700">Compétences</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
          Une pratique full-stack orientée qualité d’exécution, lisibilité produit et rapidité d’itération.
        </h2>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {skillGroups.map((group) => (
          <section key={group.title} className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.05)]">
            <h3 className="text-lg font-semibold text-slate-950">{group.title}</h3>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-600">
              {group.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-cyan-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  )
}
