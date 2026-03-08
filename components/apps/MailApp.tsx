'use client'

import { useState } from 'react'
import { useWindow } from '@/components/desktop/Window'

// ─── Icons ────────────────────────────────────────────────────────────────────

function Ico({ d, className = '' }: { d: string; className?: string }) {
  return (
    <svg className={`shrink-0 ${className}`} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d={d} stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const ICONS = {
  send:  'M13 3L2 7.5l4.5 2L13 3ZM6.5 9.5L9 13l4-10',
  check: 'M2.5 8.5L6 12l7.5-8',
  warn:  'M8 2.5 1.5 13h13L8 2.5ZM8 7v3.5M8 12v.5',
}

// ─── Field row ────────────────────────────────────────────────────────────────

function FieldRow({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  readOnly = false,
  invalid = false,
}: {
  label: string
  value: string
  onChange?: (v: string) => void
  placeholder?: string
  type?: string
  readOnly?: boolean
  invalid?: boolean
}) {
  return (
    <div className="flex items-center h-11 px-6 border-b border-white/[0.03] gap-3">
      <span className="w-14 shrink-0 text-[12px] text-white/25 select-none text-right">{label}</span>
      <input
        type={type}
        value={value}
        readOnly={readOnly}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className={`flex-1 bg-transparent text-[13px] outline-none border-none placeholder:text-white/20 ${
          readOnly ? 'text-white/25 cursor-default select-none' : invalid ? 'text-red-400/80' : 'text-white/90'
        }`}
      />
    </div>
  )
}

// ─── MailApp ──────────────────────────────────────────────────────────────────

type Status = 'idle' | 'sending' | 'sent' | 'error'

export function MailApp() {
  const { dragControls } = useWindow()
  const onDragStart = (e: React.PointerEvent) => dragControls.start(e)

  const [form, setForm] = useState({ nom: '', email: '', objet: '', message: '' })
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
  const canSend = form.nom.trim() && emailValid && form.objet.trim() && form.message.trim()

  function setField(field: keyof typeof form) {
    return (v: string) => setForm((prev) => ({ ...prev, [field]: v }))
  }

  async function handleSend() {
    if (!canSend || status === 'sending') return
    setStatus('sending')
    setErrorMsg('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.nom,
          email: form.email,
          subject: form.objet,
          message: form.message,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? 'Erreur serveur')
      }

      setStatus('sent')
      setForm({ nom: '', email: '', objet: '', message: '' })
    } catch (e) {
      setStatus('error')
      setErrorMsg(e instanceof Error ? e.message : 'Une erreur est survenue')
    }
  }

  return (
    <div className="h-full flex p-2 gap-2 overflow-hidden text-white font-sans bg-[#161616]">
      <div className="flex-1 flex flex-col bg-white/[0.02] rounded-2xl border border-white/[0.03] overflow-hidden">

        {/* ── Toolbar ── */}
        <nav
          onPointerDown={onDragStart}
          className="relative h-12 flex items-center px-6 select-none border-b border-white/[0.03] cursor-grab active:cursor-grabbing"
        >
          <span className="absolute inset-0 flex items-center justify-center text-[13px] font-bold text-white/95 tracking-tight pointer-events-none select-none">
            Nouveau message
          </span>

          <div
            onPointerDown={(e) => e.stopPropagation()}
            className="ml-auto pointer-events-auto"
          >
            <button
              onClick={handleSend}
              disabled={!canSend || status === 'sending' || status === 'sent'}
              className={`flex items-center gap-2 text-[12px] font-semibold px-3.5 py-1.5 rounded-lg transition-all active:scale-95 ${
                !canSend || status === 'sending' || status === 'sent'
                  ? 'bg-white/[0.05] text-white/25 cursor-default'
                  : 'bg-blue-600 hover:bg-blue-500 text-white cursor-default shadow-lg shadow-blue-900/40'
              }`}
            >
              <Ico d={ICONS.send} className="w-3.5 h-3.5" />
              {status === 'sending' ? 'Envoi…' : 'Envoyer'}
            </button>
          </div>
        </nav>

        {/* ── Header fields ── */}
        <FieldRow label="Nom" value={form.nom} onChange={setField('nom')} placeholder="Votre nom" />
        <FieldRow label="Email" value={form.email} onChange={setField('email')} placeholder="votre@email.com" type="email" invalid={form.email.length > 0 && !emailValid} />
        <FieldRow label="Objet" value={form.objet} onChange={setField('objet')} placeholder="Sujet de votre message" />

        {/* ── Body ── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <textarea
            value={form.message}
            onChange={(e) => setField('message')(e.target.value)}
            placeholder="Votre message…"
            className="flex-1 w-full bg-transparent text-[13px] text-white/80 placeholder:text-white/20 outline-none resize-none px-6 py-5 leading-relaxed"
          />
        </div>

        {/* ── Status bar ── */}
        {status === 'sent' && (
          <div className="flex items-center gap-2 px-6 py-2.5 border-t border-white/[0.03] text-[12px] text-green-400/80">
            <Ico d={ICONS.check} className="w-3.5 h-3.5" />
            Message envoyé — je reviendrai vers vous rapidement.
          </div>
        )}
        {status === 'error' && (
          <div className="flex items-center gap-2 px-6 py-2.5 border-t border-white/[0.03] text-[12px] text-red-400/80">
            <Ico d={ICONS.warn} className="w-3.5 h-3.5" />
            {errorMsg || 'Échec de l\'envoi. Réessayez ou contactez-moi directement.'}
          </div>
        )}
      </div>
    </div>
  )
}
