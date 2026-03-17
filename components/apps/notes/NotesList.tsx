import { useTranslation } from '@/lib/i18n/useTranslation'
import { NoteCard } from './NoteCard'
import type { Note } from './types'

type NotesListProps = {
  notes: Note[]
  selectedNoteId: string | null
  onSelectNote: (id: string) => void
}

export function NotesList({ notes, selectedNoteId, onSelectNote }: NotesListProps) {
  const { t } = useTranslation()

  if (notes.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center px-10 py-12">
        <div className="max-w-sm text-center">
          <h3 className="text-[13px] font-medium tracking-tight text-foreground/80">
            {t('notes.emptyTitle')}
          </h3>
          <p className="mt-2 text-[12px] leading-relaxed text-foreground/50">
            {t('notes.emptyBody')}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div aria-label="Notes gallery" className="flex-1 overflow-y-auto px-6 py-6">
      <h3 className="px-1 text-[10px] font-bold text-foreground/30 uppercase tracking-widest">
        {t('notes.galleryHeading')}
      </h3>
      <div className="mt-4 grid gap-4 grid-cols-1 sm:grid-cols-2">
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            selected={note.id === selectedNoteId}
            onSelect={onSelectNote}
          />
        ))}
      </div>
    </div>
  )
}
