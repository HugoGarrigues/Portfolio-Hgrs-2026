import { useTranslation } from '@/lib/i18n/useTranslation'

type NotesEditorFooterProps = {
  publishMode: boolean
  displayName: string
  onDisplayNameChange: (value: string) => void
  onCancel: () => void
  onPublish: () => void
  submitting: boolean
  canSubmit: boolean
}

export function NotesEditorFooter({
  publishMode,
  displayName,
  onDisplayNameChange,
  onCancel,
  onPublish,
  submitting,
  canSubmit,
}: NotesEditorFooterProps) {
  const { t } = useTranslation()

  return (
    <div className="border-t border-border-subtle bg-black/[0.02] px-8 py-6 dark:bg-white/[0.02]">
      {publishMode ? (
        <div className="mx-auto mb-5 max-w-sm">
          <label className="block text-left">
            <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/40">
              {t('notes.fieldDisplayName')}
            </span>
            <input
              aria-label={t('notes.fieldDisplayName')}
              value={displayName}
              onChange={(event) => onDisplayNameChange(event.target.value)}
              className="w-full rounded-2xl border border-border-subtle bg-black/5 px-4 py-3 text-[13px] text-foreground/90 outline-none transition-colors focus:border-[var(--accent-color)]/50 dark:bg-white/[0.03]"
            />
          </label>
        </div>
      ) : null}

      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="min-w-[112px] rounded-full border border-border-subtle bg-black/5 px-5 py-2 text-[12px] font-medium text-foreground/75 transition-colors hover:bg-black/10 dark:bg-white/[0.05] dark:hover:bg-white/[0.08]"
        >
          {t('notes.cancel')}
        </button>
        <button
          type="button"
          onClick={onPublish}
          disabled={publishMode ? !canSubmit || submitting : false}
          className="min-w-[112px] rounded-full bg-[var(--accent-color)] px-5 py-2 text-[12px] font-semibold text-white transition-colors disabled:opacity-40"
        >
          {submitting ? t('notes.submitting') : t('notes.publishConfirm')}
        </button>
      </div>
    </div>
  )
}
