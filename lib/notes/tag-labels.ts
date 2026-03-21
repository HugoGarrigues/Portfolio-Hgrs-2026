import type { NoteTag } from '@/components/apps/notes/types'

type Translate = (key: string) => string

export function getLocalizedNoteTagLabel(
  tag: Pick<NoteTag, 'slug' | 'label'>,
  t: Translate,
): string {
  const translationKey = `notes.tag.${tag.slug}`
  const translated = t(translationKey)

  return translated === translationKey ? tag.label : translated
}

export function localizeNoteTag(tag: NoteTag, t: Translate): NoteTag {
  return {
    ...tag,
    label: getLocalizedNoteTagLabel(tag, t),
  }
}
