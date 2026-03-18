import { useTranslation } from '@/lib/i18n/useTranslation'
import { ComposeIcon, GridViewIcon, ListViewIcon, SearchIcon } from './icons'
import type { NotesViewMode } from './types'

type NotesToolbarProps = {
  query: string
  onQueryChange: (value: string) => void
  onCreateNote: () => void
  canCreate: boolean
  viewMode: NotesViewMode
  onToggleViewMode: () => void
}

export function NotesToolbar({
  query,
  onQueryChange,
  onCreateNote,
  canCreate,
  viewMode,
  onToggleViewMode,
}: NotesToolbarProps) {
  const { t } = useTranslation()
  const iconButtonClass =
    'flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/[0.035] text-foreground/54 shadow-sm shadow-black/5 transition-all active:scale-95 dark:bg-white/[0.04] dark:shadow-black/10 hover:bg-black/[0.055] hover:text-foreground/82 dark:hover:bg-white/[0.08]'

  return (
    <nav className="flex h-14 items-center gap-5 border-b border-border-subtle px-6 select-none">
      <div className="flex items-center justify-between w-full h-full pointer-events-auto">
        <div className="flex items-baseline gap-2">
          <div className="text-[13px] font-bold text-foreground/95 tracking-tight cursor-default">
            {t('notes.title')}
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <label className="sr-only" htmlFor="notes-search">
            {t('notes.searchLabel')}
          </label>
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground/35" />
            <input
              id="notes-search"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder={t('notes.searchPlaceholder')}
              className="w-52 rounded-full border border-white/10 bg-black/[0.035] pl-8 pr-3.5 py-2 text-[12px] text-foreground/88 outline-none transition-colors placeholder:text-foreground/30 focus:border-[var(--accent-color)]/35 dark:bg-white/[0.04]"
            />
          </div>

          <button
            type="button"
            onClick={onToggleViewMode}
            aria-label={viewMode === 'gallery' ? t('notes.switchToList') : t('notes.switchToGallery')}
            className={iconButtonClass}
          >
            {viewMode === 'gallery' ? (
              <ListViewIcon className="w-4 h-4" />
            ) : (
              <GridViewIcon className="w-4 h-4" />
            )}
          </button>

          <button
            type="button"
            onClick={onCreateNote}
            disabled={!canCreate}
            aria-label={t('notes.createNote')}
            className={`${iconButtonClass} text-foreground/75 disabled:opacity-40 disabled:cursor-default`}
          >
            <ComposeIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  )
}
