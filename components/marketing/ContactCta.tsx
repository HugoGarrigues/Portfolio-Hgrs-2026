import Link from 'next/link'
import { siteConfig } from '@/lib/site'

export function ContactCta() {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-slate-950 px-6 py-8 text-white shadow-[0_30px_90px_rgba(15,23,42,0.18)] sm:px-8 sm:py-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200/75">Contact</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            Besoin d’un portfolio distinctif, d’une interface sur-mesure ou d’un workflow IA bien pensé ?
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Je suis joignable à <a href={`mailto:${siteConfig.email}`} className="font-semibold text-cyan-200">{siteConfig.email}</a> pour des échanges freelance, produit ou collaboration.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
          >
            Aller à la page contact
          </Link>
          <Link
            href="/desktop"
            className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Lancer l’expérience desktop
          </Link>
        </div>
      </div>
    </section>
  )
}
