'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { SettingsToggle } from '../SettingsToggle'
import { SettingsSlider } from '../SettingsSlider'
import { useWallpaper, WALLPAPERS } from '@/contexts/WallpaperContext'
import { useTranslation } from '@/lib/i18n/useTranslation'

export function DesktopSettings() {
    const { dockSize, autoHideDock, setThemeState } = useTheme()
    const { wallpaper, setWallpaper } = useWallpaper()
    const { t } = useTranslation()

    return (
        <div className="flex flex-col gap-6 w-full">
            {/* Wallpapers */}
            <div className="flex flex-col p-4 bg-black/[0.03] dark:bg-white/[0.02] border border-border-subtle rounded-xl">
                <span className="text-[14px] font-medium text-foreground/90 mb-4 tracking-tight">{"Fonds d'écran"}</span>
                <div className="grid grid-cols-3 gap-3">
                    {WALLPAPERS.map(w => (
                        <button
                            key={w.id}
                            onClick={() => setWallpaper(w.id)}
                            className="flex flex-col items-center gap-2 focus:outline-none group min-h-[80px]"
                        >
                            <div
                                className={`w-full aspect-video rounded-lg border-2 transition-all overflow-hidden ${wallpaper === w.id
                                        ? 'border-[var(--accent-color)] shadow-[0_0_12px_var(--accent-color)] opacity-100'
                                        : 'border-white/10 group-hover:border-white/30 opacity-70 group-hover:opacity-100'
                                    }`}
                                style={w.style}
                            />
                            <span className={`text-[11px] font-medium leading-tight text-center ${wallpaper === w.id ? 'text-foreground' : 'text-foreground/50'}`}>
                                {t(w.labelKey)}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Dock Size */}
            <SettingsSlider
                label="Taille du Dock"
                description="Ajuste la taille globale du Dock"
                min={40}
                max={80}
                value={dockSize}
                onChange={(val) => setThemeState({ dockSize: val })}
                iconLeft={<span className="text-[10px]">Petit</span>}
                iconRight={<span className="text-[14px]">Grand</span>}
            />

            {/* Auto Hide */}
            <SettingsToggle
                label="Masquer automatiquement le Dock"
                description="Le dock apparait uniquement au survol"
                checked={autoHideDock}
                onChange={(val) => setThemeState({ autoHideDock: val })}
            />
        </div>
    )
}
