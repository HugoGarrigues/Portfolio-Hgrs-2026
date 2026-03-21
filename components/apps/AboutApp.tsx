'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useWindow } from '@/components/desktop/Window'
import { useTranslation } from '@/lib/i18n/useTranslation'
import { useScrollbarActivity } from '@/hooks/useScrollbarActivity'

// ─── About This Mac — portfolio style ──────────────────────────────────────

export function AboutApp() {
  const { dragControls } = useWindow()
  const { t } = useTranslation()
  const scrollbarRef = useScrollbarActivity<HTMLDivElement>()
  const [imgError, setImgError] = useState(false)

  return (
    <div className="h-full flex p-2 overflow-hidden text-foreground font-sans bg-background">
    <div
      onPointerDown={(e) => dragControls.start(e)}
      className="flex-1 flex flex-col bg-black/[0.03] dark:bg-white/[0.02] rounded-2xl border border-border-subtle overflow-hidden select-text cursor-grab active:cursor-grabbing"
    >

      {/* Title bar — h-12 matches Window.tsx traffic lights zone */}
      <div className="shrink-0 h-12 flex items-center justify-center border-b border-border-subtle select-none">
        <span className="text-[13px] font-semibold text-foreground/70">{t('about.title')}</span>
      </div>

      {/* Content */}
      <div ref={scrollbarRef} className="app-scrollbar flex-1 flex flex-col items-center overflow-y-scroll overscroll-contain px-8 pt-8 pb-6">

        {/* Profile picture */}
        <div className="relative w-28 h-28 rounded-full overflow-hidden shadow-2xl shadow-black/30 ring-2 ring-white/10 mb-6 shrink-0">
          {!imgError ? (
            <Image
              src="/profile_picture.avif"
              alt="Hugo Garrigues"
              fill
              sizes="112px"
              className="object-cover"
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
        <h1 className="text-[22px] font-bold tracking-tight text-foreground">
          Hugo Garrigues
        </h1>

        {/* Subtitle */}
        <p className="text-[13px] text-foreground/40 mt-1">
          {t('about.subtitle')}
        </p>

        {/* Specs list — values only, centered */}
        <div className="mt-6 flex flex-col items-center gap-1.5 text-[13px] text-foreground/80">
          <span>{t('about.location')}</span>
          <span>{t('about.role')}</span>
          <span>{t('about.age')}</span>
        </div>

        <p className="mt-6 text-[12px] text-foreground/35 leading-relaxed text-center max-w-[280px]">
          {t('about.bio')}
        </p>

        {/* Footer */}
        <p className="mt-auto pt-6 text-[11px] text-foreground/20 text-center">
          {t('about.copyright')}
        </p>
      </div>
    </div>
    </div>
  )
}
