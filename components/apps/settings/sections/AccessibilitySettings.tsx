'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { SettingsToggle } from '../SettingsToggle'

export function AccessibilitySettings() {
    const { reduceMotion, addBorders, setThemeState } = useTheme()

    return (
        <div className="flex flex-col gap-6 w-full">
            <SettingsToggle
                label="Animations réduites"
                description="Désactive les effets de rebonds et les transitions de fenêtres."
                checked={reduceMotion}
                onChange={(val) => setThemeState({ reduceMotion: val })}
            />

            <SettingsToggle
                label="Augmenter le contraste (Bordures)"
                description="Ajoute des bordures plus visibles aux éléments fantômes."
                checked={addBorders}
                onChange={(val) => setThemeState({ addBorders: val })}
            />
        </div>
    )
}
