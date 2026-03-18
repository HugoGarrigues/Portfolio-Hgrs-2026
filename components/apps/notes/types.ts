export type NoteRecord = {
  id: string
  title: string
  content: string
  author_name: string
  source?: NoteSource
  status?: NoteStatus
  created_at: string
}

export type NoteSource = 'owner' | 'visitor'

export type NoteStatus = 'published' | 'trashed'

export type Note = {
  id: string
  title: string
  content: string
  authorName: string
  source: NoteSource
  status: NoteStatus
  createdAt: string
}

export type NotesCooldown = {
  nextAllowedAt: string | null
}

export type NotesResponse = {
  notes: NoteRecord[]
  cooldown?: NotesCooldown
}

export type NotesViewMode = 'gallery' | 'list'

export type DraftNote = {
  content: string
  displayName: string
  publishMode: boolean
  createdAt: string
}

export type CreateNoteResponse = {
  note: NoteRecord
  cooldown: NotesCooldown
}

export function mapNoteRecord(record: NoteRecord): Note {
  return {
    id: record.id,
    title: record.title,
    content: record.content,
    authorName: record.author_name,
    source: record.source ?? 'visitor',
    status: record.status ?? 'published',
    createdAt: record.created_at,
  }
}
