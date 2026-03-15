'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/useTranslation'
import Image from 'next/image'

type DesktopShortcut = {
    id: string
    labelKey: string
    iconFile: string
    url: string
}

const SHORTCUTS: DesktopShortcut[] = [
]

export function DesktopIcons() {
    const { t } = useTranslation()
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    function handleDesktopClick(e: React.MouseEvent) {
        if (e.target === containerRef.current) {
            setSelectedId(null)
        }
    }

    function handleOpen(url: string) {
        window.open(url, '_blank', 'noopener,noreferrer')
        setSelectedId(null)
    }

    return (
        <div
            ref={containerRef}
            className="absolute top-8 right-6 bottom-24 w-[120px] z-0 flex flex-col items-center justify-start gap-6 pt-4 pointer-events-auto"
            onClick={handleDesktopClick}
        >
            {SHORTCUTS.map((shortcut) => {
                const isSelected = selectedId === shortcut.id

                return (
                    <motion.div
                        key={shortcut.id}
                        data-desktop-icon={shortcut.id}
                        onClick={(e) => {
                            e.stopPropagation()
                            setSelectedId(shortcut.id)
                        }}
                        onDoubleClick={(e) => {
                            e.stopPropagation()
                            handleOpen(shortcut.url)
                        }}
                        className="flex flex-col items-center gap-1 w-full group cursor-default"
                    >
                        {/* Icon Wrapper */}
                        <div
                            className={`relative w-[60px] h-[60px] flex items-center justify-center rounded-xl transition-colors ${isSelected ? 'bg-white/20 dark:bg-white/20' : 'bg-transparent'
                                }`}
                        >
                            {/* Fallback to text if icon missing */}
                            <div className="relative w-12 h-12">
                                <Image
                                    src={`/icons/${shortcut.iconFile}.png`}
                                    alt={t(shortcut.labelKey) || shortcut.labelKey}
                                    fill
                                    className="object-contain drop-shadow-md transition-transform active:scale-95"
                                    onError={(e) => {
                                        // Quick fallback if LinkedIn/GitHub icons haven't been uploaded yet
                                        e.currentTarget.src = '/icons/developer_folder.png'
                                    }}
                                    draggable={false}
                                />
                            </div>
                        </div>

                        {/* Label */}
                        <span
                            className={`text-[12px] leading-tight text-center px-2 py-0.5 rounded-sm line-clamp-2 drop-shadow-md text-white font-medium ${isSelected ? 'bg-[#0058d0]' : 'bg-transparent'
                                }`}
                            style={{
                                textShadow: isSelected ? 'none' : '0 1px 2px rgba(0,0,0,0.8)'
                            }}
                        >
                            {t(shortcut.labelKey) || shortcut.labelKey}
                        </span>
                    </motion.div>
                )
            })}
        </div>
    )
}
