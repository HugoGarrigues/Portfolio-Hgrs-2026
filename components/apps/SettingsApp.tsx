'use client'

import { useState } from 'react'
import { useWindow } from '@/components/desktop/Window'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeContext'

// Icons
function Ico({ d, className = '' }: { d: string; className?: string }) {
    return (
        <svg className={`shrink-0 ${className}`} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d={d} stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

const ICONS = {
    general: 'M8 2.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM2.5 13.5c0-2.5 3-4 5.5-4s5.5 1.5 5.5 4',
    appearance: 'M8 1.5v1.5M8 13v1.5M1.5 8h1.5M13 8h1.5M3.5 3.5l1 1M11.5 11.5l1 1M3.5 12.5l1-1M11.5 4.5l1-1M5.5 8a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0z',
    desktop: 'M2 11.5l6 3 6-3M2 8l6 3 6-3M2 4.5l6 3 6-3M8 1.5L2 4.5l6 3 6-3z',
    sound: 'M7 3L3.5 6H1v4h2.5L7 13V3z M11 5c1.5 1.5 1.5 4.5 0 6 M13.5 2.5c3 3 3 8 0 11',
    accessibility: 'M8 3.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z M4.5 6.5h7 M8 6v5 M6 14l2-3 2 3',
    about: 'M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM8 4.5v1M8 7v4',
    chevL: 'M10 3.5 6 8l4 4.5',
    chevR: 'M6 3.5 10 8l-4 4.5'
}

type SectionId = 'general' | 'appearance' | 'desktop' | 'sound' | 'accessibility' | 'about'

import { GeneralSettings } from './settings/sections/GeneralSettings'
import { AppearanceSettings } from './settings/sections/AppearanceSettings'
import { DesktopSettings } from './settings/sections/DesktopSettings'
import { SoundSettings } from './settings/sections/SoundSettings'
import { AccessibilitySettings } from './settings/sections/AccessibilitySettings'
import { AboutSettings } from './settings/sections/AboutSettings'

const SECTIONS = [
    { id: 'general', label: 'Général', icon: ICONS.general, component: GeneralSettings },
    { id: 'appearance', label: 'Apparence', icon: ICONS.appearance, component: AppearanceSettings },
    { id: 'desktop', label: 'Bureau & Dock', icon: ICONS.desktop, component: DesktopSettings },
    { id: 'sound', label: 'Son', icon: ICONS.sound, component: SoundSettings },
    { id: 'accessibility', label: 'Accessibilité', icon: ICONS.accessibility, component: AccessibilitySettings },
    { id: 'about', label: 'À Propos', icon: ICONS.about, component: AboutSettings },
] as const

function NavBtn({
    id,
    label,
    icon,
    active,
    onSelect,
}: {
    id: SectionId
    label: string
    icon: string
    active: SectionId
    onSelect: (id: SectionId) => void
}) {
    const isSel = active === id
    return (
        <button
            onClick={(e) => {
                e.stopPropagation()
                onSelect(id)
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className={`w-[calc(100%-16px)] flex items-center gap-3 mx-2 px-3 py-1.5 rounded-lg text-[13px] transition-all group min-h-[36px] ${isSel
                ? 'bg-[var(--accent-color)] text-white font-medium shadow-md'
                : 'text-white/60 hover:bg-white/[0.08] hover:text-white/90'
                }`}
        >
            <div
                className={`shrink-0 flex items-center justify-center w-4 h-4 transition-colors ${isSel ? 'text-white' : 'text-white/40 group-hover:text-white/60'
                    }`}
            >
                <Ico d={icon} className="w-4 h-4" />
            </div>
            <span className="truncate">{label}</span>
        </button>
    )
}

export function SettingsApp() {
    const { dragControls } = useWindow()
    const { reduceMotion } = useTheme()
    const [history, setHistory] = useState<SectionId[]>(['appearance'])
    const [historyIdx, setHistoryIdx] = useState(0)

    const activeTab = history[historyIdx]

    const navigateTo = (id: SectionId) => {
        if (activeTab === id) return
        const newHistory = history.slice(0, historyIdx + 1)
        newHistory.push(id)
        setHistory(newHistory)
        setHistoryIdx(newHistory.length - 1)
    }

    const goBack = () => {
        if (historyIdx > 0) setHistoryIdx(historyIdx - 1)
    }

    const goForward = () => {
        if (historyIdx < history.length - 1) setHistoryIdx(historyIdx + 1)
    }

    const canBack = historyIdx > 0
    const canForward = historyIdx < history.length - 1

    const onDragStart = (e: React.PointerEvent) => {
        dragControls.start(e)
    }

    const currentSection = SECTIONS.find(s => s.id === activeTab)
    const ActiveComponent = currentSection?.component || AppearanceSettings

    return (
        <div className="h-full flex p-2 gap-2 overflow-hidden text-white font-sans bg-[#161616]">
            {/* ── Sidebar ── */}
            <aside
                onPointerDown={onDragStart}
                className="w-[220px] shrink-0 flex flex-col pt-10 pb-3 overflow-y-auto bg-white/[0.04] backdrop-blur-3xl rounded-2xl border border-white/[0.05] shadow-xl cursor-grab active:cursor-grabbing"
            >
                <div className="mb-4 pointer-events-none">
                    <div className="pointer-events-auto flex flex-col gap-1.5 mt-2">
                        {SECTIONS.map((s) => (
                            <NavBtn
                                key={s.id}
                                id={s.id}
                                label={s.label}
                                icon={s.icon}
                                active={activeTab}
                                onSelect={navigateTo}
                            />
                        ))}
                    </div>
                </div>
            </aside>

            {/* ── Main Island ── */}
            <div className="flex-1 flex flex-col bg-white/[0.02] rounded-2xl border border-white/[0.03] overflow-hidden relative">
                {/* Toolbar */}
                <nav
                    onPointerDown={onDragStart}
                    className="h-12 flex items-center px-6 gap-6 select-none border-b border-white/[0.03] cursor-grab active:cursor-grabbing shrink-0"
                >
                    <div
                        className="flex items-center gap-1.5 pointer-events-auto cursor-default"
                        onPointerDown={(e) => e.stopPropagation()}
                    >
                        <button
                            aria-label="Back"
                            onClick={(e) => { e.stopPropagation(); goBack() }}
                            disabled={!canBack}
                            className={`p-1 px-2.5 bg-white/[0.05] border border-white/[0.05] rounded-lg transition-all active:scale-95 flex items-center justify-center shadow-lg shadow-black/20 min-h-[32px] min-w-[36px] ${!canBack ? 'opacity-10 cursor-default' : 'hover:bg-white/[0.12] active:bg-white/[0.2] cursor-pointer'}`}
                        >
                            <Ico d={ICONS.chevL} className="w-4 h-4 text-white/70" />
                        </button>
                        <button
                            aria-label="Forward"
                            onClick={(e) => { e.stopPropagation(); goForward() }}
                            disabled={!canForward}
                            className={`p-1 px-2.5 bg-white/[0.05] border border-white/[0.05] rounded-lg transition-all active:scale-95 flex items-center justify-center shadow-lg shadow-black/20 min-h-[32px] min-w-[36px] ${!canForward ? 'opacity-10 cursor-default' : 'hover:bg-white/[0.12] active:bg-white/[0.2] cursor-pointer'}`}
                        >
                            <Ico d={ICONS.chevR} className="w-4 h-4 text-white/70" />
                        </button>
                    </div>
                    <span
                        onPointerDown={(e) => e.stopPropagation()}
                        className="text-[13px] font-bold text-white/95 tracking-tight pointer-events-auto cursor-default"
                    >
                        {currentSection?.label}
                    </span>
                </nav>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-8 cursor-default flex flex-col items-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
                            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
                            transition={{ duration: 0.15 }}
                            className="w-full max-w-[480px] flex flex-col gap-8 pb-10"
                        >
                            <ActiveComponent />
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    )
}
