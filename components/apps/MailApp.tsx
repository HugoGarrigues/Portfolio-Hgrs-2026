'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useWindow } from '@/components/desktop/Window'
import { useNotifications } from '@/hooks/useNotifications'
import { useTranslation } from '@/lib/i18n/useTranslation'

// ─── Icons ────────────────────────────────────────────────────────────────────

function Ico({ d, className = '' }: { d: string; className?: string }) {
  return (
    <svg className={`shrink-0 ${className}`} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d={d} stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const ICONS = {
  send: 'M13 3L2 7.5l4.5 2L13 3ZM6.5 9.5L9 13l4-10',
  check: 'M2.5 8.5L6 12l7.5-8',
  warn: 'M8 2.5 1.5 13h13L8 2.5ZM8 7v3.5M8 12v.5',
}

// ─── Sending dots ────────────────────────────────────────────────────────────

function SendingDots() {
  return (
    <span className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1 h-1 rounded-full bg-current"
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
        />
      ))}
    </span>
  )
}

// ─── Animated checkmark (inline, small for button) ───────────────────────────

function ButtonCheck() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
      <motion.path
        d="M2.5 8.5L6 12l7.5-8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
    </svg>
  )
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
    <div className="flex items-center h-11 px-6 border-b border-border-subtle gap-3">
      <span className="w-14 shrink-0 text-[12px] text-foreground/25 select-none text-right">{label}</span>
      <input
        type={type}
        value={value}
        readOnly={readOnly}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className={`flex-1 bg-transparent text-[13px] outline-none border-none placeholder:text-foreground/20 ${readOnly ? 'text-foreground/25 cursor-default select-none' : invalid ? 'text-red-400/80' : 'text-foreground/90'
          }`}
      />
    </div>
  )
}

// ─── Button content by status ────────────────────────────────────────────────

const BUTTON_KEYS: Record<Status, { icon: 'send' | 'check' | 'warn'; textKey: string }> = {
  idle: { icon: 'send', textKey: 'mail.send' },
  sending: { icon: 'send', textKey: 'mail.sending' },
  sent: { icon: 'check', textKey: 'mail.sent' },
  error: { icon: 'warn', textKey: 'mail.error' },
}

function ButtonContent({ status }: { status: Status }) {
  const { t } = useTranslation()
  const { icon, textKey } = BUTTON_KEYS[status]

  return (
    <motion.span
      key={status}
      className="flex items-center gap-2"
      initial={false}
      animate={status === 'error' ? { x: [0, -4, 3, -2, 0] } : undefined}
      transition={{ duration: 0.3 }}
    >
      {icon === 'check' ? <ButtonCheck /> : <Ico d={ICONS[icon]} className="w-3.5 h-3.5" />}
      {status === 'sending' ? <SendingDots /> : t(textKey)}
    </motion.span>
  )
}

// ─── MailApp ──────────────────────────────────────────────────────────────────

type Status = 'idle' | 'sending' | 'sent' | 'error'

export function MailApp() {
  const { dragControls } = useWindow()
  const { t } = useTranslation()
  const { pushError } = useNotifications()
  const onDragStart = (e: React.PointerEvent) => dragControls.start(e)

  const [form, setForm] = useState({ nom: '', email: '', objet: '', message: '' })
  const [status, setStatus] = useState<Status>('idle')
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
  const canSend = form.nom.trim() && emailValid && form.objet.trim() && form.message.trim()

  // Auto-dismiss sent/error back to idle after delay
  useEffect(() => {
    if (status === 'sent') {
      dismissTimer.current = setTimeout(() => {
        setStatus('idle')
      }, 3000)
    }
    if (status === 'error') {
      dismissTimer.current = setTimeout(() => {
        setStatus('idle')
      }, 3000)
    }
    return () => {
      if (dismissTimer.current) clearTimeout(dismissTimer.current)
    }
  }, [status])

  function setField(field: keyof typeof form) {
    return (v: string) => setForm((prev) => ({ ...prev, [field]: v }))
  }

  async function handleSend() {
    if (!canSend || status === 'sending') return
    setStatus('sending')

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
        throw new Error(data.error ?? t('mail.serverError'))
      }

      setStatus('sent')
      setForm({ nom: '', email: '', objet: '', message: '' })
    } catch (e) {
      setStatus('error')
      pushError({
        title: t('mail.serverError'),
        message: e instanceof Error ? e.message : t('mail.genericError'),
        source: 'Mail',
      })
    }
  }

  // Button color based on status
  const btnClass =
    status === 'sent'
      ? 'bg-green-600 text-white cursor-default shadow-lg shadow-green-900/40' // keep green for success
      : status === 'error'
        ? 'bg-red-500/80 text-white cursor-pointer shadow-lg shadow-red-900/40'
        : !canSend || status === 'sending'
          ? 'bg-black/[0.05] dark:bg-white/[0.05] text-foreground/25 cursor-default'
          : 'bg-[var(--accent-color)] opacity-90 hover:opacity-100 text-white cursor-default shadow-[0_0_12px_var(--accent-color)_inset] shadow-[var(--accent-color)]/40'

  return (
    <div className="h-full flex p-2 gap-2 overflow-hidden text-foreground font-sans bg-background">
      <div className="flex-1 flex flex-col bg-black/[0.03] dark:bg-white/[0.02] rounded-2xl border border-border-subtle overflow-hidden">

        {/* ── Toolbar ── */}
        <nav
          onPointerDown={onDragStart}
          className="relative h-12 flex items-center px-6 select-none border-b border-border-subtle cursor-grab active:cursor-grabbing"
        >
          <span className="absolute inset-0 flex items-center justify-center text-[13px] font-bold text-foreground/95 tracking-tight pointer-events-none select-none">
            {t('mail.newMessage')}
          </span>

          <div
            onPointerDown={(e) => e.stopPropagation()}
            className="ml-auto pointer-events-auto z-10"
          >
            <motion.button
              onClick={status === 'error' ? () => setStatus('idle') : handleSend}
              disabled={status === 'sending' || status === 'sent' || (status === 'idle' && !canSend)}
              whileTap={canSend && status === 'idle' ? { scale: 0.92 } : undefined}
              className={`flex items-center gap-2 text-[12px] font-semibold px-3.5 py-1.5 rounded-lg transition-colors duration-200 ${btnClass}`}
              aria-live={status === 'sending' || status === 'sent' || status === 'error' ? 'polite' : undefined}
            >
              <ButtonContent status={status} />
            </motion.button>
          </div>
        </nav>

        {/* ── Header fields ── */}
        <FieldRow label={t('mail.fieldName')} value={form.nom} onChange={setField('nom')} placeholder={t('mail.placeholderName')} />
        <FieldRow label={t('mail.fieldEmail')} value={form.email} onChange={setField('email')} placeholder={t('mail.placeholderEmail')} type="email" invalid={form.email.length > 0 && !emailValid} />
        <FieldRow label={t('mail.fieldSubject')} value={form.objet} onChange={setField('objet')} placeholder={t('mail.placeholderSubject')} />

        {/* ── Body ── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <textarea
            value={form.message}
            onChange={(e) => setField('message')(e.target.value)}
            placeholder={t('mail.placeholderMessage')}
            className="flex-1 w-full bg-transparent text-[13px] text-foreground/80 placeholder:text-foreground/20 outline-none resize-none px-6 py-5 leading-relaxed"
          />
        </div>
      </div>
    </div>
  )
}
