import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'
import { siteConfig } from '@/lib/site'

export const metadata: Metadata = buildMetadata({
  title: 'Contact',
  description:
    "Contactez Hugo Garrigues pour parler d'un projet web, d'une mission full-stack, d'une interface sur-mesure ou d'un workflow IA.",
  pathname: '/contact',
  keywords: ['contact développeur full-stack', 'contact Hugo Garrigues', 'mission Next.js France'],
})

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#eef2f6_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-700">Contact</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
            Discutons d’une interface ambitieuse, d’un produit web ou d’un besoin full-stack.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
            Je réponds aux demandes de collaboration, de mission, d’échange produit ou de revue de projet. Le plus rapide est de me contacter par email.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={`mailto:${siteConfig.email}`}
              className="inline-flex items-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              {siteConfig.email}
            </a>
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
            >
              GitHub
            </a>
          </div>
        </section>

        <aside className="rounded-[2rem] border border-slate-200 bg-[#06131d] p-8 text-white shadow-[0_24px_80px_rgba(2,6,23,0.2)]">
          <h2 className="text-2xl font-semibold">Autres accès</h2>
          <ul className="mt-5 space-y-4 text-sm leading-7 text-slate-300">
            <li>
              <span className="font-semibold text-white">Localisation:</span> {siteConfig.location}
            </li>
            <li>
              <span className="font-semibold text-white">Page projets:</span>{' '}
              <Link href="/projects" className="text-cyan-200 hover:text-cyan-100">
                /projects
              </Link>
            </li>
            <li>
              <span className="font-semibold text-white">Expérience immersive:</span>{' '}
              <Link href="/desktop" className="text-cyan-200 hover:text-cyan-100">
                /desktop
              </Link>
            </li>
          </ul>
        </aside>
      </div>
    </main>
  )
}
