'use client'

import { useTheme, AccentColor, AppearanceMode } from '@/contexts/ThemeContext'
import { useTranslation } from '@/lib/i18n/useTranslation'

const ACCENT_COLORS: { id: AccentColor; color: string; labelKey: string }[] = [
    { id: 'blue', color: '#007AFF', labelKey: 'settings.accent.blue' },
    { id: 'purple', color: '#AF52DE', labelKey: 'settings.accent.purple' },
    { id: 'pink', color: '#FF2D55', labelKey: 'settings.accent.pink' },
    { id: 'red', color: '#FF3B30', labelKey: 'settings.accent.red' },
    { id: 'orange', color: '#FF9500', labelKey: 'settings.accent.orange' },
    { id: 'yellow', color: '#FFCC00', labelKey: 'settings.accent.yellow' },
    { id: 'green', color: '#28CD41', labelKey: 'settings.accent.green' },
    { id: 'gray', color: '#8E8E93', labelKey: 'settings.accent.gray' },
]

export function AppearanceSettings() {
    const { accentColor, appearance, setThemeState } = useTheme()
    const { t } = useTranslation()

    return (
        <div className="flex flex-col gap-6 w-full">
            {/* Mode */}
            <div className="flex flex-col p-4 bg-black/[0.03] dark:bg-white/[0.02] border border-border-subtle rounded-xl">
                <span className="text-[14px] font-medium text-foreground/90 mb-4 tracking-tight">{"Mode d'apparence"}</span>
                <div className="flex gap-2 p-1 bg-black/5 dark:bg-white/[0.03] rounded-lg border border-border-subtle">
                    {(['light', 'dark', 'auto'] as AppearanceMode[]).map((mode) => (
                        <button
                            key={mode}
                            onClick={() => setThemeState({ appearance: mode })}
                            className={`flex-1 py-1.5 text-[13px] font-medium rounded-md transition-all ${appearance === mode ? 'bg-black/10 dark:bg-white/10 text-foreground shadow-sm' : 'text-foreground/50 hover:text-foreground/80'
                                }`}
                        >
                            {mode.charAt(0).toUpperCase() + mode.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Accent Color */}
            <div className="flex flex-col p-4 bg-black/[0.03] dark:bg-white/[0.02] border border-border-subtle rounded-xl">
                <span className="text-[14px] font-medium text-foreground/90 mb-4 tracking-tight">{"Couleur d'accentuation"}</span>
                <div className="flex flex-wrap gap-3">
                    {ACCENT_COLORS.map((c) => {
                        const isSelected = accentColor === c.id
                        return (
                            <button
                                key={c.id}
                                onClick={() => setThemeState({ accentColor: c.id })}
                                className="relative flex items-center justify-center w-8 h-8 rounded-full focus:outline-none group min-w-[44px] min-h-[44px]"
                                aria-label={t(c.labelKey)}
                            >
                                <div
                                    className={`absolute inset-0 m-auto w-8 h-8 rounded-full transition-transform ${isSelected ? 'scale-110 shadow-lg' : 'scale-100 group-hover:scale-105'}`}
                                    style={{ backgroundColor: c.color }}
                                />
                                {isSelected && (
                                    <div className="absolute inset-0 m-auto w-10 h-10 rounded-full border-2 border-white/30" />
                                )}
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
