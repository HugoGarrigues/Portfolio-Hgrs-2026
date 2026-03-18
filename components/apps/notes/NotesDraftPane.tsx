import { useTranslation } from '@/lib/i18n/useTranslation'

type NotesDraftPaneProps = {
  content: string
  onContentChange: (value: string) => void
  onPublish: () => void
  onCancel: () => void
}

export function NotesDraftPane({
  content,
  onContentChange,
  onPublish,
  onCancel,
}: NotesDraftPaneProps) {
  const { t } = useTranslation()
  const canPublish = content.trim().length > 0

  return (
    <section
      aria-label="Note editor"
      className="hidden flex-1 flex-col overflow-hidden bg-black/[0.01] dark:bg-white/[0.01] xl:flex"
    >
      <div className="border-b border-border-subtle px-10 py-6 flex items-center justify-between">
        <h2 className="text-[16px] font-semibold tracking-tight text-foreground/90">
          {t('notes.draftHeading')}
        </h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-border-subtle bg-black/5 dark:bg-white/[0.05] px-3.5 py-1.5 text-[12px] font-medium text-foreground/70 hover:bg-black/10 dark:hover:bg-white/[0.08] transition-colors"
          >
            {t('notes.cancel')}
          </button>
          <button
            type="button"
            onClick={onPublish}
            disabled={!canPublish}
            className="rounded-lg bg-[var(--accent-color)] px-3.5 py-1.5 text-[12px] font-semibold text-white shadow-[0_0_12px_var(--accent-color)_inset] shadow-[var(--accent-color)]/30 disabled:opacity-40 transition-colors"
          >
            {t('notes.publishConfirm')}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-10 py-6">
        <textarea
          aria-label={t('notes.draftHeading')}
          value={content}
          onChange={(event) => onContentChange(event.target.value)}
          placeholder={t('notes.draftPlaceholder')}
          className="w-full h-full min-h-[200px] resize-none bg-transparent text-[14px] leading-relaxed text-foreground/85 outline-none placeholder:text-foreground/25"
          autoFocus
        />
      </div>
    </section>
  )
}
