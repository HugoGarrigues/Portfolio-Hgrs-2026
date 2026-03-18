import { useTranslation } from '@/lib/i18n/useTranslation'

type NotesEditorFooterProps = {
  publishMode: boolean
  title: string
  displayName: string
  onTitleChange: (value: string) => void
  onDisplayNameChange: (value: string) => void
  onCancel: () => void
  onPublish: () => void
  submitting: boolean
  canSubmit: boolean
}

export function NotesEditorFooter({
  publishMode,
  title,
  displayName,
  onTitleChange,
  onDisplayNameChange,
  onCancel,
  onPublish,
  submitting,
  canSubmit,
}: NotesEditorFooterProps) {
  const { t } = useTranslation()

  return (
    <div className="border-t border-border-subtle bg-black/[0.02] px-8 py-5 dark:bg-white/[0.02]">
      {publishMode ? (
        <div className="mb-4 grid gap-3 md:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-widest text-foreground/40">
              {t('notes.fieldTitle')}
            </span>
            <input
              aria-label={t('notes.fieldTitle')}
              value={title}
              onChange={(event) => onTitleChange(event.target.value)}
              className="w-full rounded-xl border border-border-subtle bg-black/5 px-3.5 py-2.5 text-[13px] text-foreground/90 outline-none transition-colors focus:border-[var(--accent-color)]/50 dark:bg-white/[0.03]"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-widest text-foreground/40">
              {t('notes.fieldDisplayName')}
            </span>
            <input
              aria-label={t('notes.fieldDisplayName')}
              value={displayName}
              onChange={(event) => onDisplayNameChange(event.target.value)}
              className="w-full rounded-xl border border-border-subtle bg-black/5 px-3.5 py-2.5 text-[13px] text-foreground/90 outline-none transition-colors focus:border-[var(--accent-color)]/50 dark:bg-white/[0.03]"
            />
          </label>
        </div>
      ) : null}

      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-border-subtle bg-black/5 px-4 py-1.5 text-[12px] font-medium text-foreground/75 transition-colors hover:bg-black/10 dark:bg-white/[0.05] dark:hover:bg-white/[0.08]"
        >
          {t('notes.cancel')}
        </button>
        <button
          type="button"
          onClick={onPublish}
          disabled={publishMode ? !canSubmit || submitting : false}
          className="rounded-lg bg-[var(--accent-color)] px-4 py-1.5 text-[12px] font-semibold text-white transition-colors disabled:opacity-40"
        >
          {submitting ? t('notes.submitting') : t('notes.publishConfirm')}
        </button>
      </div>
    </div>
  )
}
