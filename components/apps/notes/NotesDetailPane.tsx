import { formatNotesDetailDate } from '@/lib/notes/date-format'
import { useTranslation } from '@/lib/i18n/useTranslation'
import type { Note } from './types'

type NotesDetailPaneProps = {
  note: Note | null
  error?: string
}

export function NotesDetailPane({ note, error = '' }: NotesDetailPaneProps) {
  const { t, locale } = useTranslation()

  if (!note && error) {
    return (
      <section
        aria-label="Note detail"
        className="flex flex-1 items-center justify-center border-t border-border-subtle bg-black/[0.01] px-8 py-10 dark:bg-white/[0.01] xl:border-t-0 xl:px-12"
      >
        <div className="max-w-sm text-center">
          <h3 className="text-[13px] font-medium tracking-tight text-red-200">
            {t('notes.serverError')}
          </h3>
          <p className="mt-2 text-[12px] leading-relaxed text-red-200/80">{error}</p>
        </div>
      </section>
    )
  }

  if (!note) {
    return (
      <section
        aria-label="Note detail"
        className="flex flex-1 items-center justify-center border-t border-border-subtle bg-black/[0.01] px-8 py-10 dark:bg-white/[0.01] xl:border-t-0 xl:px-12"
      >
        <div className="max-w-sm text-center">
          <h3 className="text-[13px] font-medium tracking-tight text-foreground/80">
            {t('notes.previewEmptyTitle')}
          </h3>
          <p className="mt-2 text-[12px] leading-relaxed text-foreground/50">
            {t('notes.previewEmptyBody')}
          </p>
        </div>
      </section>
    )
  }

  return (
    <section
      aria-label="Note detail"
      className="flex flex-1 flex-col overflow-hidden border-t border-border-subtle bg-black/[0.01] dark:bg-white/[0.01] xl:border-t-0"
    >
      <div className="px-10 pt-8 text-center">
        <p className="text-[12px] font-medium text-foreground/42">
          {formatNotesDetailDate(note.createdAt, locale)}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-10 pb-6 pt-8">
        <div className="max-w-3xl whitespace-pre-wrap text-[13px] leading-relaxed text-foreground/80">
          {note.content}
        </div>
        {note.tags.length > 0 ? (
          <div className="mt-6 flex flex-wrap gap-2">
            {note.tags.map((tag) => (
              <span
                key={tag.id}
                className="rounded-full border border-border-subtle bg-black/[0.04] px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-foreground/55 dark:bg-white/[0.04]"
              >
                {tag.label}
              </span>
            ))}
          </div>
        ) : null}
        <div className="mt-8 flex items-center gap-2 text-[12px] text-foreground/50">
          <span className="font-medium text-foreground/80">{note.authorName}</span>
          <span className="text-foreground/20">•</span>
          <span>{note.source === 'owner' ? t('notes.detailLabelOwner') : t('notes.detailLabelVisitor')}</span>
        </div>
      </div>
    </section>
  )
}
