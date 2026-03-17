export type NoteRecord = {
  id: string
  title: string
  content: string
  author_name: string
  created_at: string
}

export type Note = {
  id: string
  title: string
  content: string
  authorName: string
  createdAt: string
}

export type NotesCooldown = {
  nextAllowedAt: string | null
}

export type NotesResponse = {
  notes: NoteRecord[]
  cooldown?: NotesCooldown
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
    createdAt: record.created_at,
  }
}
