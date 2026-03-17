import { useState } from 'react'
import { useTranslation } from '@/lib/i18n/useTranslation'

type NotesComposerValues = {
  displayName: string
  title: string
  message: string
}

type NotesComposerProps = {
  open: boolean
  submitting: boolean
  error: string
  onClose: () => void
  onSubmit: (values: NotesComposerValues) => Promise<void>
}

const INITIAL_VALUES: NotesComposerValues = {
  displayName: '',
  title: '',
  message: '',
}

export function NotesComposer({ open, submitting, error, onClose, onSubmit }: NotesComposerProps) {
  const { t } = useTranslation()
  const [values, setValues] = useState(INITIAL_VALUES)

  if (!open) {
    return null
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await onSubmit(values)
    setValues(INITIAL_VALUES)
  }

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 dark:bg-black/40 p-6 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[500px] rounded-xl border border-border-subtle bg-background/95 backdrop-blur-3xl shadow-2xl overflow-hidden flex flex-col"
      >
        <div className="px-6 py-4 border-b border-border-subtle bg-black/5 dark:bg-white/5 flex items-center justify-between">
          <div className="text-[13px] font-semibold text-foreground/95">{t('notes.newNote')}</div>
          <button
            type="button"
            onClick={onClose}
            className="text-[12px] font-medium text-foreground/50 transition hover:text-foreground/90"
          >
            {t('notes.close')}
          </button>
        </div>

        <div className="p-6 pb-2 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-widest text-foreground/40">{t('notes.fieldDisplayName')}</span>
            <input
              aria-label={t('notes.fieldDisplayName')}
              value={values.displayName}
              onChange={(event) => setValues((current) => ({ ...current, displayName: event.target.value }))}
              className="w-full rounded-lg border border-border-subtle bg-black/5 dark:bg-white/[0.03] px-3.5 py-2.5 text-[13px] text-foreground/90 outline-none focus:border-[var(--accent-color)]/50 transition-colors"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-widest text-foreground/40">{t('notes.fieldTitle')}</span>
            <input
              aria-label={t('notes.fieldTitle')}
              value={values.title}
              onChange={(event) => setValues((current) => ({ ...current, title: event.target.value }))}
              className="w-full rounded-lg border border-border-subtle bg-black/5 dark:bg-white/[0.03] px-3.5 py-2.5 text-[13px] text-foreground/90 outline-none focus:border-[var(--accent-color)]/50 transition-colors"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-widest text-foreground/40">{t('notes.fieldMessage')}</span>
            <textarea
              aria-label={t('notes.fieldMessage')}
              value={values.message}
              onChange={(event) => setValues((current) => ({ ...current, message: event.target.value }))}
              className="min-h-32 w-full rounded-lg border border-border-subtle bg-black/5 dark:bg-white/[0.03] px-3.5 py-3 text-[13px] text-foreground/90 outline-none focus:border-[var(--accent-color)]/50 transition-colors resize-none"
            />
          </label>
        </div>

        {error ? (
          <p className="px-6 text-[12px] text-red-500">{error}</p>
        ) : null}

        <div className="px-6 py-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border-subtle bg-black/5 dark:bg-white/[0.05] px-4 py-1.5 text-[12px] font-medium text-foreground/80 hover:bg-black/10 dark:hover:bg-white/[0.08] transition-colors"
          >
            {t('notes.close')}
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-[var(--accent-color)] px-4 py-1.5 text-[12px] font-semibold text-white shadow-[0_0_12px_var(--accent-color)_inset] shadow-[var(--accent-color)]/30 disabled:opacity-40 transition-colors"
          >
            {submitting ? t('notes.submitting') : t('notes.submit')}
          </button>
        </div>
      </form>
    </div>
  )
}
