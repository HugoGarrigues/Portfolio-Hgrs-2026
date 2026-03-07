'use client'

import { useState } from 'react'

// ─── Icons (inline SVG to avoid extra deps) ──────────────────────────────────

function IconClock({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8 5v3.5l2 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}
function IconDownload({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 2v8M5 7l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 13h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}
function IconMonitor({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="3" width="12" height="8" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <path d="M6 13h4M8 11v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}
function IconDoc({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 2h6l3 3v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.2" />
      <path d="M10 2v3h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}
function IconLayers({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 5l6-3 6 3-6 3-6-3Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M2 9l6 3 6-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function IconChevron({ dir = 'left', className = '' }: { dir?: 'left' | 'right'; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      {dir === 'left'
        ? <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        : <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      }
    </svg>
  )
}

// ─── Data ────────────────────────────────────────────────────────────────────

type SidebarSection = 'recents' | 'downloads' | 'desktop' | 'documents' | 'applications'

type FileRow = {
  id: string
  name: string
  date: string
  size: string
  kind: string
  // Thumbnail visual: gradient stops
  thumbGradient: string
  thumbLabel?: string
  section: SidebarSection
}

const FILES: FileRow[] = [
  // recents
  {
    id: 'portfolio',
    name: 'Portfolio macOS.app',
    date: "Aujourd'hui à 14:32",
    size: '—',
    kind: 'Application',
    thumbGradient: 'from-blue-400 to-blue-600',
    thumbLabel: '🌐',
    section: 'recents',
  },
  {
    id: 'wireframe',
    name: 'wireframe-v3.fig',
    date: "Aujourd'hui à 11:20",
    size: '2,1 Mo',
    kind: 'Document Figma',
    thumbGradient: 'from-purple-400 to-purple-600',
    thumbLabel: '✦',
    section: 'recents',
  },
  {
    id: 'demo-reel',
    name: 'demo-reel.mp4',
    date: "Hier à 18:44",
    size: '97 Mo',
    kind: 'Film MPEG-4',
    thumbGradient: 'from-slate-600 to-slate-800',
    thumbLabel: '▶',
    section: 'recents',
  },
  {
    id: 'shot-1',
    name: 'portfolio-shot.png',
    date: "Hier à 16:12",
    size: '3,2 Mo',
    kind: 'Image PNG',
    thumbGradient: 'from-sky-400 to-indigo-500',
    thumbLabel: '🏔',
    section: 'recents',
  },
  {
    id: 'cv',
    name: 'Hugo_Garrigues_CV.pdf',
    date: "15 jan. 2026 à 09:00",
    size: '148 Ko',
    kind: 'Document PDF',
    thumbGradient: 'from-red-400 to-red-600',
    thumbLabel: '📄',
    section: 'downloads',
  },
  {
    id: 'readme',
    name: 'README.md',
    date: "7 mars 2026 à 10:30",
    size: '4 Ko',
    kind: 'Document Markdown',
    thumbGradient: 'from-gray-400 to-gray-600',
    thumbLabel: '#',
    section: 'documents',
  },
  {
    id: 'casestudy',
    name: 'Portfolio macOS — Case Study.md',
    date: "7 mars 2026 à 08:00",
    size: '12 Ko',
    kind: 'Document Markdown',
    thumbGradient: 'from-emerald-400 to-emerald-600',
    thumbLabel: '📝',
    section: 'documents',
  },
  {
    id: 'notes',
    name: 'Ideas & Notes.md',
    date: "28 fév. 2026 à 21:14",
    size: '8 Ko',
    kind: 'Document Markdown',
    thumbGradient: 'from-yellow-400 to-orange-400',
    thumbLabel: '💡',
    section: 'documents',
  },
  {
    id: 'cursor',
    name: 'Cursor.app',
    date: "1 mars 2026",
    size: '512 Mo',
    kind: 'Application',
    thumbGradient: 'from-neutral-700 to-neutral-900',
    thumbLabel: '⚡',
    section: 'applications',
  },
  {
    id: 'figma',
    name: 'Figma.app',
    date: "1 mars 2026",
    size: '214 Mo',
    kind: 'Application',
    thumbGradient: 'from-purple-500 to-pink-500',
    thumbLabel: '✦',
    section: 'applications',
  },
  {
    id: 'warp',
    name: 'Warp.app',
    date: "28 fév. 2026",
    size: '178 Mo',
    kind: 'Application',
    thumbGradient: 'from-cyan-500 to-blue-600',
    thumbLabel: '>_',
    section: 'applications',
  },
]

const SIDEBAR_ITEMS: { id: SidebarSection; label: string; Icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'recents',      label: 'Recents',      Icon: IconClock },
  { id: 'downloads',    label: 'Downloads',    Icon: IconDownload },
  { id: 'desktop',      label: 'Desktop',      Icon: IconMonitor },
  { id: 'documents',    label: 'Documents',    Icon: IconDoc },
  { id: 'applications', label: 'Applications', Icon: IconLayers },
]

const SECTION_LABELS: Record<SidebarSection, string> = {
  recents:      'Recents',
  downloads:    'Downloads',
  desktop:      'Desktop',
  documents:    'Documents',
  applications: 'Applications',
}

// ─── Thumbnail ────────────────────────────────────────────────────────────────

function Thumb({ gradient, label }: { gradient: string; label?: string }) {
  return (
    <div className={`w-5 h-5 rounded-[4px] bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0 text-[8px] leading-none text-white`}>
      {label}
    </div>
  )
}

// ─── FinderApp ────────────────────────────────────────────────────────────────

export function FinderApp() {
  const [active, setActive] = useState<SidebarSection>('recents')
  const [selected, setSelected] = useState<string | null>(null)

  const rows = FILES.filter((f) => active === 'recents' ? true : f.section === active)

  return (
    <div className="h-full flex flex-col bg-white text-[#1c1c1e] text-[13px] select-none overflow-hidden">

      {/* ── Toolbar ── */}
      <div className="flex items-center gap-2 px-3 h-9 border-b border-[#d8d8d8] bg-[#f6f6f6] shrink-0">
        {/* Back / Forward */}
        <div className="flex items-center gap-0.5">
          <button
            className="w-6 h-6 flex items-center justify-center text-[#8e8e93] hover:text-[#3c3c43] transition-colors rounded disabled:opacity-30"
            disabled
          >
            <IconChevron dir="left" className="w-4 h-4" />
          </button>
          <button
            className="w-6 h-6 flex items-center justify-center text-[#8e8e93] hover:text-[#3c3c43] transition-colors rounded disabled:opacity-30"
            disabled
          >
            <IconChevron dir="right" className="w-4 h-4" />
          </button>
        </div>

        {/* Location title */}
        <span className="flex-1 text-center font-semibold text-[13px] text-[#1c1c1e]">
          {SECTION_LABELS[active]}
        </span>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <aside className="w-44 shrink-0 bg-[#f0f0f0] border-r border-[#d8d8d8] flex flex-col pt-2 pb-3 overflow-y-auto">
          {/* Recents (top level) */}
          <button
            onClick={() => setActive('recents')}
            className={`flex items-center gap-2 mx-2 px-2 py-1 rounded-md text-[13px] mb-1 ${
              active === 'recents'
                ? 'bg-[#3478F6] text-white'
                : 'text-[#3c3c43] hover:bg-black/5'
            }`}
          >
            <IconClock className={`w-4 h-4 shrink-0 ${active === 'recents' ? 'text-white' : 'text-[#6e6e73]'}`} />
            Recents
          </button>

          {/* Favorites section */}
          <p className="px-4 mt-2 mb-1 text-[11px] font-semibold text-[#8e8e93] uppercase tracking-wider">
            Favorites
          </p>

          {SIDEBAR_ITEMS.filter((s) => s.id !== 'recents').map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={`flex items-center gap-2 mx-2 px-2 py-1 rounded-md text-[13px] ${
                active === id
                  ? 'bg-[#3478F6] text-white'
                  : 'text-[#3c3c43] hover:bg-black/5'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${active === id ? 'text-white' : 'text-[#6e6e73]'}`} />
              {label}
            </button>
          ))}
        </aside>

        {/* Main pane */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">

          {/* Column headers */}
          <div className="flex items-center border-b border-[#e5e5e5] px-3 py-1 bg-white shrink-0">
            <span className="flex-1 text-[#8e8e93] text-[12px]">Name</span>
            <span className="w-44 text-[#8e8e93] text-[12px]">
              {active === 'recents' ? 'Date Viewed' : 'Date Modified'}
            </span>
            <span className="w-24 text-[#8e8e93] text-[12px]">Size</span>
            <span className="w-28 text-[#8e8e93] text-[12px]">Kind</span>
          </div>

          {/* File rows */}
          <div className="flex-1 overflow-y-auto">
            {rows.length === 0 ? (
              <div className="h-full flex items-center justify-center text-[#8e8e93] text-[13px]">
                Aucun élément
              </div>
            ) : (
              rows.map((row) => (
                <button
                  key={row.id}
                  onClick={() => setSelected(row.id === selected ? null : row.id)}
                  className={`w-full flex items-center px-3 py-[5px] border-b border-[#f2f2f2] text-left transition-colors ${
                    selected === row.id ? 'bg-[#3478F6]' : 'hover:bg-[#f0f6ff]'
                  }`}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Thumb gradient={row.thumbGradient} label={row.thumbLabel} />
                    <span className={`truncate ${selected === row.id ? 'text-white' : 'text-[#1c1c1e]'}`}>
                      {row.name}
                    </span>
                  </div>
                  <span className={`w-44 shrink-0 ${selected === row.id ? 'text-white/90' : 'text-[#3c3c43]'}`}>
                    {row.date}
                  </span>
                  <span className={`w-24 shrink-0 ${selected === row.id ? 'text-white/90' : 'text-[#3c3c43]'}`}>
                    {row.size}
                  </span>
                  <span className={`w-28 shrink-0 ${selected === row.id ? 'text-white/90' : 'text-[#3c3c43]'}`}>
                    {row.kind}
                  </span>
                </button>
              ))
            )}
          </div>

          {/* Status bar */}
          <div className="shrink-0 border-t border-[#e5e5e5] px-4 py-1 text-[11px] text-[#8e8e93] bg-white">
            {rows.length} élément{rows.length > 1 ? 's' : ''}
          </div>
        </div>
      </div>
    </div>
  )
}
