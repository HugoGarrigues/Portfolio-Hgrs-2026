import { useTranslation } from '@/lib/i18n/useTranslation'
import { NoteCard } from './NoteCard'
import type { Note } from './types'

type NotesListProps = {
  notes: Note[]
}

export function NotesList({ notes }: NotesListProps) {
  const { t } = useTranslation()

  if (notes.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center px-8">
        <div className="max-w-sm text-center">
          <h3 className="text-[13px] font-medium tracking-tight uppercase text-foreground/80">
            {t('notes.emptyTitle')}
          </h3>
          <p className="mt-3 text-[12px] leading-6 text-foreground/45">
            {t('notes.emptyBody')}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-4 p-6 md:grid-cols-2">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  )
}
