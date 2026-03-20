import type { Locale } from '@/lib/i18n/locales'
import type { NoteRecord, NoteSource, NoteStatus, NoteTag, NoteTranslationRecord } from '@/components/apps/notes/types'
import { resolveOwnerNoteTranslation } from './translations'

type RawTagRecord = {
  id: string
  slug: string
  label: string
}

type RawNoteTagRecord = {
  tags: RawTagRecord | RawTagRecord[] | null
}

export type NotesRow = {
  id: string
  title: string
  content: string
  author_name: string
  client_id?: string
  source?: NoteSource
  status?: NoteStatus
  created_at: string
  updated_at?: string
  note_tags?: RawNoteTagRecord[] | null
  owner_note_translations?: NoteTranslationRecord[] | null
}

function flattenTags(noteTags: RawNoteTagRecord[] | null | undefined): NoteTag[] {
  if (!Array.isArray(noteTags)) {
    return []
  }

  return noteTags.flatMap((entry) => {
    if (!entry?.tags) {
      return []
    }

    const tagRecords = Array.isArray(entry.tags) ? entry.tags : [entry.tags]
    return tagRecords.map((tag) => ({
      id: tag.id,
      slug: tag.slug,
      label: tag.label,
    }))
  })
}

export function presentNoteRow(row: NotesRow, locale?: Locale): NoteRecord {
  const translation =
    row.source === 'owner' && locale
      ? resolveOwnerNoteTranslation(locale, row.owner_note_translations ?? undefined)
      : null

  return {
    id: row.id,
    title: translation?.title ?? row.title,
    content: translation?.content ?? row.content,
    author_name: row.author_name,
    source: row.source,
    status: row.status,
    created_at: row.created_at,
    tags: flattenTags(row.note_tags),
  }
}

export function presentNoteRows(rows: NotesRow[], locale?: Locale): NoteRecord[] {
  return rows.map((row) => presentNoteRow(row, locale))
}
