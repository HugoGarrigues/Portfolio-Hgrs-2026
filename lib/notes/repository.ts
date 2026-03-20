import { createSupabaseServerClient } from '@/lib/supabase-server'
import type { ValidatedCreateNoteInput } from '@/lib/notes/validation'
import type { NoteSource, NoteStatus } from '@/components/apps/notes/types'
import type { NotesRow } from './presenter'

const NOTE_SELECT = 'id,title,content,author_name,client_id,source,status,created_at,updated_at,note_tags(tags(id,slug,label)),owner_note_translations(locale,title,content)'

export type NoteSection = 'owner' | 'visitor' | 'trashed'

export async function listNotes(section: NoteSection = 'visitor') {
  const supabase = createSupabaseServerClient()
  let query = supabase
    .from('notes')
    .select(NOTE_SELECT)
    .order('created_at', { ascending: false })

  if (section === 'trashed') {
    query = query.eq('status', 'trashed')
  } else {
    query = query.eq('status', 'published').eq('source', section)
  }

  return query as Promise<{ data: NotesRow[] | null; error: unknown }>
}

export async function getLatestNoteForClient(clientId: string) {
  const supabase = createSupabaseServerClient()

  return supabase
    .from('notes')
    .select('created_at')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle() as Promise<{ data: { created_at: string } | null; error: unknown }>
}

export async function createVisitorNote(input: ValidatedCreateNoteInput & { title: string }) {
  const supabase = createSupabaseServerClient()

  return supabase
    .from('notes')
    .insert({
      title: input.title,
      content: input.message,
      author_name: input.displayName,
      client_id: input.clientId,
      source: 'visitor' satisfies NoteSource,
      status: 'published' satisfies NoteStatus,
    })
    .select(NOTE_SELECT)
    .maybeSingle() as Promise<{ data: NotesRow | null; error: unknown }>
}
