'use client'

import { useState, useRef } from 'react'
import { useWindowManager } from '@/contexts/WindowManagerContext'
import { APPS } from '@/lib/apps'
import { useWindow } from '@/components/desktop/Window'
import { useTranslation } from '@/lib/i18n/useTranslation'
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
  clock: 'M8 2.5a5.5 5.5 0 1 0 0 11A5.5 5.5 0 0 0 8 2.5Zm0 2v3.25l2.1 1.4',
  download: 'M8 2v8M5 7l3 3 3-3M3 13h10',
  monitor: 'M2 3.5h12v7H2zM6 12.5h4M8 10.5v2',
  doc: 'M4 1.5h5.5l3 3V14a.5.5 0 0 1-.5.5H4a.5.5 0 0 1-.5-.5V2a.5.5 0 0 1 .5-.5Zm5.5 0V4.5H12',
  stack: 'M8 2.5 2.5 5.5l5.5 3 5.5-3L8 2.5ZM2.5 9.5l5.5 3 5.5-3',
  chevL: 'M10 3.5 6 8l4 4.5',
  chevR: 'M6 3.5 10 8l-4 4.5',
  folder: 'M2 4.5a1 1 0 0 1 1-1h3.586a1 1 0 0 1 .707.293L8.414 5H13a1 1 0 0 1 1 1V12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4.5Z',
  globe: 'M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM1.5 8h13M8 1.5C6 4 5 6 5 8s1 4 3 6.5M8 1.5C10 4 11 6 11 8s-1 4-3 6.5',
  brain: 'M5 8a3 3 0 0 1 6 0v1a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1ZM3 10a5 5 0 0 1 10 0M8 5v2',
  file: 'M4 1.5h5.5l3 3V14a.5.5 0 0 1-.5.5H4a.5.5 0 0 1-.5-.5V2a.5.5 0 0 1 .5-.5Zm5.5 0V4.5H12',
  github: 'M8 2a6 6 0 0 0-1.9 11.7c.3.05.4-.13.4-.28v-1.08c-1.67.36-2.02-.7-2.02-.7-.27-.7-.67-.88-.67-.88-.55-.37.04-.37.04-.37.6.04.92.62.92.62.54.92 1.4.65 1.75.5.05-.39.21-.65.38-.8-1.33-.15-2.73-.67-2.73-2.96 0-.65.23-1.18.62-1.6-.06-.15-.27-.76.06-1.58 0 0 .5-.16 1.65.62a5.7 5.7 0 0 1 3 0c1.14-.78 1.64-.62 1.64-.62.33.82.12 1.43.06 1.58.39.42.62.95.62 1.6 0 2.3-1.4 2.8-2.74 2.95.22.19.41.56.41 1.12v1.65c0 .16.11.34.42.28A6 6 0 0 0 8 2Z',
  link: 'M6.5 9.5a3 3 0 0 0 4.24.36l1.5-1.5a3 3 0 0 0-4.24-4.24L7 5M9.5 6.5a3 3 0 0 0-4.24-.36l-1.5 1.5a3 3 0 0 0 4.24 4.24L9 11',
}

// ─── Project display ──────────────────────────────────────────────────────────

const STATUS_STYLE: Record<ProjectStatus, string> = {
  'Deployed': 'bg-green-500/15 text-green-600 dark:text-green-400 border border-green-500/20',
  'In Progress': 'bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20',
  'Concept': 'bg-black/5 dark:bg-black/10 dark:bg-white/10 text-black/40 dark:text-foreground/35 border border-black/10 dark:border-border-subtle',
}

// ─── Sidebar data ─────────────────────────────────────────────────────────────

type SectionId =
  | 'recents'
  | 'applications' | 'desktop' | 'documents' | 'trash'
  | 'projects_all' | 'projects_pro' | 'projects_personal' | 'projects_school'

type NavItem = {
  id: SectionId
  labelKey: string
  icon: keyof typeof ICONS | React.ReactNode
  color?: string
}

