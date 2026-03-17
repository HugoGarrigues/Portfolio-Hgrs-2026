import { useTranslation } from '@/lib/i18n/useTranslation'

type NotesToolbarProps = {
  query: string
  onQueryChange: (value: string) => void
  onOpenComposer: () => void
  canCreate: boolean
}

export function NotesToolbar({ query, onQueryChange, onOpenComposer, canCreate }: NotesToolbarProps) {
  const { t } = useTranslation()

  return (
    <nav className="h-12 flex items-center px-6 gap-4 select-none border-b border-border-subtle">
      <div className="text-[13px] font-bold tracking-tight text-foreground/95">
        {t('notes.title')}
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
          className="w-40 rounded-lg border border-border-subtle bg-black/[0.05] dark:bg-white/[0.05] px-3 py-1.5 text-[12px] text-foreground/90 outline-none placeholder:text-foreground/30"
        />

        <button
          type="button"
          onClick={onOpenComposer}
          disabled={!canCreate}
          className="rounded-lg border border-border-subtle bg-white/[0.05] px-3 py-1.5 text-[12px] font-semibold text-foreground/90 transition disabled:opacity-40"
        >
          {t('notes.newNote')}
        </button>
      </div>
    </nav>
  )
}
