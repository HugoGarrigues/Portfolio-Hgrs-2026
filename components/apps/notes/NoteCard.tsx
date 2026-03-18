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
  const preview = note.content.trim() || note.title

  if (viewMode === 'list') {
    return (
      <button
        type="button"
        aria-label={`Open note ${note.title}`}
        onClick={() => onSelect(note.id)}
        className={`group flex w-full items-start gap-4 rounded-2xl border px-4 py-3.5 text-left transition duration-150 ${
          selected
            ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/8 shadow-[0_0_0_1px_color-mix(in_srgb,var(--accent-color)_40%,transparent)]'
            : 'border-border-subtle bg-black/5 dark:bg-white/[0.03] hover:bg-black/10 dark:hover:bg-white/[0.06]'
          }`}
      >
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-[12px] leading-relaxed text-foreground/72">
            {preview}
          </p>
          <div className="mt-3 flex items-center justify-between gap-3 text-[11px] text-foreground/48">
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
      className="group flex w-full flex-col text-left transition duration-150"
    >
      <div
        className={`min-h-[168px] rounded-[18px] border px-4 py-4 ${
          selected
            ? 'border-[var(--accent-color)] bg-black/[0.03] shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--accent-color)_35%,transparent)] dark:bg-white/[0.03]'
            : 'border-border-subtle bg-black/[0.03] dark:bg-white/[0.03]'
        }`}
      >
        <p className="line-clamp-6 text-[12px] leading-relaxed text-foreground/78">
          {preview}
        </p>
      </div>

      <div className="mt-3 flex flex-col gap-0.5 px-2 text-center text-[11px]">
        <span className="truncate font-medium text-foreground/82">{note.authorName}</span>
        <span className="text-foreground/48">{formatNotesCardDate(note.createdAt, locale)}</span>
      </div>
    </button>
  )
}
