import type { Note } from './types'

type NoteCardProps = {
  note: Note
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

export function NoteCard({ note }: NoteCardProps) {
  return (
    <article className="rounded-2xl border border-border-subtle bg-white/[0.04] p-4 shadow-lg shadow-black/10">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[13px] font-semibold text-foreground/95">{note.title}</h3>
          <p className="mt-1 text-[11px] text-foreground/45">{note.authorName}</p>
        </div>
        <p className="text-[10px] uppercase tracking-widest text-foreground/25">{formatDate(note.createdAt)}</p>
      </div>

      <p className="text-[12px] leading-6 text-foreground/80">{note.content}</p>
    </article>
  )
}
