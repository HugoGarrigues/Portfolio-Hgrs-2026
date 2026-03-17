import { useTranslation } from '@/lib/i18n/useTranslation'

type NotesToolbarProps = {
  query: string
  onQueryChange: (value: string) => void
  onOpenComposer: () => void
  canCreate: boolean
  noteCount: number
}

export function NotesToolbar({
  query,
  onQueryChange,
  onOpenComposer,
  canCreate,
  noteCount,
}: NotesToolbarProps) {
  const { t } = useTranslation()

  return (
    <nav className="flex h-12 items-center gap-5 border-b border-border-subtle px-6 select-none">
      <div className="flex items-center justify-between w-full h-full pointer-events-auto">
        <div className="flex items-baseline gap-2">
          <div className="text-[13px] font-bold text-foreground/95 tracking-tight cursor-default">
            {t('notes.title')}
          </div>
          <div className="text-[11px] text-foreground/40 cursor-default">
            {t('notes.countLabel').replace('{count}', String(noteCount))}
          </div>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <label className="sr-only" htmlFor="notes-search">
            {t('notes.searchLabel')}
          </label>
          <input
            id="notes-search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder={t('notes.searchPlaceholder')}
            className="w-48 rounded-md border border-border-subtle bg-black/[0.05] dark:bg-white/[0.05] px-3 py-1.5 text-[12px] text-foreground/90 outline-none placeholder:text-foreground/30 focus:border-[var(--accent-color)]/50 transition-colors"
          />

          <button
            type="button"
            onClick={onOpenComposer}
            disabled={!canCreate}
            className="flex items-center gap-1.5 text-[12px] font-semibold px-3.5 py-1.5 rounded-lg transition-colors duration-200 bg-[var(--accent-color)] opacity-90 hover:opacity-100 text-white shadow-[0_0_12px_var(--accent-color)_inset] shadow-[var(--accent-color)]/40 disabled:opacity-40 disabled:cursor-default"
          >
            <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t('notes.newNote')}
          </button>
        </div>
      </div>
    </nav>
  )
}
