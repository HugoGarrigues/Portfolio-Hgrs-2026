import { useTranslation } from '@/lib/i18n/useTranslation'

import type { NoteTag } from './types'

type NotesSidebarProps = {
  ownerCount: number
  visitorCount: number
  trashedCount: number
  tags: NoteTag[]
  activeTagSlug: string | null
  activeSection: 'owner' | 'visitor' | 'trashed'
  onSelectSection: (section: 'owner' | 'visitor' | 'trashed') => void
  onSelectTag: (tagSlug: string | null) => void
}

export function NotesSidebar({
  ownerCount,
  visitorCount,
  trashedCount,
  tags,
  activeTagSlug,
  activeSection,
  onSelectSection,
  onSelectTag,
}: NotesSidebarProps) {
  const { t } = useTranslation()

  return (
    <aside className="notes-sidebar flex h-full w-[190px] shrink-0 flex-col overflow-y-auto rounded-2xl border border-border-subtle bg-black/5 pb-3 pt-10 shadow-xl backdrop-blur-3xl dark:bg-black/[0.04] dark:bg-white/[0.04]">
      <div className="mb-4">
        <p className="mb-2 px-5 text-[10px] font-medium tracking-wide text-foreground/34 select-none">
          {t('notes.sidebarAccount')}
        </p>
        <div className="flex flex-col gap-0.5">
          <button
            type="button"
            onClick={() => onSelectSection('owner')}
            aria-label={t('notes.mine')}
            className={`w-[calc(100%-16px)] mx-2 flex items-center gap-3 rounded-lg px-3 py-1.5 text-[13px] transition-all ${
              activeSection === 'owner'
                ? 'bg-black/5 font-semibold text-[var(--accent-color)] dark:bg-black/10 dark:bg-white/10'
                : 'text-foreground/60 hover:bg-black/[0.05] hover:text-foreground dark:hover:bg-white/[0.08]'
            }`}
          >
            <div className="flex h-4 w-4 shrink-0 items-center justify-center">
              <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 1.5h5.5l3 3V14a.5.5 0 0 1-.5.5H4a.5.5 0 0 1-.5-.5V2a.5.5 0 0 1 .5-.5Zm5.5 0V4.5H12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="truncate">{t('notes.mine')}</span>
            <span className="ml-auto shrink-0 text-[12px]">{ownerCount}</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectSection('visitor')}
            aria-label={t('notes.visitors')}
            className={`w-[calc(100%-16px)] mx-2 flex items-center gap-3 rounded-lg px-3 py-1.5 text-[13px] transition-all ${
              activeSection === 'visitor'
                ? 'bg-black/5 font-semibold text-[var(--accent-color)] dark:bg-black/10 dark:bg-white/10'
                : 'text-foreground/60 hover:bg-black/[0.05] hover:text-foreground dark:hover:bg-white/[0.08]'
            }`}
          >
            <div className="flex h-4 w-4 shrink-0 items-center justify-center">
              <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 13.5v-1a2.5 2.5 0 0 1 2.5-2.5h5A2.5 2.5 0 0 1 13 12.5v1M8 8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="truncate">{t('notes.visitors')}</span>
            <span className="ml-auto shrink-0 text-[12px]">{visitorCount}</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectSection('trashed')}
            aria-label={t('notes.recentlyDeleted')}
            className={`w-[calc(100%-16px)] mx-2 flex items-center gap-3 rounded-lg px-3 py-1.5 text-[13px] transition-all ${
              activeSection === 'trashed'
                ? 'bg-black/5 font-semibold text-[var(--accent-color)] dark:bg-black/10 dark:bg-white/10'
                : 'text-foreground/60 hover:bg-black/[0.05] hover:text-foreground dark:hover:bg-white/[0.08]'
            }`}
          >
            <div className="flex h-4 w-4 shrink-0 items-center justify-center">
              <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.5 4h11 M4 4V13.5a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4 M6 4V2.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1V4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="truncate">{t('notes.recentlyDeleted')}</span>
            <span className="ml-auto shrink-0 text-[12px]">{trashedCount}</span>
          </button>
        </div>
      </div>

      <div className="mb-4">
        <p className="mb-2 px-5 text-[10px] font-bold uppercase tracking-widest text-foreground/30 select-none">
          {t('notes.sidebarTags')}
        </p>
        <div className="flex flex-col gap-0.5">
          <button
            type="button"
            onClick={() => onSelectTag(null)}
            aria-label={t('notes.allTags')}
            className={`w-[calc(100%-16px)] mx-2 flex items-center gap-3 rounded-lg px-3 py-1.5 text-[13px] transition-all ${
              activeTagSlug === null
                ? 'bg-black/5 font-semibold text-[var(--accent-color)] dark:bg-black/10 dark:bg-white/10'
                : 'text-foreground/60 hover:bg-black/[0.05] hover:text-foreground dark:hover:bg-white/[0.08]'
            }`}
          >
            <span className="text-foreground/40">#</span>
            <span className="truncate">{t('notes.allTags')}</span>
          </button>
          {tags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => onSelectTag(tag.slug)}
              aria-label={`Filter by tag ${tag.label}`}
              className={`w-[calc(100%-16px)] mx-2 flex items-center gap-3 rounded-lg px-3 py-1.5 text-[13px] transition-all ${
                activeTagSlug === tag.slug
                  ? 'bg-black/5 font-semibold text-[var(--accent-color)] dark:bg-black/10 dark:bg-white/10'
                  : 'text-foreground/60 hover:bg-black/[0.05] hover:text-foreground dark:hover:bg-white/[0.08]'
              }`}
            >
              <span className="text-foreground/40">#</span>
              <span className="truncate">{tag.label}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}
