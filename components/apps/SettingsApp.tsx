'use client'

import { useState, useRef } from 'react'
import { useWindow } from '@/components/desktop/Window'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeContext'
import { useTranslation } from '@/lib/i18n/useTranslation'

import { GeneralSettings } from './settings/sections/GeneralSettings'
import { AppearanceSettings } from './settings/sections/AppearanceSettings'
import { DesktopSettings } from './settings/sections/DesktopSettings'
import { AboutSettings } from './settings/sections/AboutSettings'

// ─── Icons ────────────────────────────────────────────────────────────────────

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
    about: 'M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM8 4.5v1M8 7v4',
    chevL: 'M10 3.5 6 8l4 4.5',
    chevR: 'M6 3.5 10 8l-4 4.5'
}

type SectionId = 'general' | 'appearance' | 'desktop' | 'about'

type NavItem = {
    id: SectionId
    labelKey: string
    icon: keyof typeof ICONS
    component: React.ComponentType
}

const SIDEBAR_SECTIONS: { titleKey?: string; items: NavItem[] }[] = [
    {
        items: [
            { id: 'general', labelKey: 'settings.general', icon: 'general', component: GeneralSettings },
            { id: 'desktop', labelKey: 'settings.desktop', icon: 'desktop', component: DesktopSettings },
            { id: 'appearance', labelKey: 'settings.appearance', icon: 'appearance', component: AppearanceSettings },
        ],
    },
    {
        titleKey: 'settings.system',
        items: [
            { id: 'about', labelKey: 'settings.about', icon: 'about', component: AboutSettings },
        ],
    },
]

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
    const activeColor = 'text-[var(--accent-color)]'
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
                <Ico d={ICONS[item.icon]} className="w-full h-full" />
            </div>
            <span className="truncate">{t(item.labelKey)}</span>
        </button>
    )
}

// ─── SettingsApp ──────────────────────────────────────────────────────────────

export function SettingsApp() {
    const { dragControls } = useWindow()
    const { reduceMotion } = useTheme()
    const { t } = useTranslation()
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

    const currentSection = SIDEBAR_SECTIONS.flatMap(s => s.items).find(i => i.id === activeTab)
    const ActiveComponent = currentSection?.component || AppearanceSettings
    const currentTitle = currentSection ? t(currentSection.labelKey) : ''

    return (
        <div className="h-full flex p-2 gap-2 overflow-hidden text-foreground font-sans bg-background">
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
                                    active={activeTab}
                                    onSelect={navigateTo}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </aside>

            {/* ── Main Island ── */}
            <div className="flex-1 flex flex-col bg-black/[0.02] dark:bg-black/[0.03] dark:bg-white/[0.02] rounded-2xl border border-border-subtle overflow-hidden relative">
                {/* Toolbar */}
                <nav
                    onPointerDown={onDragStart}
                    className="h-12 flex items-center px-6 gap-6 select-none border-b border-border-subtle cursor-grab active:cursor-grabbing shrink-0"
                >
                    <div
                        className="flex items-center gap-1.5 pointer-events-auto cursor-default"
                        onPointerDown={(e) => e.stopPropagation()}
                    >
                        <button
                            aria-label="Back"
                            onClick={(e) => { e.stopPropagation(); goBack() }}
                            disabled={!canBack}
                            className={`p-1 px-2.5 bg-black/[0.05] dark:bg-black/[0.05] dark:bg-white/[0.05] border border-border-subtle rounded-lg transition-all active:scale-95 flex items-center justify-center shadow-lg shadow-black/5 dark:shadow-black/20 ${!canBack ? 'opacity-10 cursor-default' : 'hover:bg-black/[0.08] dark:hover:bg-white/[0.12] active:bg-black/[0.12] dark:active:bg-white/[0.2] cursor-default'}`}
                        >
                            <Ico d={ICONS.chevL} className="w-4 h-4 text-foreground/70" />
                        </button>
                        <button
                            aria-label="Forward"
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
                        {currentTitle}
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
