'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from '@/lib/i18n/useTranslation'
import { useTheme } from '@/contexts/ThemeContext'

const MoonIcon = () => (
  <svg className="w-3.5 h-3.5 text-white/90 drop-shadow-md" fill="currentColor" viewBox="0 0 20 20">
    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
  </svg>
)

type MenuBarProps = {
  onOpenAbout?: () => void
}

function formatDateTime(date: Date, dateLocale: string, format12h: boolean) {
  const dayName = date.toLocaleDateString(dateLocale, { weekday: 'short' })
  const day = date.getDate()
  const month = date.toLocaleDateString(dateLocale, { month: 'short' })
  const time = date.toLocaleTimeString(dateLocale, { hour: 'numeric', minute: '2-digit', hour12: format12h })
  // Capitalize first letter of day name and trim trailing dot if already present
  const dayStr = dayName.replace(/\.$/, '')
  return `${dayStr.charAt(0).toUpperCase() + dayStr.slice(1)}. ${day} ${month} ${time}`
}

export function MenuBar({ onOpenAbout }: MenuBarProps) {
  const { t } = useTranslation()
  const { clockFormat, doNotDisturb } = useTheme()
  const dateLocale = t('menubar.dateLocale')
  const [now, setNow] = useState(() => new Date())
  const dateTime = formatDateTime(now, dateLocale, clockFormat === '12h')

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="fixed top-0 inset-x-0 z-[9000] h-7 flex items-center px-3 select-none">
      {/* Left — Hgrs pseudo */}
      <div className="flex items-center">
        <button
          onClick={onOpenAbout}
          aria-label="Hgrs — open about"
          className="text-white drop-shadow-md text-[13px] font-semibold transition-opacity hover:opacity-70 focus:outline-none"
        >
          Hgrs
        </button>
      </div>

      {/* Right — date + time */}
      <div className="ml-auto flex items-center gap-3">
        {doNotDisturb && <MoonIcon />}
        <time role="timer" className="text-white drop-shadow-md text-[13px] font-semibold">
          {dateTime}
        </time>
      </div>
    </div>
  )
}
