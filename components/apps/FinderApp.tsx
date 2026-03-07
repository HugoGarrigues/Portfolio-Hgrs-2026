'use client'

import { useState } from 'react'

// ─── Icons ───────────────────────────────────────────────────────────────────

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
  search:   'M7 13A6 6 0 1 0 7 1a6 6 0 0 0 0 12Zm9-1-3-3',
}

// ─── Data ────────────────────────────────────────────────────────────────────

type Section = 'recents' | 'downloads' | 'desktop' | 'documents' | 'applications'

type FileRow = {
  id: string
  name: string
  date: string
  size: string
  kind: string
  gradient: string
  label: string
  section: Section
}

const FILES: FileRow[] = [
  // recents
  { id: 'portfolio', name: 'Portfolio macOS.app', date: "Aujourd'hui, 14:32", size: '—',      kind: 'Application',       gradient: 'from-blue-400 to-blue-600',      label: '◉', section: 'recents' },
  { id: 'wireframe', name: 'wireframe-v3.fig',    date: "Aujourd'hui, 11:20", size: '2,1 Mo', kind: 'Document Figma',    gradient: 'from-violet-400 to-purple-600',  label: '✦', section: 'recents' },
  { id: 'demo',      name: 'demo-reel.mp4',       date: 'Hier, 18:44',        size: '97 Mo',  kind: 'Film MPEG-4',       gradient: 'from-zinc-600 to-zinc-900',      label: '▶', section: 'recents' },
  { id: 'shot',      name: 'portfolio-shot.png',  date: 'Hier, 16:12',        size: '3,2 Mo', kind: 'Image PNG',         gradient: 'from-sky-400 to-indigo-500',     label: '⛰', section: 'recents' },
  { id: 'notes-r',   name: 'ideas.md',            date: '6 mars, 21:14',      size: '8 Ko',   kind: 'Document Markdown', gradient: 'from-amber-400 to-orange-500',   label: '✎', section: 'recents' },
  // downloads
  { id: 'cv',        name: 'Hugo_Garrigues_CV.pdf', date: '15 janv., 09:00', size: '148 Ko', kind: 'Document PDF',      gradient: 'from-red-400 to-rose-600',       label: '⬇', section: 'downloads' },
  { id: 'fonts',     name: 'SF-Pro.zip',          date: '10 janv., 15:30',    size: '22 Mo',  kind: 'Archive ZIP',       gradient: 'from-gray-500 to-gray-700',      label: '⬇', section: 'downloads' },
  // desktop
  { id: 'desk-ss',   name: 'screenshot-2026.png', date: 'Hier, 18:44',        size: '3,2 Mo', kind: 'Image PNG',         gradient: 'from-teal-400 to-cyan-600',      label: '🖼', section: 'desktop' },
  // documents
  { id: 'readme',    name: 'README.md',            date: '7 mars, 10:30',     size: '4 Ko',   kind: 'Document Markdown', gradient: 'from-slate-400 to-slate-600',    label: '#',  section: 'documents' },
  { id: 'casestudy', name: 'Portfolio macOS — Case Study.md', date: '7 mars, 08:00', size: '12 Ko', kind: 'Document Markdown', gradient: 'from-emerald-400 to-green-600', label: '✎', section: 'documents' },
  { id: 'notes',     name: 'Ideas & Notes.md',     date: '28 févr., 21:14',   size: '8 Ko',   kind: 'Document Markdown', gradient: 'from-yellow-400 to-amber-500',   label: '✎', section: 'documents' },
  // applications
  { id: 'cursor',    name: 'Cursor.app',           date: '1 mars',             size: '512 Mo', kind: 'Application',       gradient: 'from-zinc-700 to-zinc-900',      label: '⚡', section: 'applications' },
  { id: 'figma',     name: 'Figma.app',            date: '1 mars',             size: '214 Mo', kind: 'Application',       gradient: 'from-purple-500 to-pink-500',    label: '✦', section: 'applications' },
  { id: 'warp',      name: 'Warp.app',             date: '28 févr.',           size: '178 Mo', kind: 'Application',       gradient: 'from-cyan-500 to-blue-600',      label: '>_', section: 'applications' },
]

const NAV: { id: Section; label: string; icon: keyof typeof ICONS }[] = [
  { id: 'recents',      label: 'Recents',      icon: 'clock' },
  { id: 'downloads',    label: 'Downloads',    icon: 'download' },
  { id: 'desktop',      label: 'Desktop',      icon: 'monitor' },
  { id: 'documents',    label: 'Documents',    icon: 'doc' },
  { id: 'applications', label: 'Applications', icon: 'stack' },
]

const SECTION_TITLE: Record<Section, string> = {
  recents:      'Recents',
  downloads:    'Downloads',
  desktop:      'Desktop',
  documents:    'Documents',
  applications: 'Applications',
}

// ─── Thumbnail ────────────────────────────────────────────────────────────────

function Thumb({ gradient, label }: { gradient: string; label: string }) {
  return (
    <div
      className={`w-[22px] h-[22px] rounded-[5px] bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0 text-white shadow-sm`}
      style={{ fontSize: 9 }}
    >
      {label}
    </div>
  )
}

