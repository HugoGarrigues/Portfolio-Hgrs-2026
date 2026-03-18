import type { Note, NotesViewMode } from './types'

type NoteCardProps = {
  note: Note
  selected: boolean
  onSelect: (id: string) => void
  viewMode: NotesViewMode
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
  }).format(new Date(date))
}

export function NoteCard({ note, selected, onSelect, viewMode }: NoteCardProps) {
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
          <p className="mt-0.5 truncate text-[11px] text-foreground/50">
            {note.authorName} · {note.content}
          </p>
        </div>
        <p className="shrink-0 text-[10px] uppercase tracking-widest text-foreground/40">
          {formatDate(note.createdAt)}
        </p>
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
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-[13px] font-semibold tracking-tight text-foreground/95">
            {note.title}
          </h3>
          <p className="mt-1 truncate text-[11px] text-foreground/50">{note.authorName}</p>
        </div>
        <p className="shrink-0 pt-0.5 text-[10px] uppercase tracking-widest text-foreground/40">
          {formatDate(note.createdAt)}
        </p>
      </div>

      <p className="line-clamp-4 text-[12px] leading-relaxed text-foreground/70">
        {note.content}
      </p>
    </button>
  )
}
