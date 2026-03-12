'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { useLocale } from '@/contexts/LocaleContext'
import { Locale } from '@/lib/i18n/locales'
import { useTranslation } from '@/lib/i18n/useTranslation'

const LOCALES: { id: Locale; label: string }[] = [
    { id: 'en', label: 'English' },
    { id: 'fr', label: 'Français' },
    { id: 'de', label: 'Deutsch' },
    { id: 'it', label: 'Italiano' },
    { id: 'es', label: 'Español' },
]

export function GeneralSettings() {
    const { clockFormat, setThemeState } = useTheme()
    const { locale, setLocale } = useLocale()
    const { t } = useTranslation()

    return (
        <div className="flex flex-col gap-6 w-full">
            {/* Language */}
            <div className="flex flex-col p-4 bg-white/[0.02] border border-white/[0.05] rounded-xl">
                <span className="text-[14px] font-medium text-white/90 mb-4 tracking-tight">Langue du système</span>
                <div className="flex flex-wrap gap-2 p-1 bg-white/[0.03] rounded-lg border border-white/[0.05]">
                    {LOCALES.map((l) => (
                        <button
                            key={l.id}
                            onClick={() => setLocale(l.id)}
                            className={`flex-1 min-w-[30%] py-2 text-[13px] font-medium rounded-md transition-all ${locale === l.id ? 'bg-[var(--accent-color)] text-white shadow-sm' : 'text-white/50 hover:text-white/80 hover:bg-white/[0.05]'
                                }`}
                        >
                            {l.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Date & Time */}
            <div className="flex flex-col p-4 bg-white/[0.02] border border-white/[0.05] rounded-xl">
                <span className="text-[14px] font-medium text-white/90 mb-4 tracking-tight">Date et Heure</span>
                <div className="flex gap-2 p-1 bg-white/[0.03] rounded-lg border border-white/[0.05]">
                    {(['12h', '24h'] as const).map((format) => (
                        <button
                            key={format}
                            onClick={() => setThemeState({ clockFormat: format })}
                            className={`flex-1 py-1.5 text-[13px] font-medium rounded-md transition-all ${clockFormat === format ? 'bg-white/10 text-white shadow-sm' : 'text-white/50 hover:text-white/80'
                                }`}
                        >
                            Format {format}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
