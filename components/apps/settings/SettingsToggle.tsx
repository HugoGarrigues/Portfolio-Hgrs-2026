'use client'

import { useTheme } from '@/contexts/ThemeContext'

interface SettingsToggleProps {
    label: string
    description?: string
    checked: boolean
    onChange: (checked: boolean) => void
}

export function SettingsToggle({ label, description, checked, onChange }: SettingsToggleProps) {
    const { accentColor } = useTheme()

    return (
        <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/[0.05] rounded-xl hover:bg-white/[0.03] transition-colors min-h-[44px]">
            <div className="flex flex-col">
                <span className={`text-[14px] font-medium text-white/90`}>
                    {label}
                </span>
                {description && (
                    <span className="text-[12px] text-white/40 mt-0.5">
                        {description}
                    </span>
                )}
            </div>

            <button
                onClick={() => onChange(!checked)}
                style={{ backgroundColor: checked ? `var(--accent-color)` : undefined }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#161616] ${checked ? '' : 'bg-white/20'
                    }`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'
                        }`}
                />
            </button>
        </div>
    )
}
