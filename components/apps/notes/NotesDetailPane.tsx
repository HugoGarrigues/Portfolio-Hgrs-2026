import { useTranslation } from '@/lib/i18n/useTranslation'
import type { Note } from './types'

type NotesDetailPaneProps = {
  note: Note | null
}

function formatDetailDate(date: string) {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

export function NotesDetailPane({ note }: NotesDetailPaneProps) {
  const { t } = useTranslation()

  if (!note) {
    return (
      <section
        aria-label="Note detail"
        className="hidden flex-1 items-center justify-center px-12 xl:flex bg-black/[0.01] dark:bg-white/[0.01]"
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
      className="hidden flex-1 flex-col overflow-hidden bg-black/[0.01] dark:bg-white/[0.01] xl:flex"
    >
      <div className="border-b border-border-subtle px-10 py-8">
        <p className="text-[10px] uppercase tracking-widest text-foreground/40">
          {formatDetailDate(note.createdAt)}
        </p>
        <h2 className="mt-3 max-w-3xl text-[24px] font-semibold leading-tight tracking-tight text-foreground/95">
          {note.title}
        </h2>
        <div className="mt-4 flex items-center gap-2 text-[12px] text-foreground/50">
          <span className="font-medium text-foreground/80">{note.authorName}</span>
          <span className="text-foreground/20">•</span>
          <span>{t('notes.detailLabel')}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-10 py-8">
        <div className="max-w-3xl whitespace-pre-wrap text-[13px] leading-relaxed text-foreground/80">
          {note.content}
        </div>
      </div>
    </section>
  )
}
