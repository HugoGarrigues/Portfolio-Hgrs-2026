import { formatNotesCardDate } from '@/lib/notes/date-format'
import { useTranslation } from '@/lib/i18n/useTranslation'
import type { Note, NotesViewMode } from './types'

type NoteCardProps = {
  note: Note
  selected: boolean
  onSelect: (id: string) => void
  viewMode: NotesViewMode
}

export function NoteCard({ note, selected, onSelect, viewMode }: NoteCardProps) {
  const { locale } = useTranslation()

  if (viewMode === 'list') {
    return (
      <button
        type="button"
        aria-label={`Open note ${note.title}`}
        onClick={() => onSelect(note.id)}
        className={`group flex w-full items-center gap-4 rounded-lg border px-4 py-3 text-left transition duration-150 ${selected
            ? 'border-[var(--accent-color)]/30 bg-[var(--accent-color)]/10'
            : 'border-border-subtle bg-black/5 dark:bg-white/[0.03] hover:bg-black/10 dark:hover:bg-white/[0.06]'
          }`}
      >
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[13px] font-semibold tracking-tight text-foreground/95">
            {note.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-foreground/68">
            {note.content}
          </p>
          <div className="mt-2 flex flex-col text-[11px] text-foreground/48">
            <span>{note.authorName}</span>
            <span>{formatNotesCardDate(note.createdAt, locale)}</span>
          </div>
        </div>
      </button>
    )
  }

  return (
    <button
      type="button"
      aria-label={`Open note ${note.title}`}
      onClick={() => onSelect(note.id)}
      className={`group flex min-h-[160px] w-full flex-col rounded-xl border p-4 text-left transition duration-150 ${selected
          ? 'border-[var(--accent-color)]/30 bg-[var(--accent-color)]/10 shadow-[0_0_0_1px_rgba(var(--accent-color),0.1)]'
          : 'border-border-subtle bg-black/5 dark:bg-white/[0.03] hover:border-border-subtle hover:bg-black/10 dark:hover:bg-white/[0.06]'
        }`}
    >
      <div className="rounded-lg border border-white/6 bg-black/[0.06] px-4 py-4 dark:bg-white/[0.03]">
        <h3 className="truncate text-[13px] font-semibold tracking-tight text-foreground/95">
          {note.title}
        </h3>
        <p className="mt-3 line-clamp-5 text-[12px] leading-relaxed text-foreground/72">
          {note.content}
        </p>
      </div>

      <div className="mt-3 flex flex-col gap-0.5 px-1 text-[11px] text-foreground/48">
        <span>{note.authorName}</span>
        <span>{formatNotesCardDate(note.createdAt, locale)}</span>
      </div>
    </button>
  )
}
