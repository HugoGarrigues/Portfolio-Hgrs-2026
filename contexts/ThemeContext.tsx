'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'

export type AccentColor = 'blue' | 'purple' | 'pink' | 'red' | 'orange' | 'yellow' | 'green' | 'gray'
export type AppearanceMode = 'light' | 'dark' | 'auto'
export type ClockFormat = '12h' | '24h'

interface ThemeState {
    accentColor: AccentColor
    appearance: AppearanceMode
    reduceMotion: boolean
    addBorders: boolean
    clockFormat: ClockFormat
    doNotDisturb: boolean
    dockSize: number
    autoHideDock: boolean
}

interface ThemeContextType extends ThemeState {
    setThemeState: (state: Partial<ThemeState>) => void
}

const DEFAULT_STATE: ThemeState = {
    accentColor: 'blue',
    appearance: 'dark',
    reduceMotion: false,
    addBorders: false,
    clockFormat: '24h',
    doNotDisturb: false,
    dockSize: 50,
    autoHideDock: false,
}

const THEME_STORAGE_KEY = 'hgrs-theme'

const ACCENT_COLORS: Record<AccentColor, string> = {
    blue: '#007AFF', // macOS Blue
    purple: '#AF52DE',
    pink: '#FF2D55',
    red: '#FF3B30',
    orange: '#FF9500',
    yellow: '#FFCC00',
    green: '#28CD41',
    gray: '#8E8E93',
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<ThemeState>(DEFAULT_STATE)
    const [mounted, setMounted] = useState(false)

    // 1. Hydrate from localStorage
    useEffect(() => {
        const stored = localStorage.getItem(THEME_STORAGE_KEY)
        if (stored) {
            try {
                const parsed = JSON.parse(stored)
                setState((prev) => ({ ...prev, ...parsed }))
            } catch (e) {
                // ignore parse error
            }
        }
        setMounted(true)
    }, [])

    // 2. Persist changes & apply side-effects
    useEffect(() => {
        if (!mounted) return
        localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(state))

        const root = document.documentElement

        // CSS Variables for Accent Color
        root.style.setProperty('--accent-color', ACCENT_COLORS[state.accentColor])

        // Apply Appearance
        if (state.appearance === 'dark' || (state.appearance === 'auto' && window.matchMedia?.('(prefers-color-scheme: dark)').matches)) {
            root.classList.add('dark')
        } else {
            root.classList.remove('dark')
        }

        // A11y classes
        if (state.reduceMotion) {
            root.classList.add('reduce-motion')
        } else {
            root.classList.remove('reduce-motion')
        }

        if (state.addBorders) {
            root.classList.add('add-borders')
        } else {
            root.classList.remove('add-borders')
        }
    }, [state, mounted])

    const setThemeState = useCallback((updates: Partial<ThemeState>) => {
        setState((prev) => ({ ...prev, ...updates }))
    }, [])

    return (
        <ThemeContext.Provider value={{ ...state, setThemeState }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const ctx = useContext(ThemeContext)
    if (!ctx) throw new Error('useTheme must be used within a ThemeProvider')
    return ctx
}
