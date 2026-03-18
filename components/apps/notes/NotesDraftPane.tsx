import { useTranslation } from '@/lib/i18n/useTranslation'
import { NotesEditorFooter } from './NotesEditorFooter'

type NotesDraftPaneProps = {
  content: string
  title: string
  displayName: string
  publishMode: boolean
  submitting: boolean
  error: string
  onContentChange: (value: string) => void
  onTitleChange: (value: string) => void
  onDisplayNameChange: (value: string) => void
  onPublish: () => void
  onCancel: () => void
}

export function NotesDraftPane({
  content,
  title,
  displayName,
  publishMode,
  submitting,
  error,
  onContentChange,
  onTitleChange,
  onDisplayNameChange,
  onPublish,
  onCancel,
}: NotesDraftPaneProps) {
  const { t } = useTranslation()
  const canPublish = content.trim().length > 0
  const canSubmit = canPublish && title.trim().length > 0 && displayName.trim().length > 0

  return (
    <section
      aria-label="Note editor"
      className="flex flex-1 flex-col overflow-hidden border-t border-border-subtle bg-black/[0.01] dark:bg-white/[0.01] xl:border-t-0"
    >
      <div className="border-b border-border-subtle px-10 py-6 text-center">
        <h2 className="text-[16px] font-semibold tracking-tight text-foreground/90">
          {t('notes.draftHeading')}
        </h2>
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
        {error ? (
          <p className="mt-4 text-[12px] text-red-300">{error}</p>
        ) : null}
      </div>

      <NotesEditorFooter
        publishMode={publishMode}
        title={title}
        displayName={displayName}
        onTitleChange={onTitleChange}
        onDisplayNameChange={onDisplayNameChange}
        onCancel={onCancel}
        onPublish={onPublish}
        submitting={submitting}
        canSubmit={canSubmit}
      />
    </section>
  )
}
