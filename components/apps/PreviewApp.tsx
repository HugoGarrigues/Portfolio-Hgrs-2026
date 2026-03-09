'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useWindow } from '@/components/desktop/Window'
import * as pdfjsLib from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'

// ─── Icons ────────────────────────────────────────────────────────────────────

function Ico({ d, className = '' }: { d: string; className?: string }) {
  return (
    <svg className={`shrink-0 ${className}`} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d={d} stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const ICONS = {
  download: 'M8 2v8.5M4.5 7.5 8 11l3.5-3.5M3 13.5h10',
  warn:     'M8 2.5 1.5 13h13L8 2.5ZM8 7v3.5M8 12v.5',
}

const PDF_PATH = '/cv/hugo-garrigues-cv.pdf'
const RENDER_SCALE = 2

// ─── PDF page as canvas image ────────────────────────────────────────────────

function PdfPage({ page }: { page: pdfjsLib.PDFPageProxy }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let cancelled = false
    const viewport = page.getViewport({ scale: RENDER_SCALE })

    canvas.width = viewport.width
    canvas.height = viewport.height

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const task = page.render({ canvasContext: ctx, canvas, viewport })
    task.promise.catch((err: unknown) => {
      if (!cancelled) console.error('PDF render error:', err)
    })

    return () => {
      cancelled = true
      task.cancel()
    }
  }, [page])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-auto rounded-sm shadow-[0_2px_16px_rgba(0,0,0,0.5)]"
    />
  )
}

// ─── PreviewApp ──────────────────────────────────────────────────────────────

export function PreviewApp() {
  const { dragControls } = useWindow()
  const onDragStart = (e: React.PointerEvent) => dragControls.start(e)

  const [pages, setPages] = useState<pdfjsLib.PDFPageProxy[]>([])
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadPdf() {
      try {
        const doc = await pdfjsLib.getDocument(PDF_PATH).promise
        const loaded: pdfjsLib.PDFPageProxy[] = []

        for (let i = 1; i <= doc.numPages; i++) {
          if (cancelled) return
          loaded.push(await doc.getPage(i))
        }

        if (!cancelled) setPages(loaded)
      } catch (err) {
        console.error('PDF load error:', err)
        if (!cancelled) setError(true)
      }
    }

    loadPdf()
    return () => { cancelled = true }
  }, [])

  const handleDownload = useCallback(() => {
    const a = document.createElement('a')
    a.href = PDF_PATH
    a.download = 'hugo-garrigues-cv.pdf'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }, [])

  return (
    <div className="h-full flex p-2 gap-2 overflow-hidden text-white font-sans bg-[#161616]">
      <div className="flex-1 flex flex-col bg-white/[0.02] rounded-2xl border border-white/[0.03] overflow-hidden">

        {/* ── Toolbar ── */}
        <nav
          onPointerDown={onDragStart}
          className="relative h-12 flex items-center px-6 select-none border-b border-white/[0.03] cursor-grab active:cursor-grabbing"
        >
          <span className="absolute inset-0 flex items-center justify-center text-[13px] font-bold text-white/95 tracking-tight pointer-events-none select-none px-24">
            hugo-garrigues-cv.pdf
          </span>

          <div
            onPointerDown={(e) => e.stopPropagation()}
            className="ml-auto pointer-events-auto z-10"
          >
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 text-[12px] font-semibold px-3.5 py-1.5 rounded-lg transition-all active:scale-95 bg-blue-600 hover:bg-blue-500 text-white cursor-default shadow-lg shadow-blue-900/40"
            >
              <Ico d={ICONS.download} className="w-3.5 h-3.5" />
              Enregistrer
            </button>
          </div>
        </nav>

        {/* ── Content ── */}
        <div className="flex-1 overflow-y-auto">
          {error ? (
            <div className="h-full flex flex-col items-center justify-center gap-4 text-white/40 text-sm px-8 text-center">
              <Ico d={ICONS.warn} className="w-6 h-6 text-red-400/60" />
              <p>Impossible de charger le PDF.</p>
              <button
                onClick={handleDownload}
                className="text-[12px] text-blue-400 hover:text-blue-300 underline underline-offset-2 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none"
              >
                Télécharger une copie
              </button>
            </div>
          ) : pages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-white/20 text-sm">
              Chargement…
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6">
              {pages.map((page, i) => (
                <PdfPage key={i} page={page} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
