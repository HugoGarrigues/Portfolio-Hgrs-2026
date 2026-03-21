import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { JsonLd } from '@/components/seo/JsonLd'
import { getPublishedProjects } from '@/lib/projects'
import { buildMetadata, absoluteUrl } from '@/lib/seo'
import { siteConfig } from '@/lib/site'

export const metadata: Metadata = buildMetadata({
  title: 'Projets',
  description:
    "Explorez les projets de Hugo Garrigues: interfaces immersives, expériences Next.js, workflows agentiques et études de cas full-stack.",
  pathname: '/projects',
  keywords: ['projets Next.js', 'portfolio React', 'études de cas frontend', 'portfolio full-stack'],
})

export default function ProjectsPage() {
  const projects = getPublishedProjects()

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#eef2f6_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Projets',
          url: absoluteUrl('/projects'),
          hasPart: projects.map((project) => ({
            '@type': 'CreativeWork',
            name: project.name,
            url: absoluteUrl(`/projects/${project.slug}`),
          })),
        }}
      />

      <div className="mx-auto grid max-w-6xl gap-8">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-700">Projets</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
            Études de cas, interfaces immersives et chantiers produits.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
            Cette page regroupe les projets publiés de {siteConfig.personName}, avec une lecture pensée pour l’indexation, le partage et la compréhension rapide de chaque sujet.
          </p>
        </section>

        <div className="grid gap-6">
          {projects.map((project) => (
            <article
              key={project.id}
              className="grid gap-0 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_18px_70px_rgba(15,23,42,0.08)] lg:grid-cols-[0.95fr_1.05fr]"
            >
              <div className="relative min-h-[260px] bg-slate-950">
                {project.coverImage ? (
                  <Image
                    src={project.coverImage}
                    alt={project.name}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 45vw, 100vw"
                  />
                ) : null}
              </div>

              <div className="grid gap-5 p-7">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">{project.theme}</p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{project.name}</h2>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{project.description}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {project.stack.map((item) => (
                    <span key={item} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
                      {item}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="inline-flex items-center rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Ouvrir l’étude de cas
                  </Link>
                  {project.links.github ? (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
                    >
                      GitHub
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
