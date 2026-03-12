'use client'

interface SettingsSliderProps {
    label: string
    description?: string
    value: number
    min: number
    max: number
    onChange: (value: number) => void
    iconLeft?: React.ReactNode
    iconRight?: React.ReactNode
}

export function SettingsSlider({ label, description, value, min, max, onChange, iconLeft, iconRight }: SettingsSliderProps) {
    return (
        <div className="flex flex-col p-4 bg-white/[0.02] border border-white/[0.05] rounded-xl hover:bg-white/[0.03] transition-colors">
            <div className="flex justify-between items-center mb-3">
                <div className="flex flex-col">
                    <span className="text-[14px] font-medium text-white/90">{label}</span>
                    {description && <span className="text-[12px] text-white/40 mt-0.5">{description}</span>}
                </div>
            </div>

            <div className="flex items-center gap-3 w-full min-h-[44px]">
                {iconLeft && <div className="text-white/40 shrink-0">{iconLeft}</div>}
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)] accent-[var(--accent-color)] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md"
                />
                {iconRight && <div className="text-white/40 shrink-0">{iconRight}</div>}
            </div>
        </div>
    )
}
