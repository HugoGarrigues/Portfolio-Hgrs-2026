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
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-2xl border border-border-subtle bg-[#161616] p-5 shadow-2xl shadow-black/60"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-[14px] font-semibold text-foreground/95">{t('notes.newNote')}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-[12px] text-foreground/45 transition hover:text-foreground/80"
          >
            {t('notes.close')}
          </button>
        </div>

        <div className="space-y-3">
          <label className="block">
            <span className="mb-1 block text-[12px] text-foreground/60">{t('notes.fieldDisplayName')}</span>
            <input
              aria-label={t('notes.fieldDisplayName')}
              value={values.displayName}
              onChange={(event) => setValues((current) => ({ ...current, displayName: event.target.value }))}
              className="w-full rounded-xl border border-border-subtle bg-white/[0.05] px-3 py-2 text-[13px] text-foreground/90 outline-none"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-[12px] text-foreground/60">{t('notes.fieldTitle')}</span>
            <input
              aria-label={t('notes.fieldTitle')}
              value={values.title}
              onChange={(event) => setValues((current) => ({ ...current, title: event.target.value }))}
              className="w-full rounded-xl border border-border-subtle bg-white/[0.05] px-3 py-2 text-[13px] text-foreground/90 outline-none"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-[12px] text-foreground/60">{t('notes.fieldMessage')}</span>
            <textarea
              aria-label={t('notes.fieldMessage')}
              value={values.message}
              onChange={(event) => setValues((current) => ({ ...current, message: event.target.value }))}
              className="min-h-32 w-full rounded-xl border border-border-subtle bg-white/[0.05] px-3 py-2 text-[13px] text-foreground/90 outline-none"
            />
          </label>
        </div>

        {error ? (
          <p className="mt-3 text-[12px] text-red-300">{error}</p>
        ) : null}

        <div className="mt-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border-subtle px-3 py-1.5 text-[12px] text-foreground/70"
          >
            {t('notes.close')}
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-[var(--accent-color)] px-3 py-1.5 text-[12px] font-semibold text-white disabled:opacity-40"
          >
            {submitting ? t('notes.submitting') : t('notes.submit')}
          </button>
        </div>
      </form>
    </div>
  )
}
