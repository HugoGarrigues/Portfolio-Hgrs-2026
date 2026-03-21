import Image from 'next/image'
import Link from 'next/link'
import type { Project } from '@/lib/projects'

type FeaturedProjectsProps = {
  projects: Project[]
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  return (
    <section className="grid gap-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-700">Projets sélectionnés</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            Des projets conçus pour raconter une intention produit, pas seulement afficher une stack.
          </h2>
        </div>
        <Link href="/projects" className="text-sm font-semibold text-slate-700 transition hover:text-slate-950">
          Voir tous les projets
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {projects.map((project) => (
          <article
            key={project.id}
            className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_18px_70px_rgba(15,23,42,0.08)]"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
              {project.coverImage ? (
                <Image
                  src={project.coverImage}
                  alt={project.name}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  priority={false}
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-6 py-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/80">{project.theme}</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">{project.name}</h3>
                </div>
                <span className="rounded-full border border-white/15 bg-white/8 px-3 py-1 text-xs font-medium text-white/85">
                  {project.year}
                </span>
              </div>
            </div>

            <div className="grid gap-5 p-6">
              <p className="text-sm leading-7 text-slate-600">{project.excerpt}</p>

              <div className="flex flex-wrap gap-2">
                {project.stack.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/projects/${project.slug}`}
                  className="inline-flex items-center rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Étude de cas
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
    </section>
  )
}
