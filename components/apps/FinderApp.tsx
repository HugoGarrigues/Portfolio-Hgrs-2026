import { useState, useRef } from 'react'
import { useWindowManager } from '@/contexts/WindowManagerContext'
import { APPS } from '@/lib/apps'
import { useWindow } from '@/components/desktop/Window'

// ─── Icons ───────────────────────────────────────────────────────────────────

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
  search: 'M7 13A6 6 0 1 0 7 1a6 6 0 0 0 0 12Zm9-1-3-3',
}

// ─── Data ────────────────────────────────────────────────────────────────────

type SectionId =
  | 'recents'
  | 'applications' | 'desktop' | 'documents' | 'downloads'
  | 'hgrs' | 'trash'

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
    ]
  },
  {
    title: 'Favoris',
    items: [
      { id: 'applications', label: 'Applications', icon: 'stack', color: 'text-blue-500' },
      { id: 'desktop', label: 'Bureau', icon: 'monitor' },
      { id: 'documents', label: 'Documents', icon: 'doc' },
      { id: 'downloads', label: 'Téléchargements', icon: 'download' },
    ]
  },
  {
    title: 'Emplacements',
    items: [
      { id: 'hgrs', label: 'hgrs', icon: <Ico d="M3 3h10v10H3z" /> },
      { id: 'trash', label: 'Corbeille', icon: <Ico d="M3 4h10M5 4v9a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V4M6 4V3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1" /> },
    ]
  }
]

// ─── Components ───────────────────────────────────────────────────────────────

function AppIcon({ id, name, iconFile, selected, onSelect, onOpen }: {
  id: string,
  name: string,
  iconFile: string,
  selected: boolean,
  onSelect: (id: string) => void,
  onOpen: (id: string) => void
}) {
  return (
    <div
      onClick={(e) => { e.stopPropagation(); onSelect(id); }}
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

export function FinderApp() {
  const { openWindow, recentApps } = useWindowManager()
  const { dragControls, maximized } = useWindow()

  const [active, setActive] = useState<SectionId>('applications')
  const [selected, setSelected] = useState<string | null>(null)

  // Navigation History Logic
  const [history, setHistory] = useState<SectionId[]>(['applications'])
  const [historyIdx, setHistoryIdx] = useState(0)

  const containerRef = useRef<HTMLDivElement>(null)
  const displayApps = APPS.filter(app => app.id !== 'finder')

  const navigateTo = (id: SectionId, skipPush = false) => {
    if (active === id && !skipPush) return
    setActive(id)
    setSelected(null)
    if (!skipPush) {
      const newHistory = history.slice(0, historyIdx + 1)
      newHistory.push(id)
      setHistory(newHistory)
      setHistoryIdx(newHistory.length - 1)
    }
  }

  const goBack = () => {
    if (historyIdx > 0) {
      const newIdx = historyIdx - 1
      setHistoryIdx(newIdx)
      setActive(history[newIdx])
    }
  }

  const goForward = () => {
    if (historyIdx < history.length - 1) {
      const newIdx = historyIdx + 1
      setHistoryIdx(newIdx)
      setActive(history[newIdx])
    }
  }

  const onDragStart = (e: React.PointerEvent) => {
    dragControls.start(e)
  }

  return (
    <div ref={containerRef} className="h-full flex p-2 gap-2 overflow-hidden text-white font-sans bg-[#161616]">

      {/* ── Sidebar (Floating & Rounded) ── */}
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

      {/* ── Main Area (Also Rounded Island) ── */}
      <div className="flex-1 flex flex-col bg-white/[0.02] rounded-2xl border border-white/[0.03] overflow-hidden">

        {/* Local Navbar — also a drag handle */}
        <nav
          onPointerDown={onDragStart}
          className="h-12 flex items-center px-6 gap-6 select-none border-b border-white/[0.03] cursor-grab active:cursor-grabbing"
        >
          <div className="flex items-center gap-1.5 pointer-events-auto cursor-default" onPointerDown={(e) => e.stopPropagation()}>
            <button
              onClick={(e) => { e.stopPropagation(); goBack(); }}
              disabled={historyIdx === 0}
              className={`p-1 px-2.5 bg-white/[0.05] border border-white/[0.05] rounded-lg transition-all active:scale-95 flex items-center justify-center shadow-lg shadow-black/20 ${historyIdx === 0 ? 'opacity-10 cursor-default' : 'hover:bg-white/[0.12] active:bg-white/[0.2] cursor-default'}`}
            >
              <Ico d={ICONS.chevL} className="w-4 h-4 text-white/70" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goForward(); }}
              disabled={historyIdx === history.length - 1}
              className={`p-1 px-2.5 bg-white/[0.05] border border-white/[0.05] rounded-lg transition-all active:scale-95 flex items-center justify-center shadow-lg shadow-black/20 ${historyIdx === history.length - 1 ? 'opacity-10 cursor-default' : 'hover:bg-white/[0.12] active:bg-white/[0.2] cursor-default'}`}
            >
              <Ico d={ICONS.chevR} className="w-4 h-4 text-white/70" />
            </button>
          </div>
          <span
            onPointerDown={(e) => e.stopPropagation()}
            className="text-[13px] font-bold text-white/95 capitalize tracking-tight pointer-events-auto cursor-default"
          >
            {active}
          </span>
        </nav>

        {/* Content Area */}
        <main
          className="flex-1 overflow-y-auto cursor-default"
          onClick={() => setSelected(null)}
        >
          {active === 'applications' ? (
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
      onClick={(e) => { e.stopPropagation(); onSelect(item.id); }}
      onPointerDown={(e) => e.stopPropagation()}
      className={`w-[calc(100%-16px)] flex items-center gap-3 mx-2 px-3 py-1.5 rounded-lg text-[13px] transition-all group ${isSel
        ? 'bg-white/10 text-white font-semibold'
        : 'text-white/60 hover:bg-white/5 hover:text-white/90'
        }`}
    >
      <div className={`shrink-0 flex items-center justify-center w-4 h-4 transition-colors ${isSel ? (item.color || 'text-blue-400') : 'text-white/40 group-hover:text-white/60'}`}>
        {typeof item.icon === 'string' ? <Ico d={ICONS[item.icon as keyof typeof ICONS]} className="w-full h-full" /> : item.icon}
      </div>
      <span className="truncate">{item.label}</span>
    </button>
  )
}