const SIDEBAR_SECTIONS: { titleKey?: string; items: NavItem[] }[] = [
  {
    items: [
      { id: 'recents', labelKey: 'finder.recents', icon: 'clock', color: 'text-[var(--accent-color)]' },
    ],
  },
  {
    titleKey: 'finder.favorites',
    items: [
      { id: 'applications', labelKey: 'finder.applications', icon: 'stack', color: 'text-[var(--accent-color)]' },
      { id: 'desktop', labelKey: 'finder.desktop', icon: 'monitor' },
      { id: 'documents', labelKey: 'finder.documents', icon: 'doc', color: 'text-[var(--accent-color)]' },
    ],
  },
  {
    titleKey: 'finder.projects',
    items: [
      { id: 'projects_all', labelKey: 'finder.allProjects', icon: 'folder', color: 'text-[var(--accent-color)]' },
      { id: 'projects_pro', labelKey: 'finder.pro', icon: 'globe', color: 'text-[var(--accent-color)]' },
      { id: 'projects_personal', labelKey: 'finder.personal', icon: 'brain', color: 'text-[var(--accent-color)]' },
      { id: 'projects_school', labelKey: 'finder.school', icon: 'stack', color: 'text-[var(--accent-color)]' },
    ],
  },
  {
    titleKey: 'finder.locations',
    items: [
      { id: 'trash', labelKey: 'finder.trash', icon: <Ico d="M3 4h10M5 4v9a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V4M6 4V3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1" /> },
    ],
  },
]

const SECTION_LABEL_KEY: Record<SectionId, string> = {
  recents: 'finder.recents',
  applications: 'finder.applications',
  desktop: 'finder.desktop',
  documents: 'finder.documents',
  trash: 'finder.trash',
  projects_all: 'finder.allProjects',
  projects_pro: 'finder.pro',
  projects_personal: 'finder.personal',
  projects_school: 'finder.school',
}

function isProjectSection(id: SectionId): boolean {
  return id === 'projects_all' || id === 'projects_pro' || id === 'projects_personal' || id === 'projects_school'
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
      <div className={`relative w-[50px] h-[50px] rounded-[22%] overflow-hidden ${selected ? 'after:content-[""] after:absolute after:inset-[-4px] after:bg-black/10 dark:bg-white/10 after:rounded-xl' : ''}`}>
        <img
          src={`/icons/${iconFile}.png`}
          alt={name}
          className={`w-full h-full object-contain ${id === 'settings' ? 'scale-[1.25]' : ''}`}
          draggable={false}
        />
      </div>
      <span className={`text-[11px] leading-tight text-center px-1.5 py-0.5 rounded-[4px] break-words w-full transition-colors ${selected ? 'bg-[var(--accent-color)] text-foreground' : 'text-foreground/90 font-medium'}`}>
        {name}
      </span>
    </div>
  )
}

// ─── FinderApp ────────────────────────────────────────────────────────────────

