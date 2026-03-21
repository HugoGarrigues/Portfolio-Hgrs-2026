import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { JsonLd } from '@/components/seo/JsonLd'
import { getProjectBySlug, getPublishedProjects } from '@/lib/projects'
import { buildMetadata, absoluteUrl } from '@/lib/seo'

type ProjectPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getPublishedProjects().map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) {
    return buildMetadata({
      title: 'Projet introuvable',
      pathname: `/projects/${slug}`,
      index: false,
    })
  }

  return buildMetadata({
    title: project.seoTitle,
    description: project.seoDescription,
    pathname: `/projects/${project.slug}`,
    image: `/projects/${project.slug}/opengraph-image`,
    keywords: project.keywords,
  })
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#eef2f6_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: project.name,
          description: project.seoDescription,
          url: absoluteUrl(`/projects/${project.slug}`),
          image: project.coverImage ? absoluteUrl(project.coverImage) : undefined,
          datePublished: `${project.year}-01-01`,
          creator: {
            '@type': 'Person',
            name: 'Hugo Garrigues',
          },
          keywords: project.keywords.join(', '),
          codeRepository: project.links.github ?? undefined,
        }}
      />

      <div className="mx-auto grid max-w-5xl gap-8">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.06)]">
          <div className="relative aspect-[16/8] bg-slate-950">
            {project.coverImage ? (
              <Image
                src={project.coverImage}
                alt={project.name}
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 grid gap-4 px-6 py-6 sm:px-8 sm:py-8">
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/80">
                <span>{project.theme}</span>
                <span>{project.year}</span>
                <span>{project.status}</span>
              </div>
              <div>
                <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">{project.name}</h1>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-200 sm:text-base">{project.description}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-[0_18px_70px_rgba(15,23,42,0.05)]">
            <h2 className="text-2xl font-semibold text-slate-950">Contexte et approche</h2>
            <div className="mt-5 grid gap-6 text-sm leading-7 text-slate-600">
              {project.contentSections.map((section) => (
                <section key={section.title}>
                  <h3 className="text-lg font-semibold text-slate-950">{section.title}</h3>
                  <div className="mt-3 grid gap-4">
                    {section.body.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </article>

          <aside className="grid gap-6">
            <section className="rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-[0_18px_70px_rgba(15,23,42,0.05)]">
              <h2 className="text-2xl font-semibold text-slate-950">Stack</h2>
              <div className="mt-5 flex flex-wrap gap-2">
                {project.stack.map((item) => (
                  <span key={item} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
                    {item}
                  </span>
                ))}
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-slate-200 bg-[#06131d] p-7 text-white shadow-[0_24px_80px_rgba(2,6,23,0.2)]">
              <h2 className="text-2xl font-semibold">Ce que le projet apporte</h2>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-300">
                {project.results.map((result) => (
                  <li key={result} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-cyan-300" />
                    <span>{result}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex flex-wrap gap-3">
                {project.links.github ? (
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center rounded-full bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
                  >
                    Voir le code
                  </a>
                ) : null}
                <Link
                  href="/projects"
                  className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Retour aux projets
                </Link>
              </div>
            </section>
          </aside>
        </section>
      </div>
    </main>
  )
}
