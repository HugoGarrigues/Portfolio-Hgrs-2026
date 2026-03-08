'use client'

import { useState } from 'react'
import { useWindow } from '@/components/desktop/Window'

// ─── About This Mac — portfolio style ──────────────────────────────────────

export function AboutApp() {
  const { dragControls } = useWindow()
  const [imgError, setImgError] = useState(false)

  return (
    <div
      onPointerDown={(e) => dragControls.start(e)}
      className="h-full flex flex-col bg-[#1c1c1e] text-white select-text cursor-grab active:cursor-grabbing"
    >

      {/* Title bar — h-12 matches Window.tsx traffic lights zone */}
      <div className="shrink-0 h-12 flex items-center justify-center border-b border-white/10 select-none">
        <span className="text-[13px] font-semibold text-white/70">About</span>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center px-8 pt-8 pb-6 overflow-y-auto">

        {/* Profile picture */}
        <div className="w-28 h-28 rounded-full overflow-hidden shadow-2xl shadow-black/30 ring-2 ring-white/10 mb-6 shrink-0">
          {!imgError ? (
            <img
              src="/profile_picture.avif"
              alt="Hugo Garrigues"
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
              draggable={false}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center text-5xl font-bold">
              HG
            </div>
          )}
        </div>

        {/* Name */}
        <h1 className="text-[22px] font-bold tracking-tight text-white">
          Hugo Garrigues
        </h1>

        {/* Subtitle */}
        <p className="text-[13px] text-white/40 mt-1">
          Agentic Engineer · 2026
        </p>

        {/* Specs list — values only, centered */}
        <div className="mt-6 flex flex-col items-center gap-1.5 text-[13px] text-white/80">
          <span>21 ans</span>
          <span>Aix-En-Provence, France</span>
          <span>Développeur Fullstack @Laroq</span>
        </div>

        {/* Bio */}
        <p className="mt-6 text-[12px] text-white/35 leading-relaxed text-center max-w-[280px]">
          Passionné par le design, l&apos;ingénierie web et les expériences
          utilisateur soignées. Je construis des produits modernes avec une
          attention au détail.
        </p>

        {/* Footer */}
        <p className="mt-auto pt-6 text-[11px] text-white/20 text-center">
          © 2026 Hugo Garrigues
        </p>
      </div>
    </div>
  )
}