export function FinderApp() {
  const { openWindow, recentApps } = useWindowManager()
  const { dragControls } = useWindow()
  const { t } = useTranslation()

  const [active, setActive] = useState<SectionId>('applications')
  const [selected, setSelected] = useState<string | null>(null)
  const [detail, setDetail] = useState<Project | null>(null)

  const [history, setHistory] = useState<SectionId[]>(['applications'])
  const [historyIdx, setHistoryIdx] = useState(0)

  const containerRef = useRef<HTMLDivElement>(null)
  const displayApps = APPS.filter(app => app.id !== 'finder')

  const filteredProjects = isProjectSection(active) ? (() => {
    if (active === 'projects_all') return getProjects()
    if (active === 'projects_pro') return getProjectsByCategory('pro')
    if (active === 'projects_personal') return getProjectsByCategory('personal')
    if (active === 'projects_school') return getProjectsByCategory('school')
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

  const canBack = historyIdx > 0 || !!detail
  const canForward = !detail && historyIdx < history.length - 1

  const onDragStart = (e: React.PointerEvent) => dragControls.start(e)

  return (
    <div ref={containerRef} className="h-full flex p-2 gap-2 overflow-hidden text-foreground font-sans bg-background">

      {/* ── Sidebar ── */}
      <aside
        onPointerDown={onDragStart}
        className="w-[190px] shrink-0 flex flex-col pt-10 pb-3 overflow-y-auto bg-black/5 dark:bg-black/[0.04] dark:bg-white/[0.04] backdrop-blur-3xl rounded-2xl border border-border-subtle shadow-xl cursor-grab active:cursor-grabbing"
      >
        {SIDEBAR_SECTIONS.map((section, idx) => (
          <div key={idx} className="mb-4 pointer-events-none">
            {section.titleKey && (
              <h3 className="px-5 mb-2 text-[10px] font-bold text-foreground/30 uppercase tracking-widest select-none">
                {t(section.titleKey)}
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
      <div className="flex-1 flex flex-col bg-black/[0.02] dark:bg-black/[0.03] dark:bg-white/[0.02] rounded-2xl border border-border-subtle overflow-hidden">

        {/* Toolbar */}
        <nav
          onPointerDown={onDragStart}
          className="h-12 flex items-center px-6 gap-6 select-none border-b border-border-subtle cursor-grab active:cursor-grabbing"
        >
          <div
            className="flex items-center gap-1.5 pointer-events-auto cursor-default"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <button
              onClick={(e) => { e.stopPropagation(); goBack() }}
              disabled={!canBack}
              className={`p-1 px-2.5 bg-black/[0.05] dark:bg-black/[0.05] dark:bg-white/[0.05] border border-border-subtle rounded-lg transition-all active:scale-95 flex items-center justify-center shadow-lg shadow-black/5 dark:shadow-black/20 ${!canBack ? 'opacity-10 cursor-default' : 'hover:bg-black/[0.08] dark:hover:bg-white/[0.12] active:bg-black/[0.12] dark:active:bg-white/[0.2] cursor-default'}`}
            >
              <Ico d={ICONS.chevL} className="w-4 h-4 text-foreground/70" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goForward() }}
              disabled={!canForward}
              className={`p-1 px-2.5 bg-black/[0.05] dark:bg-black/[0.05] dark:bg-white/[0.05] border border-border-subtle rounded-lg transition-all active:scale-95 flex items-center justify-center shadow-lg shadow-black/5 dark:shadow-black/20 ${!canForward ? 'opacity-10 cursor-default' : 'hover:bg-black/[0.08] dark:hover:bg-white/[0.12] active:bg-black/[0.12] dark:active:bg-white/[0.2] cursor-default'}`}
            >
              <Ico d={ICONS.chevR} className="w-4 h-4 text-foreground/70" />
            </button>
          </div>
          <span
            onPointerDown={(e) => e.stopPropagation()}
            className="text-[13px] font-bold text-foreground/95 tracking-tight pointer-events-auto cursor-default"
          >
            {detail ? detail.name : t(SECTION_LABEL_KEY[active])}
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
                <div className="h-full flex items-center justify-center text-foreground/30 text-[13px] font-medium tracking-tight uppercase">
                  {t('finder.noRecentItems')}
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-foreground/30 text-[13px] font-medium tracking-tight uppercase">
              {t('finder.noItems')}
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
  const { t } = useTranslation()

  if (projects.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-foreground/30 text-[13px] font-medium tracking-tight uppercase">
        {t('finder.noProjects')}
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {/* Column headers */}
      <div className="grid grid-cols-[minmax(0,1fr)_100px_120px_80px] gap-4 px-6 py-2 border-b border-border-subtle select-none">
        <span className="text-[11px] font-semibold text-foreground/40 uppercase tracking-widest">{t('finder.columnName')}</span>
        <span className="text-[11px] font-semibold text-foreground/40 uppercase tracking-widest">{t('finder.columnTheme')}</span>
        <span className="text-[11px] font-semibold text-foreground/40 uppercase tracking-widest">{t('finder.columnStatus')}</span>
        <span className="text-[11px] font-semibold text-foreground/40 uppercase tracking-widest text-right">{t('finder.columnYear')}</span>
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
  const { t } = useTranslation()

  return (
    <div
      onClick={(e) => { e.stopPropagation(); onSelect() }}
      onDoubleClick={onOpen}
      className={`grid grid-cols-[minmax(0,1fr)_100px_120px_80px] gap-4 items-center px-6 py-2.5 border-b border-border-subtle select-none transition-colors ${selected ? 'bg-[var(--accent-color)]/20' : 'hover:bg-black/[0.03] dark:hover:bg-black/5 dark:bg-white/[0.03]'
        }`}
    >
      {/* Name + tagline */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="shrink-0 w-5 h-5 text-[var(--accent-color)]/60">
          <Ico d={ICONS.file} className="w-full h-full" />
        </div>
        <div className="min-w-0">
          <p className={`text-[13px] font-medium truncate leading-tight ${selected ? 'text-foreground' : 'text-foreground/90'}`}>
            {project.name}
          </p>
        </div>
      </div>

      {/* Theme */}
      <div className="flex items-center min-w-0">
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-foreground/70 border border-black/10 dark:border-border-subtle truncate">
          {project.theme}
        </span>
      </div>

      {/* Status */}
      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full w-fit ${STATUS_STYLE[project.status]}`}>
        {t(`finder.status.${project.status}`)}
      </span>

      {/* Year */}
      <span className="text-[12px] text-foreground/50 text-right">{project.year}</span>
    </div>
  )
}

// ─── ProjectDetail ────────────────────────────────────────────────────────────

function ProjectDetail({ project }: { project: Project }) {
  const { t } = useTranslation()

  return (
    <div className="p-6 select-text">
      {/* Header */}
      <div className="mb-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-1">
          {/* Title */}
          <div className="min-w-0">
            <h1 className="text-xl font-semibold text-foreground leading-tight mb-1">{project.name}</h1>
          </div>

          {/* Tags and year */}
          <div className="flex items-center gap-2 pt-1 shrink-0">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLE[project.status]}`}>
              {t(`finder.status.${project.status}`)}
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-foreground/70 border border-black/10 dark:border-border-subtle">
              {project.theme}
            </span>
            <span className="text-[11px] text-foreground/40">{project.year}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-[12px] text-foreground/70 leading-relaxed mb-5 max-w-lg">
        {project.description}
      </p>

      {/* Galerie */}
      {project.images && project.images.length > 0 && (
        <div className="mb-5">
          <h2 className="text-[10px] font-semibold text-foreground/40 uppercase tracking-widest mb-2">Galerie</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {project.images.map((img, idx) => (
              <div key={idx} className="group relative aspect-video rounded-xl overflow-hidden border border-border-subtle bg-black/5 dark:bg-white/5 shadow-sm">
                <img
                  src={img}
                  alt={`${project.name} screenshot ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stack & Links */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-2">
        {/* Stack */}
        <div className="flex-1 min-w-0">
          <h2 className="text-[10px] font-semibold text-foreground/40 uppercase tracking-widest mb-2">Stack</h2>
          <div className="flex flex-wrap gap-1.5">
            {project.stack.slice(0, 7).map((t) => (
              <span key={t} className="text-[11px] text-foreground/70 bg-black/[0.04] dark:bg-white/[0.07] px-2 py-0.5 rounded-md">
                {t}
              </span>
            ))}
            {project.stack.length > 7 && (
              <span className="text-[11px] text-foreground/40 px-1 py-0.5">+{project.stack.length - 7}</span>
            )}
          </div>
        </div>

        {/* Links */}
        {(project.links.github || project.links.live) && (
          <div className="shrink-0 w-full sm:w-48">
            <h2 className="text-[10px] font-semibold text-foreground/40 uppercase tracking-widest mb-2">Lien</h2>
            <div className="flex flex-col gap-2">
              {project.links.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1.5 text-[12px] text-foreground/80 hover:text-[var(--accent-color)] transition-colors truncate"
                  title={project.links.github}
                >
                  <Ico d={ICONS.github} className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">GitHub Repo</span>
                </a>
              )}
              {project.links.live && (
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1.5 text-[12px] text-foreground/80 hover:text-[var(--accent-color)] transition-colors truncate"
                  title={project.links.live}
                >
                  <Ico d={ICONS.link} className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{project.links.live.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}</span>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
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
  const { t } = useTranslation()
  const isSel = active === item.id
  const activeColor = item.color || 'text-[var(--accent-color)]'
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onSelect(item.id) }}
      onPointerDown={(e) => e.stopPropagation()}
      className={`w-[calc(100%-16px)] flex items-center gap-3 mx-2 px-3 py-1.5 rounded-lg text-[13px] transition-all group ${isSel
        ? `bg-black/5 dark:bg-black/10 dark:bg-white/10 ${activeColor} font-semibold`
        : 'text-foreground/60 hover:bg-black/[0.05] dark:hover:bg-white/[0.08] hover:text-foreground'
        }`}
    >
      <div className={`shrink-0 flex items-center justify-center w-4 h-4 transition-colors ${isSel ? activeColor : 'text-foreground/40 group-hover:text-foreground/70'}`}>
        {typeof item.icon === 'string'
          ? <Ico d={ICONS[item.icon as keyof typeof ICONS]} className="w-full h-full" />
          : item.icon}
      </div>
      <span className="truncate">{t(item.labelKey)}</span>
    </button>
  )
}
