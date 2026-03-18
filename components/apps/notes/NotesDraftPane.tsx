import { formatNotesEditorTimestamp } from '@/lib/notes/date-format'
import { useTranslation } from '@/lib/i18n/useTranslation'
import { NotesEditorFooter } from './NotesEditorFooter'

type NotesDraftPaneProps = {
  content: string
  displayName: string
  publishMode: boolean
  createdAt: string
  submitting: boolean
  onContentChange: (value: string) => void
  onDisplayNameChange: (value: string) => void
  onPublish: () => void
  onCancel: () => void
}

export function NotesDraftPane({
  content,
  displayName,
  publishMode,
  createdAt,
  submitting,
  onContentChange,
  onDisplayNameChange,
  onPublish,
  onCancel,
}: NotesDraftPaneProps) {
  const { t, locale } = useTranslation()
  const canPublish = content.trim().length > 0
  const canSubmit = canPublish && displayName.trim().length > 0

  return (
    <section
      aria-label="Note editor"
      className="flex flex-1 flex-col overflow-hidden border-t border-border-subtle bg-black/[0.01] dark:bg-white/[0.01] xl:border-t-0"
    >
      <div className="px-10 pt-8 text-center">
        <p className="text-[12px] font-medium text-foreground/42">
          {formatNotesEditorTimestamp(createdAt, locale)}
        </p>
      </div>

      <div className="h-8 shrink-0" aria-hidden="true" />

      <div className="flex-1 overflow-y-auto px-10 pb-5">
        <textarea
          aria-label={t('notes.draftHeading')}
          value={content}
          onChange={(event) => onContentChange(event.target.value)}
          placeholder={t('notes.draftPlaceholder')}
          className="mt-2 h-full min-h-[260px] w-full resize-none bg-transparent text-[14px] leading-[1.8] text-foreground/85 outline-none placeholder:text-foreground/25"
          autoFocus
        />
      </div>

      <NotesEditorFooter
        publishMode={publishMode}
        displayName={displayName}
        onDisplayNameChange={onDisplayNameChange}
        onCancel={onCancel}
        onPublish={onPublish}
        submitting={submitting}
        canSubmit={canSubmit}
      />
    </section>
  )
}
