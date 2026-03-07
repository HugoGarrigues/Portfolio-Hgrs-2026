'use client'

import { useEffect, useState } from 'react'

type MenuBarProps = {
  activeApp?: string
}

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function MenuBar({ activeApp }: MenuBarProps) {
  const [time, setTime] = useState(() => formatTime(new Date()))

  useEffect(() => {
    const id = setInterval(() => setTime(formatTime(new Date())), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="fixed top-0 inset-x-0 z-[9000] h-7 flex items-center px-3 bg-black/40 backdrop-blur-xl border-b border-white/[0.06] select-none">
      {/* Left — Apple + active app */}
      <div className="flex items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 814 1000'%3E%3Cpath fill='white' d='M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 376.7 0 319.6 0 252.6c0-192.1 131.3-293.3 260.3-293.3 69.9 0 127.9 45.9 169.7 45.9 39.5 0 107.3-48.3 189.2-48.3zm-19.5-67.4c-5.8-36.8-24.1-88.4-63-125.1-39.5-37.6-94.9-63-152.1-63-14.1 0-28.1 2-40.2 4.5 48.9 52.5 73 111.5 73 172.6 0 13.4-1.4 26.8-3.2 38.6 10.9 1.9 22.5 3.2 34.8 3.2 57.9 0 116.9-29.5 150.7-30.8z'/%3E%3C/svg%3E"
          alt="Apple"
          role="img"
          aria-label="Apple"
          className="w-3.5 h-3.5 opacity-90"
        />
        <span className="text-white text-[13px] font-semibold">
          {activeApp ?? 'Finder'}
        </span>
      </div>

      {/* Right — clock + status icons */}
      <div className="ml-auto flex items-center gap-3">
        {/* Cosmetic icons */}
        <svg className="w-3.5 h-3.5 text-white/70" fill="currentColor" viewBox="0 0 24 24">
          <path d="M1.5 8.5C5.5 4.5 10.5 2 12 2s6.5 2.5 10.5 6.5l-2 2C17.5 7.5 14.5 5 12 5S6.5 7.5 3.5 10.5l-2-2zm4 4C7.5 10.5 9.5 9 12 9s4.5 1.5 6.5 3.5l-2 2C15 13 13.5 12 12 12s-3 1-4.5 2.5l-2-2zm4 4 2.5 2.5 2.5-2.5C14.5 15.5 13.5 15 12 15s-2.5.5-2.5 1.5z"/>
        </svg>
        <time role="timer" className="text-white text-[13px] tabular-nums">
          {time}
        </time>
      </div>
    </div>
  )
}
