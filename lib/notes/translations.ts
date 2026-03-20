import type { Locale } from '@/lib/i18n/locales'
import type { NoteTranslationRecord } from '@/components/apps/notes/types'

export function resolveOwnerNoteTranslation(
  locale: Locale,
  translations: NoteTranslationRecord[] | undefined,
) {
  if (!translations?.length) {
    return null
  }

  return translations.find((translation) => translation.locale === locale) ?? null
}
