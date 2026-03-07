'use client'

// ─── About This Mac — portfolio style ──────────────────────────────────────

const SPECS = [
  { label: 'Nom',        value: 'Hugo Garrigues' },
  { label: 'Rôle',       value: 'Développeur Fullstack' },
  { label: 'Localisation', value: 'France — Remote friendly' },
  { label: 'Expérience', value: '3 ans de projets web & produits' },
]

const SKILLS = [
  { category: 'Frontend',   items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'] },
  { category: 'Backend',    items: ['Node.js', 'Express', 'Prisma', 'PostgreSQL'] },
  { category: '3D / XR',    items: ['Three.js', 'React Three Fiber', 'WebGL'] },
  { category: 'Tooling',    items: ['Git', 'Docker', 'Vercel', 'Vitest', 'Playwright'] },
]

export function AboutApp() {
  return (
    <div className="h-full overflow-y-auto bg-[#1c1c1e] text-white p-8 select-text">

      {/* Header — avatar + name */}
      <div className="flex flex-col items-center gap-4 pb-8 border-b border-white/10">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl font-bold shadow-xl">
          HG
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Hugo Garrigues</h1>
          <p className="text-sm text-white/50 mt-1">Développeur Fullstack · Designer de produit</p>
        </div>
      </div>

      {/* System info rows */}
      <div className="py-6 border-b border-white/10 space-y-3">
        {SPECS.map(({ label, value }) => (
          <div key={label} className="flex items-baseline gap-4 text-sm">
            <span className="w-28 shrink-0 text-white/40 text-right">{label}</span>
            <span className="text-white/90">{value}</span>
          </div>
        ))}
      </div>

      {/* Bio */}
      <div className="py-6 border-b border-white/10">
        <p className="text-sm text-white/70 leading-relaxed max-w-lg">
          Je construis des produits web modernes en mettant le design et
          l&apos;ingénierie sur un pied d&apos;égalité. Passionné par les
          interfaces animées, les systèmes bien architecturés et les petits
          détails qui font une grande différence.
        </p>
      </div>

      {/* Skills grid */}
      <div className="pt-6 grid grid-cols-2 gap-6">
        {SKILLS.map(({ category, items }) => (
          <div key={category}>
            <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">
              {category}
            </h2>
            <ul className="space-y-1">
              {items.map((item) => (
                <li key={item} className="text-sm text-white/80 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Footer links */}
      <div className="pt-8 flex items-center gap-6 text-xs text-white/40">
        <span>GitHub · github.com/HugoGarrigues</span>
        <span>·</span>
        <span>LinkedIn · hugo-garrigues</span>
      </div>
    </div>
  )
}
