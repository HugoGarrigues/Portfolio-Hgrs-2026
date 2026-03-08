'use client'

import { useState, useRef } from 'react'
import { useWindowManager } from '@/contexts/WindowManagerContext'
import { APPS } from '@/lib/apps'
import { useWindow } from '@/components/desktop/Window'
import { getProjects, getProjectsByCategory, type Project, type ProjectStatus } from '@/lib/projects'

// ─── Icons ────────────────────────────────────────────────────────────────────

function Ico({ d, className = '' }: { d: string; className?: string }) {
  return (
    <svg className={`shrink-0 ${className}`} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d={d} stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const ICONS = {
  clock:    'M8 2.5a5.5 5.5 0 1 0 0 11A5.5 5.5 0 0 0 8 2.5Zm0 2v3.25l2.1 1.4',
  download: 'M8 2v8M5 7l3 3 3-3M3 13h10',
  monitor:  'M2 3.5h12v7H2zM6 12.5h4M8 10.5v2',
  doc:      'M4 1.5h5.5l3 3V14a.5.5 0 0 1-.5.5H4a.5.5 0 0 1-.5-.5V2a.5.5 0 0 1 .5-.5Zm5.5 0V4.5H12',
  stack:    'M8 2.5 2.5 5.5l5.5 3 5.5-3L8 2.5ZM2.5 9.5l5.5 3 5.5-3',
  chevL:    'M10 3.5 6 8l4 4.5',
  chevR:    'M6 3.5 10 8l-4 4.5',
  folder:   'M2 4.5a1 1 0 0 1 1-1h3.586a1 1 0 0 1 .707.293L8.414 5H13a1 1 0 0 1 1 1V12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4.5Z',
  globe:    'M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM1.5 8h13M8 1.5C6 4 5 6 5 8s1 4 3 6.5M8 1.5C10 4 11 6 11 8s-1 4-3 6.5',
  brain:    'M5 8a3 3 0 0 1 6 0v1a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1ZM3 10a5 5 0 0 1 10 0M8 5v2',
  file:     'M4 1.5h5.5l3 3V14a.5.5 0 0 1-.5.5H4a.5.5 0 0 1-.5-.5V2a.5.5 0 0 1 .5-.5Zm5.5 0V4.5H12',
  github:   'M8 2a6 6 0 0 0-1.9 11.7c.3.05.4-.13.4-.28v-1.08c-1.67.36-2.02-.7-2.02-.7-.27-.7-.67-.88-.67-.88-.55-.37.04-.37.04-.37.6.04.92.62.92.62.54.92 1.4.65 1.75.5.05-.39.21-.65.38-.8-1.33-.15-2.73-.67-2.73-2.96 0-.65.23-1.18.62-1.6-.06-.15-.27-.76.06-1.58 0 0 .5-.16 1.65.62a5.7 5.7 0 0 1 3 0c1.14-.78 1.64-.62 1.64-.62.33.82.12 1.43.06 1.58.39.42.62.95.62 1.6 0 2.3-1.4 2.8-2.74 2.95.22.19.41.56.41 1.12v1.65c0 .16.11.34.42.28A6 6 0 0 0 8 2Z',
  link:     'M6.5 9.5a3 3 0 0 0 4.24.36l1.5-1.5a3 3 0 0 0-4.24-4.24L7 5M9.5 6.5a3 3 0 0 0-4.24-.36l-1.5 1.5a3 3 0 0 0 4.24 4.24L9 11',
}

// ─── Project display ──────────────────────────────────────────────────────────

const STATUS_STYLE: Record<ProjectStatus, string> = {
  'Deployed':    'bg-green-500/15 text-green-400 border border-green-500/20',
  'In Progress': 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20',
  'Concept':     'bg-white/10 text-white/35 border border-white/10',
}

// ─── Sidebar data ─────────────────────────────────────────────────────────────

type SectionId =
  | 'recents'
  | 'applications' | 'desktop' | 'documents' | 'downloads'
  | 'hgrs' | 'trash'
  | 'projects_all' | 'projects_web' | 'projects_ai' | 'projects_wip'

type NavItem = {
  id: SectionId
  label: string
  icon: keyof typeof ICONS | React.ReactNode
  color?: string
}

const SIDEBAR_SECTIONS: { title?: string; items: NavItem[] }[] = [
  {
    items: [
      { id: 'recents', label: 'Récents', icon: 'clock' },
    ],
  },
  {
    title: 'Favoris',
    items: [
      { id: 'applications', label: 'Applications',    icon: 'stack',  color: 'text-blue-500' },
      { id: 'desktop',      label: 'Bureau',          icon: 'monitor' },
      { id: 'documents',    label: 'Documents',       icon: 'doc' },
      { id: 'downloads',    label: 'Téléchargements', icon: 'download' },
    ],
  },
  {
    title: 'Projets',
    items: [
      { id: 'projects_all', label: 'Tous les projets', icon: 'folder', color: 'text-blue-400' },
      { id: 'projects_web', label: 'Web Apps',         icon: 'globe',  color: 'text-blue-400' },
      { id: 'projects_ai',  label: 'AI / Agentic',     icon: 'brain',  color: 'text-purple-400' },
      { id: 'projects_wip', label: 'In Progress',      icon: 'clock',  color: 'text-yellow-400' },
    ],
  },
  {
    title: 'Emplacements',
    items: [
      { id: 'hgrs',  label: 'hgrs',      icon: <Ico d="M3 3h10v10H3z" /> },
      { id: 'trash', label: 'Corbeille', icon: <Ico d="M3 4h10M5 4v9a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V4M6 4V3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1" /> },
    ],
  },
]

const SECTION_LABEL: Record<SectionId, string> = {
  recents:      'Récents',
  applications: 'Applications',
  desktop:      'Bureau',
  documents:    'Documents',
  downloads:    'Téléchargements',
  hgrs:         'hgrs',
  trash:        'Corbeille',
  projects_all: 'Tous les projets',
  projects_web: 'Web Apps',
  projects_ai:  'AI / Agentic',
  projects_wip: 'In Progress',
}

function isProjectSection(id: SectionId): boolean {
  return id === 'projects_all' || id === 'projects_web' || id === 'projects_ai' || id === 'projects_wip'
}

// ─── AppIcon (Applications grid) ──────────────────────────────────────────────

function AppIcon({ id, name, iconFile, selected, onSelect, onOpen }: {
  id: string
  name: string
  iconFile: string
  selected: boolean
  onSelect: (id: string) => void
  onOpen: (id: string) => void
}) {
  return (
    <div
      onClick={(e) => { e.stopPropagation(); onSelect(id) }}
      onDoubleClick={() => onOpen(id)}
      className="w-full flex flex-col items-center gap-1.5 group cursor-default select-none transition-transform active:scale-95"
    >
      <div className={`relative w-[50px] h-[50px] ${selected ? 'after:content-[""] after:absolute after:inset-[-4px] after:bg-white/10 after:rounded-xl' : ''}`}>
        <img
          src={`/icons/${iconFile}.png`}
          alt={name}
          className="w-full h-full object-contain"
          draggable={false}
        />
      </div>
      <span className={`text-[11px] leading-tight text-center px-1.5 py-0.5 rounded-[4px] break-words w-full transition-colors ${selected ? 'bg-blue-600 text-white' : 'text-white/90 font-medium group-hover:bg-white/10'}`}>
        {name}
      </span>
    </div>
  )
}

// ─── FinderApp ────────────────────────────────────────────────────────────────

export function FinderApp() {
  const { openWindow, recentApps } = useWindowManager()
  const { dragControls } = useWindow()

  const [active, setActive]   = useState<SectionId>('applications')
  const [selected, setSelected] = useState<string | null>(null)
  const [detail, setDetail]   = useState<Project | null>(null)

  const [history, setHistory]       = useState<SectionId[]>(['applications'])
  const [historyIdx, setHistoryIdx] = useState(0)

  const containerRef = useRef<HTMLDivElement>(null)
  const displayApps  = APPS.filter(app => app.id !== 'finder')

  const filteredProjects = isProjectSection(active) ? (() => {
    if (active === 'projects_all') return getProjects()
    if (active === 'projects_wip') return getProjectsByCategory('in-progress')
    if (active === 'projects_web') return getProjectsByCategory('web-apps')
    if (active === 'projects_ai')  return getProjectsByCategory('ai-agentic')
    return []
  })() : []

  const navigateTo = (id: SectionId) => {
    if (active === id) return
    setActive(id)
    setSelected(null)
    setDetail(null)
    const newHistory = history.slice(0, historyIdx + 1)
    newHistory.push(id)
    setHistory(newHistory)
    setHistoryIdx(newHistory.length - 1)
  }

  const goBack = () => {
    if (detail) { setDetail(null); setSelected(null); return }
    if (historyIdx > 0) {
      const newIdx = historyIdx - 1
      setHistoryIdx(newIdx)
      setActive(history[newIdx])
      setSelected(null)
    }
  }

  const goForward = () => {
    if (historyIdx < history.length - 1) {
      const newIdx = historyIdx + 1
      setHistoryIdx(newIdx)
      setActive(history[newIdx])
    }
  }

  const canBack    = historyIdx > 0 || !!detail
  const canForward = !detail && historyIdx < history.length - 1

  const onDragStart = (e: React.PointerEvent) => dragControls.start(e)

  return (
    <div ref={containerRef} className="h-full flex p-2 gap-2 overflow-hidden text-white font-sans bg-[#161616]">

      {/* ── Sidebar ── */}
      <aside
        onPointerDown={onDragStart}
        className="w-[190px] shrink-0 flex flex-col pt-10 pb-3 overflow-y-auto bg-white/[0.04] backdrop-blur-3xl rounded-2xl border border-white/[0.05] shadow-xl cursor-grab active:cursor-grabbing"
      >
        {SIDEBAR_SECTIONS.map((section, idx) => (
          <div key={idx} className="mb-4 pointer-events-none">
            {section.title && (
              <h3 className="px-5 mb-2 text-[10px] font-bold text-white/20 uppercase tracking-widest select-none">
                {section.title}
              </h3>
            )}
            <div className="pointer-events-auto flex flex-col gap-0.5">
              {section.items.map((item) => (
                <NavBtn
                  key={item.id}
                  item={item}
                  active={active}
                  onSelect={navigateTo}
                />
              ))}
            </div>
          </div>
        ))}
      </aside>

      {/* ── Main island ── */}
      <div className="flex-1 flex flex-col bg-white/[0.02] rounded-2xl border border-white/[0.03] overflow-hidden">

        {/* Toolbar */}
        <nav
          onPointerDown={onDragStart}
          className="h-12 flex items-center px-6 gap-6 select-none border-b border-white/[0.03] cursor-grab active:cursor-grabbing"
        >
          <div
            className="flex items-center gap-1.5 pointer-events-auto cursor-default"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <button
              onClick={(e) => { e.stopPropagation(); goBack() }}
              disabled={!canBack}
              className={`p-1 px-2.5 bg-white/[0.05] border border-white/[0.05] rounded-lg transition-all active:scale-95 flex items-center justify-center shadow-lg shadow-black/20 ${!canBack ? 'opacity-10 cursor-default' : 'hover:bg-white/[0.12] active:bg-white/[0.2] cursor-default'}`}
            >
              <Ico d={ICONS.chevL} className="w-4 h-4 text-white/70" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goForward() }}
              disabled={!canForward}
              className={`p-1 px-2.5 bg-white/[0.05] border border-white/[0.05] rounded-lg transition-all active:scale-95 flex items-center justify-center shadow-lg shadow-black/20 ${!canForward ? 'opacity-10 cursor-default' : 'hover:bg-white/[0.12] active:bg-white/[0.2] cursor-default'}`}
            >
              <Ico d={ICONS.chevR} className="w-4 h-4 text-white/70" />
            </button>
          </div>
          <span
            onPointerDown={(e) => e.stopPropagation()}
            className="text-[13px] font-bold text-white/95 tracking-tight pointer-events-auto cursor-default"
          >
            {detail ? detail.name : SECTION_LABEL[active]}
          </span>
        </nav>

        {/* Content */}
        <main
          className="flex-1 overflow-y-auto cursor-default"
          onClick={() => setSelected(null)}
        >
          {isProjectSection(active) ? (
            detail ? (
              <ProjectDetail project={detail} />
            ) : (
              <ProjectList
                projects={filteredProjects}
                selected={selected}
                onSelect={setSelected}
                onOpen={setDetail}
              />
            )
          ) : active === 'applications' ? (
            <div className="grid grid-cols-[repeat(auto-fill,80px)] gap-10 p-8 place-items-center">
              {displayApps.map((app) => (
                <AppIcon
                  key={app.id}
                  id={app.id}
                  name={app.label}
                  iconFile={app.iconFile}
                  selected={selected === app.id}
                  onSelect={setSelected}
                  onOpen={(id) => openWindow(id as any)}
                />
              ))}
            </div>
          ) : active === 'recents' ? (
            <div className="flex flex-col h-full">
              {recentApps.length > 0 ? (
                <div className="grid grid-cols-[repeat(auto-fill,80px)] gap-10 p-8 place-items-center">
                  {recentApps.map((recent, i) => {
                    const app = APPS.find(a => a.id === recent.id)
                    if (!app) return null
                    return (
                      <AppIcon
                        key={`${recent.id}-${i}`}
                        id={recent.id}
                        name={app.label}
                        iconFile={app.iconFile}
                        selected={selected === recent.id}
                        onSelect={setSelected}
                        onOpen={(id) => openWindow(id as any)}
                      />
                    )
                  })}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-white/10 text-[13px] font-medium tracking-tight uppercase">
                  Aucun élément récent
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-white/10 text-[13px] font-medium tracking-tight uppercase">
              Aucun élément
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

// ─── ProjectList ──────────────────────────────────────────────────────────────

function ProjectList({ projects, selected, onSelect, onOpen }: {
  projects: Project[]
  selected: string | null
  onSelect: (id: string | null) => void
  onOpen: (p: Project) => void
}) {
  if (projects.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-white/10 text-[13px] font-medium tracking-tight uppercase">
        Aucun projet
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {/* Column headers */}
      <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,2fr)_80px_120px] gap-4 px-6 py-2 border-b border-white/[0.04] select-none">
        <span className="text-[11px] font-semibold text-white/25 uppercase tracking-widest">Nom</span>
        <span className="text-[11px] font-semibold text-white/25 uppercase tracking-widest">Stack</span>
        <span className="text-[11px] font-semibold text-white/25 uppercase tracking-widest">Année</span>
        <span className="text-[11px] font-semibold text-white/25 uppercase tracking-widest">Statut</span>
      </div>

      {projects.map((project) => (
        <ProjectRow
          key={project.id}
          project={project}
          selected={selected === project.id}
          onSelect={() => onSelect(project.id)}
          onOpen={() => onOpen(project)}
        />
      ))}
    </div>
  )
}

// ─── ProjectRow ───────────────────────────────────────────────────────────────

function ProjectRow({ project, selected, onSelect, onOpen }: {
  project: Project
  selected: boolean
  onSelect: () => void
  onOpen: () => void
}) {
  return (
    <div
      onClick={(e) => { e.stopPropagation(); onSelect() }}
      onDoubleClick={onOpen}
      className={`grid grid-cols-[minmax(0,2fr)_minmax(0,2fr)_80px_120px] gap-4 items-center px-6 py-2.5 border-b border-white/[0.025] select-none transition-colors ${
        selected ? 'bg-blue-600/20' : 'hover:bg-white/[0.03]'
      }`}
    >
      {/* Name + tagline */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="shrink-0 w-5 h-5 text-blue-400/60">
          <Ico d={ICONS.file} className="w-full h-full" />
        </div>
        <div className="min-w-0">
          <p className={`text-[13px] font-medium truncate leading-tight ${selected ? 'text-white' : 'text-white/90'}`}>
            {project.name}
          </p>
          <p className="text-[10px] text-white/38 truncate">{project.tagline}</p>
        </div>
      </div>

      {/* Stack badges */}
      <div className="flex items-center gap-1 min-w-0">
        {project.stack.slice(0, 2).map((t) => (
          <span key={t} className="shrink-0 text-[10px] text-white/38 bg-white/[0.05] px-1.5 py-0.5 rounded">
            {t}
          </span>
        ))}
        {project.stack.length > 2 && (
          <span className="text-[10px] text-white/25 shrink-0">+{project.stack.length - 2}</span>
        )}
      </div>

      {/* Year */}
      <span className="text-[12px] text-white/38">{project.year}</span>

      {/* Status */}
      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full w-fit ${STATUS_STYLE[project.status]}`}>
        {project.status}
      </span>
    </div>
  )
}

// ─── ProjectDetail ────────────────────────────────────────────────────────────

function ProjectDetail({ project }: { project: Project }) {
  return (
    <div className="p-8 select-text">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLE[project.status]}`}>
            {project.status}
          </span>
          <span className="text-[11px] text-white/25">{project.year}</span>
        </div>
        <h1 className="text-2xl font-semibold text-white leading-tight mb-1">{project.name}</h1>
        <p className="text-sm text-white/38">{project.tagline}</p>
      </div>

      {/* Description */}
      <p className="text-[13px] text-white/60 leading-relaxed mb-8 max-w-lg">
        {project.description}
      </p>

      {/* Stack */}
      <div className="mb-8">
        <h2 className="text-[10px] font-semibold text-white/25 uppercase tracking-widest mb-3">Stack</h2>
        <div className="flex flex-wrap gap-2">
          {project.stack.map((t) => (
            <span key={t} className="text-xs text-white/60 bg-white/[0.07] px-2.5 py-1 rounded-md">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Links */}
      {(project.links.github || project.links.live) && (
        <div className="flex items-center gap-5">
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 text-[13px] text-blue-400 hover:text-blue-300 transition-colors"
            >
              <Ico d={ICONS.github} className="w-4 h-4" />
              GitHub
            </a>
          )}
          {project.links.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 text-[13px] text-white/45 hover:text-white/75 transition-colors"
            >
              <Ico d={ICONS.link} className="w-4 h-4" />
              Live demo
            </a>
          )}
        </div>
      )}
    </div>
  )
}

// ─── NavBtn ───────────────────────────────────────────────────────────────────

function NavBtn({
  item,
  active,
  onSelect,
}: {
  item: NavItem
  active: SectionId
  onSelect: (id: SectionId) => void
}) {
  const isSel = active === item.id
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onSelect(item.id) }}
      onPointerDown={(e) => e.stopPropagation()}
      className={`w-[calc(100%-16px)] flex items-center gap-3 mx-2 px-3 py-1.5 rounded-lg text-[13px] transition-all group ${isSel
        ? 'bg-white/10 text-white font-semibold'
        : 'text-white/60 hover:bg-white/5 hover:text-white/90'
      }`}
    >
      <div className={`shrink-0 flex items-center justify-center w-4 h-4 transition-colors ${isSel ? (item.color || 'text-blue-400') : 'text-white/40 group-hover:text-white/60'}`}>
        {typeof item.icon === 'string'
          ? <Ico d={ICONS[item.icon as keyof typeof ICONS]} className="w-full h-full" />
          : item.icon}
      </div>
      <span className="truncate">{item.label}</span>
    </button>
  )
}