// ─── FinderApp ────────────────────────────────────────────────────────────────

export function FinderApp() {
  const [active, setActive]   = useState<Section>('recents')
  const [selected, setSelected] = useState<string | null>(null)

  const rows = active === 'recents' ? FILES : FILES.filter((f) => f.section === active)
  const dateCol = active === 'recents' ? 'Date Viewed' : 'Date Modified'

  return (
    // h-full is constrained by the Window size prop — no overflow
    <div className="h-full flex flex-col overflow-hidden">

      {/* ── Toolbar ── */}
      <div className="flex items-center gap-3 px-4 h-10 border-b border-white/[0.08] bg-white/[0.03] backdrop-blur-sm shrink-0 select-none">
        {/* Back / Forward */}
        <div className="flex items-center gap-0.5">
          {(['chevL', 'chevR'] as const).map((ico) => (
            <button key={ico} disabled className="w-6 h-6 flex items-center justify-center rounded-md text-white/20 cursor-default">
              <Ico d={ICONS[ico]} className="w-4 h-4" />
            </button>
          ))}
        </div>
        {/* Title */}
        <span className="flex-1 text-center text-[13px] font-semibold text-white/80">
          {SECTION_TITLE[active]}
        </span>
        {/* Search pill */}
        <div className="flex items-center gap-1.5 bg-white/[0.08] rounded-lg px-2.5 py-1 text-white/30">
          <Ico d={ICONS.search} className="w-3 h-3" />
          <span className="text-[11px]">Rechercher</span>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <aside className="w-[168px] shrink-0 border-r border-white/[0.07] flex flex-col pt-2 pb-3 overflow-y-auto bg-white/[0.025]">
          {/* Recents alone */}
          <NavBtn item={NAV[0]} active={active} onSelect={setActive} />

          {/* Favorites section */}
          <p className="px-4 mt-4 mb-1 text-[10px] font-semibold text-white/30 uppercase tracking-widest select-none">
            Favorites
          </p>
          {NAV.slice(1).map((item) => (
            <NavBtn key={item.id} item={item} active={active} onSelect={setActive} />
          ))}
        </aside>

        {/* Main pane */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Column headers */}
          <div className="flex items-center shrink-0 border-b border-white/[0.07] px-3 h-7 select-none">
            <span className="flex-1 text-[11px] text-white/35 font-medium">Name</span>
            <span className="w-44 text-[11px] text-white/35 font-medium">{dateCol}</span>
            <span className="w-20 text-[11px] text-white/35 font-medium">Size</span>
            <span className="w-28 text-[11px] text-white/35 font-medium">Kind</span>
          </div>

          {/* Rows — scrollable */}
          <div className="flex-1 overflow-y-auto overscroll-contain">
            {rows.length === 0 ? (
              <div className="h-full flex items-center justify-center text-white/20 text-[13px]">
                Aucun élément
              </div>
            ) : (
              rows.map((row) => {
                const isSel = selected === row.id
                return (
                  <button
                    key={row.id}
                    onClick={() => setSelected(isSel ? null : row.id)}
                    className={`group w-full flex items-center px-3 py-[4.5px] border-b border-white/[0.04] text-left transition-colors ${
                      isSel ? 'bg-[#3478F6]/80' : 'hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Thumb gradient={row.gradient} label={row.label} />
                      <span className={`text-[13px] truncate ${isSel ? 'text-white' : 'text-white/85'}`}>
                        {row.name}
                      </span>
                    </div>
                    <span className={`w-44 shrink-0 text-[12px] ${isSel ? 'text-white/80' : 'text-white/40'}`}>
                      {row.date}
                    </span>
                    <span className={`w-20 shrink-0 text-[12px] ${isSel ? 'text-white/80' : 'text-white/40'}`}>
                      {row.size}
                    </span>
                    <span className={`w-28 shrink-0 text-[12px] ${isSel ? 'text-white/80' : 'text-white/40'}`}>
                      {row.kind}
                    </span>
                  </button>
                )
              })
            )}
          </div>

          {/* Status bar */}
          <div className="shrink-0 border-t border-white/[0.06] px-4 h-6 flex items-center bg-white/[0.02]">
            <span className="text-[11px] text-white/30">
              {rows.length} élément{rows.length > 1 ? 's' : ''}
            </span>
          </div>
        </div>
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
  item: { id: Section; label: string; icon: keyof typeof ICONS }
  active: Section
  onSelect: (id: Section) => void
}) {
  const isSel = active === item.id
  return (
    <button
      onClick={() => onSelect(item.id)}
      className={`flex items-center gap-2 mx-2 px-2.5 py-1.5 rounded-lg text-[13px] transition-colors ${
        isSel
          ? 'bg-white/[0.12] text-white font-medium'
          : 'text-white/50 hover:text-white/75 hover:bg-white/[0.06]'
      }`}
    >
      <Ico
        d={ICONS[item.icon]}
        className={`w-4 h-4 ${isSel ? 'text-[#3478F6]' : 'text-white/35'}`}
      />
      {item.label}
    </button>
  )
}
