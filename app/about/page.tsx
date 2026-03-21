import type { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd } from '@/components/seo/JsonLd'
import { buildMetadata } from '@/lib/seo'
import { siteConfig } from '@/lib/site'

export const metadata: Metadata = buildMetadata({
  title: 'À propos',
  description:
    "À propos de Hugo Garrigues: développeur full-stack basé à Aix-en-Provence, focalisé sur Next.js, TypeScript, interfaces ambitieuses et workflows agentiques.",
  pathname: '/about',
  keywords: ['à propos Hugo Garrigues', 'développeur full-stack Aix-en-Provence', 'agentic engineer France'],
})

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#eef2f6_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: siteConfig.personName,
          email: siteConfig.email,
          jobTitle: siteConfig.role,
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Aix-en-Provence',
            addressCountry: 'FR',
          },
          url: siteConfig.url,
          sameAs: [siteConfig.github],
        }}
      />

      <div className="mx-auto grid max-w-5xl gap-8">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-700">À propos</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
            {siteConfig.personName}, {siteConfig.role}.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">{siteConfig.about.summary}</p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <article className="rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-[0_16px_60px_rgba(15,23,42,0.05)]">
            <h2 className="text-2xl font-semibold text-slate-950">Ce que je cherche à construire</h2>
            <ul className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
              {siteConfig.about.principles.map((principle) => (
                <li key={principle} className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-cyan-500" />
                  <span>{principle}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-[1.75rem] border border-slate-200 bg-[#06131d] p-7 text-white shadow-[0_24px_80px_rgba(2,6,23,0.2)]">
            <h2 className="text-2xl font-semibold">Repères rapides</h2>
            <dl className="mt-5 grid gap-4 text-sm">
              <div>
                <dt className="text-slate-400">Base</dt>
                <dd className="mt-1 text-slate-100">{siteConfig.location}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Stack favorite</dt>
                <dd className="mt-1 text-slate-100">Next.js, React, TypeScript, Tailwind CSS, Framer Motion</dd>
              </div>
              <div>
                <dt className="text-slate-400">Aujourd’hui</dt>
                <dd className="mt-1 text-slate-100">Développeur Fullstack @Laroq</dd>
              </div>
            </dl>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/projects"
                className="inline-flex items-center rounded-full bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
              >
                Voir les projets
              </Link>
              <a
                href="/cv/hugo-garrigues-cv.pdf"
                className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Télécharger le CV
              </a>
            </div>
          </article>
        </section>
      </div>
    </main>
  )
}
