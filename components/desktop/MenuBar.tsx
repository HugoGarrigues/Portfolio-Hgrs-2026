'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from '@/lib/i18n/useTranslation'

type MenuBarProps = {
  onOpenAbout?: () => void
}

function formatDateTime(date: Date, dateLocale: string) {
  const dayName = date.toLocaleDateString(dateLocale, { weekday: 'short' })
  const day = date.getDate()
  const month = date.toLocaleDateString(dateLocale, { month: 'long' })
  const time = date.toLocaleTimeString(dateLocale, { hour: '2-digit', minute: '2-digit' })
  // Capitalize first letter of day name and trim trailing dot if already present
  const dayStr = dayName.replace(/\.$/, '')
  return `${dayStr.charAt(0).toUpperCase() + dayStr.slice(1)}. ${day} ${month} ${time}`
}

export function MenuBar({ onOpenAbout }: MenuBarProps) {
  const { t } = useTranslation()
  const dateLocale = t('menubar.dateLocale')
  const [dateTime, setDateTime] = useState(() => formatDateTime(new Date(), dateLocale))

  useEffect(() => {
    const id = setInterval(() => setDateTime(formatDateTime(new Date(), dateLocale)), 1000)
    return () => clearInterval(id)
  }, [dateLocale])

  return (
    <div className="fixed top-0 inset-x-0 z-[9000] h-7 flex items-center px-3 select-none">
      {/* Left — Hgrs pseudo */}
      <div className="flex items-center">
        <button
          onClick={onOpenAbout}
          aria-label="Hgrs — open about"
          className="text-white text-[13px] font-semibold transition-opacity hover:opacity-70 focus:outline-none"
        >
          Hgrs
        </button>
      </div>

      {/* Right — date + time */}
      <div className="ml-auto flex items-center">
        <time role="timer" className="text-white text-[13px] font-semibold">
          {dateTime}
        </time>
      </div>
    </div>
  )
}
