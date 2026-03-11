'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useWindow } from '@/components/desktop/Window'
import { useTranslation } from '@/lib/i18n/useTranslation'
import { useLocale } from '@/contexts/LocaleContext'
import { useAvailability } from '@/contexts/AvailabilityContext'
import { useWallpaper, WALLPAPERS } from '@/contexts/WallpaperContext'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Icons ────────────────────────────────────────────────────────────────────

function Ico({ d, className = '' }: { d: string; className?: string }) {
    return (
        <svg className={`shrink-0 ${className}`} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d={d} stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

const ICONS = {
    profile: 'M8 2.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM2.5 13.5c0-2.5 3-4 5.5-4s5.5 1.5 5.5 4',
    stack: 'M2 11.5l6 3 6-3M2 8l6 3 6-3M2 4.5l6 3 6-3M8 1.5L2 4.5l6 3 6-3z',
    lang: 'M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM1.5 8h13 M8 1.5c-2.5 1.5-3 5-3 6.5s.5 5 3 6.5C10.5 13 11 9.5 11 8S10.5 3 8 1.5z',
    sun: 'M8 1.5v1.5M8 13v1.5M1.5 8h1.5M13 8h1.5M3.5 3.5l1 1M11.5 11.5l1 1M3.5 12.5l1-1M11.5 4.5l1-1M5.5 8a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0z',
    clock: 'M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z M8 5v3l2 2',
    external: 'M8 8l5-5M13 3v4M13 3H9M11 13H3V5h4',
    chevL: 'M10 3.5 6 8l4 4.5',
    chevR: 'M6 3.5 10 8l-4 4.5'
}

// ─── Component ─────────────────────────────────────────────────────────────────

type SectionId = 'profile' | 'stack' | 'lang' | 'appearance' | 'availability'

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
            className={`w-[calc(100%-16px)] flex items-center gap-3 mx-2 px-3 py-1.5 rounded-lg text-[13px] transition-all group ${isSel
                ? 'bg-white/10 text-white font-semibold'
                : 'text-white/60 hover:bg-white/[0.08] hover:text-white/90'
                }`}
        >
            <div
                className={`shrink-0 flex items-center justify-center w-4 h-4 transition-colors ${isSel ? 'text-blue-400' : 'text-white/40 group-hover:text-white/60'
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
    const { t } = useTranslation()
    const { locale, setLocale } = useLocale()
    const { available, setAvailable } = useAvailability()
    const { wallpaper, setWallpaper } = useWallpaper()
    const [history, setHistory] = useState<SectionId[]>(['profile'])
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

    // Define sidebar sections
    const sections = [
        { id: 'profile', label: t('settings.profile'), icon: ICONS.profile },
        { id: 'stack', label: t('settings.stack'), icon: ICONS.stack },
        { id: 'lang', label: t('settings.language'), icon: ICONS.lang },
        { id: 'appearance', label: t('settings.appearance'), icon: ICONS.sun },
        { id: 'availability', label: t('settings.availability'), icon: ICONS.clock },
    ] as const

    const currentSectionStr = sections.find(s => s.id === activeTab)?.label

    return (
        <div className="h-full flex p-2 gap-2 overflow-hidden text-white font-sans bg-[#161616]">
            {/* ── Sidebar ── */}
            <aside
                onPointerDown={onDragStart}
                className="w-[190px] shrink-0 flex flex-col pt-10 pb-3 overflow-y-auto bg-white/[0.04] backdrop-blur-3xl rounded-2xl border border-white/[0.05] shadow-xl cursor-grab active:cursor-grabbing"
            >
                <div className="mb-4 pointer-events-none">
                    <div className="pointer-events-auto flex flex-col gap-0.5">
                        {sections.map((s) => (
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
                        {currentSectionStr}
                    </span>
                </nav>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto p-8 cursor-default flex flex-col items-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.15 }}
                            className="w-full max-w-sm flex flex-col gap-8"
                        >
                            {/* PROFILE TAB */}
                            {activeTab === 'profile' && (
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-24 h-24 rounded-full overflow-hidden shadow-2xl shadow-black/50 ring-2 ring-white/10 mb-5 relative bg-white/5">
                                        <Image
                                            src="/profile_picture.avif"
                                            alt="Hugo Garrigues"
                                            fill
                                            className="object-cover"
                                            draggable={false}
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold bg-gradient-to-br from-blue-500 to-indigo-500 -z-10">HG</div>
                                    </div>
                                    <h1 className="text-xl font-bold text-white tracking-tight">Hugo Garrigues</h1>
                                    <p className="text-[13px] text-white/60 mt-1">{t('about.subtitle')}</p>

                                    <div className="mt-8 flex flex-col gap-3 w-full">
                                        <a href="https://github.com/hgrs" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between w-full p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] transition-colors focus:outline-none">
                                            <span className="text-[13px] font-medium text-white/90">{t('settings.github')}</span>
                                            <Ico d={ICONS.external} className="w-3.5 h-3.5 text-white/40" />
                                        </a>
                                        <a href="https://linkedin.com/in/hgrs" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between w-full p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] transition-colors focus:outline-none">
                                            <span className="text-[13px] font-medium text-white/90">{t('settings.linkedin')}</span>
                                            <Ico d={ICONS.external} className="w-3.5 h-3.5 text-white/40" />
                                        </a>
                                    </div>
                                </div>
                            )}

                            {/* STACK TAB */}
                            {activeTab === 'stack' && (
                                <div className="flex flex-col w-full">
                                    <h2 className="text-[11px] font-semibold uppercase tracking-widest text-white/25 mb-4">
                                        {t('settings.stack.installed')}
                                    </h2>
                                    <div className="flex flex-wrap gap-2">
                                        {['TypeScript', 'React', 'Next.js 15', 'Tailwind CSS v4', 'Framer Motion', 'React Three Fiber', 'Node.js', 'Prisma'].map(tech => (
                                            <span key={tech} className="px-3 py-1.5 bg-white/[0.04] border border-white/[0.05] rounded-lg text-[12px] text-white/80 font-medium">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* LANGUAGE TAB */}
                            {activeTab === 'lang' && (
                                <div className="flex flex-col w-full">
                                    <h2 className="text-[11px] font-semibold uppercase tracking-widest text-white/25 mb-4">
                                        {t('settings.language')}
                                    </h2>
                                    <div className="flex bg-white/[0.03] p-1 rounded-xl border border-white/[0.05]">
                                        {[
                                            { id: 'en', label: 'English' },
                                            { id: 'fr', label: 'Français' },
                                        ].map(l => (
                                            <button
                                                key={l.id}
                                                onClick={() => setLocale(l.id as 'en' | 'fr')}
                                                className={`flex-1 py-2 text-[13px] font-medium rounded-lg transition-all ${locale === l.id ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/70'
                                                    }`}
                                            >
                                                {l.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* APPEARANCE TAB */}
                            {activeTab === 'appearance' && (
                                <div className="flex flex-col w-full">
                                    <h2 className="text-[11px] font-semibold uppercase tracking-widest text-white/25 mb-4">
                                        {t('settings.appearance')}
                                    </h2>
                                    <div className="grid grid-cols-3 gap-3">
                                        {WALLPAPERS.map(w => (
                                            <button
                                                key={w.id}
                                                onClick={() => setWallpaper(w.id)}
                                                className="flex flex-col items-center gap-2 focus:outline-none group"
                                            >
                                                <div
                                                    className={`w-full aspect-video rounded-lg border-2 transition-all overflow-hidden ${wallpaper === w.id ? 'border-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.5)]' : 'border-white/10 group-hover:border-white/30'
                                                        }`}
                                                    style={w.style}
                                                />
                                                <span className={`text-[11px] ${wallpaper === w.id ? 'text-white font-medium' : 'text-white/50'}`}>
                                                    {t(w.labelKey)}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* AVAILABILITY TAB */}
                            {activeTab === 'availability' && (
                                <div className="flex flex-col w-full relative">
                                    <h2 className="text-[11px] font-semibold uppercase tracking-widest text-white/25 mb-4">
                                        {t('settings.availability')}
                                    </h2>
                                    <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/[0.05] rounded-xl">
                                        <div className="flex flex-col">
                                            <span className={`text-[14px] font-medium ${available ? 'text-white' : 'text-white/50'}`}>
                                                {available ? t('settings.openToWork') : t('settings.notOpenToWork')}
                                            </span>
                                            <span className="text-[12px] text-white/40 mt-0.5">
                                                {available ? 'Visible to recruiters and peers.' : 'Status is set to busy.'}
                                            </span>
                                        </div>

                                        <button
                                            onClick={() => setAvailable(!available)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#161616] ${available ? 'bg-green-500' : 'bg-white/20'
                                                }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${available ? 'translate-x-6' : 'translate-x-1'
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    )
}
