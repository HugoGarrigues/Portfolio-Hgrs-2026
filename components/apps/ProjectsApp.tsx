'use client'

import { useState } from 'react'

// ─── Data ───────────────────────────────────────────────────────────────────

type Project = {
  id: string
  name: string
  category: 'Web' | 'AI' | 'OSS' | 'Design'
  description: string
  stack: string[]
  year: number
  url?: string
}

const PROJECTS: Project[] = [
  {
    id: 'portfolio',
    name: 'Portfolio macOS',
    category: 'Web',
    description:
      'Ce portfolio — une simulation de bureau macOS construite avec Next.js, Framer Motion et un système de fenêtres complet.',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    year: 2026,
    url: 'https://github.com/HugoGarrigues/portfolio',
  },
  {
    id: 'project-2',
    name: 'Projet à venir',
    category: 'AI',
    description:
      'Description du prochain projet. En cours de développement.',
    stack: ['TypeScript', 'Node.js'],
    year: 2025,
  },
  {
    id: 'project-3',
    name: 'Projet à venir',
    category: 'Web',
    description:
      'Description du prochain projet. En cours de développement.',
    stack: ['React', 'PostgreSQL'],
    year: 2025,
  },
]

const CATEGORIES = ['Tous', 'Web', 'AI', 'OSS', 'Design'] as const
type Filter = typeof CATEGORIES[number]

const CATEGORY_COLORS: Record<string, string> = {
  Web:    'bg-blue-500/20 text-blue-300',
  AI:     'bg-purple-500/20 text-purple-300',
  OSS:    'bg-green-500/20 text-green-300',
  Design: 'bg-orange-500/20 text-orange-300',
}

// ─── Component ───────────────────────────────────────────────────────────────

export function ProjectsApp() {
  const [filter, setFilter] = useState<Filter>('Tous')
  const [selected, setSelected] = useState<Project | null>(null)

  const visible = filter === 'Tous'
    ? PROJECTS
    : PROJECTS.filter((p) => p.category === filter)

  if (selected) {
    return <ProjectDetail project={selected} onBack={() => setSelected(null)} />
  }

  return (
    <div className="h-full flex bg-[#1c1c1e]">

      {/* Sidebar */}
      <aside className="w-44 shrink-0 bg-[#161618] border-r border-white/[0.06] p-3 flex flex-col gap-1">
        <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest px-2 mb-1">
          Catégories
        </p>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`text-left text-sm px-3 py-1.5 rounded-md transition-colors ${
              filter === cat
                ? 'bg-white/10 text-white'
                : 'text-white/50 hover:text-white/80 hover:bg-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </aside>

      {/* Main pane */}
      <div className="flex-1 overflow-y-auto p-5">
        <div className="grid grid-cols-2 gap-4">
          {visible.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => setSelected(project)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Card ────────────────────────────────────────────────────────────────────

function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group text-left p-4 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] hover:border-white/10 transition-all"
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-sm font-medium text-white leading-tight">{project.name}</span>
        <span className={`shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded ${CATEGORY_COLORS[project.category]}`}>
          {project.category}
        </span>
      </div>

      <p className="text-xs text-white/50 leading-relaxed mb-3 line-clamp-2">
        {project.description}
      </p>

      {/* Stack tags */}
      <div className="flex flex-wrap gap-1">
        {project.stack.map((s) => (
          <span key={s} className="text-[10px] text-white/40 bg-white/5 px-1.5 py-0.5 rounded">
            {s}
          </span>
        ))}
      </div>

      <p className="text-[10px] text-white/25 mt-3">{project.year}</p>
    </button>
  )
}

// ─── Detail ──────────────────────────────────────────────────────────────────

function ProjectDetail({ project, onBack }: { project: Project; onBack: () => void }) {
  return (
    <div className="h-full overflow-y-auto bg-[#1c1c1e] p-8 select-text">
      <button
        onClick={onBack}
        className="text-xs text-white/40 hover:text-white/70 transition-colors mb-6 flex items-center gap-1"
      >
        ← Retour
      </button>

      <div className="max-w-lg">
        <div className="flex items-center gap-3 mb-1">
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${CATEGORY_COLORS[project.category]}`}>
            {project.category}
          </span>
          <span className="text-xs text-white/30">{project.year}</span>
        </div>

        <h1 className="text-2xl font-semibold text-white mb-4">{project.name}</h1>

        <p className="text-sm text-white/70 leading-relaxed mb-6">{project.description}</p>

        <div className="mb-6">
          <h2 className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-2">Stack</h2>
          <div className="flex flex-wrap gap-2">
            {project.stack.map((s) => (
              <span key={s} className="text-xs text-white/70 bg-white/[0.08] px-2.5 py-1 rounded-md">
                {s}
              </span>
            ))}
          </div>
        </div>

        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            Voir sur GitHub →
          </a>
        )}
      </div>
    </div>
  )
}
