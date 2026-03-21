import Link from 'next/link'
import { siteConfig } from '@/lib/site'

export function MobileSeoHero() {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#07111a] px-6 py-8 shadow-[0_30px_120px_rgba(0,0,0,0.45)] sm:px-10 sm:py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(69,180,255,0.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(120,255,214,0.16),transparent_30%)]" />
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="relative flex flex-col gap-8">
        <nav className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
          {siteConfig.navigation
            .filter((item) => item.href !== '/desktop')
            .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 transition hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
        </nav>

        <div className="grid gap-6">
          <div className="inline-flex w-fit items-center rounded-full border border-cyan-200/20 bg-cyan-200/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100">
            Experience desktop disponible sur ordinateur
          </div>

          <div className="max-w-3xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.32em] text-cyan-200/70">
              {siteConfig.hero.eyebrow}
            </p>
            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Une version mobile lisible pour explorer le portfolio, avant l&apos;experience desktop complete.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Depuis mobile, je te propose une lecture rapide des projets, de mon approche et de mon positionnement.
              Sur ordinateur, le portfolio s&apos;ouvre directement comme une vraie experience desktop immersive.
            </p>
          </div>

          <div className="grid gap-3 rounded-[1.5rem] border border-white/10 bg-white/6 p-5 backdrop-blur-sm">
            <p className="text-sm font-medium text-white">Ce que tu peux parcourir ici</p>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-300" />
                <span>Les projets publics et leurs etudes de cas detaillees</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-300" />
                <span>Mon approche full-stack, produit et agentic engineering</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-300" />
                <span>Des liens directs pour continuer sur desktop plus tard</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
          <Link
            href="/projects"
            className="inline-flex items-center justify-center rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
          >
            Voir les projets
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Me contacter
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center justify-center rounded-full border border-transparent px-5 py-3 text-sm font-semibold text-cyan-200 transition hover:text-cyan-100"
          >
            En savoir plus
          </Link>
        </div>
      </div>
    </section>
  )
}
