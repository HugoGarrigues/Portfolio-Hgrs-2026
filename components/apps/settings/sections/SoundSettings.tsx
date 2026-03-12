'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { SettingsToggle } from '../SettingsToggle'
import { SettingsSlider } from '../SettingsSlider'
import { useState } from 'react'

export function SoundSettings() {
    const { doNotDisturb, setThemeState } = useTheme()
    const [volume, setVolume] = useState(50)

    return (
        <div className="flex flex-col gap-6 w-full">
            {/* Do Not Disturb */}
            <SettingsToggle
                label="Ne pas déranger"
                description="Désactive l'apparition des notifications (factices)"
                checked={doNotDisturb}
                onChange={(val) => setThemeState({ doNotDisturb: val })}
            />

            {/* Volume */}
            <SettingsSlider
                label="Volume de sortie"
                description="Contrôle le volume principal du système"
                min={0}
                max={100}
                value={volume}
                onChange={setVolume}
            />
        </div>
    )
}
