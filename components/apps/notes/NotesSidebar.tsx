import { useTranslation } from '@/lib/i18n/useTranslation'

type NotesSidebarProps = {
  noteCount: number
}

export function NotesSidebar({ noteCount }: NotesSidebarProps) {
  const { t } = useTranslation()

  return (
    <aside className="hidden w-[190px] shrink-0 flex-col overflow-y-auto bg-black/5 dark:bg-black/[0.04] dark:bg-white/[0.04] backdrop-blur-3xl rounded-2xl border border-border-subtle shadow-xl pb-3 pt-10 lg:flex h-full">
      <div className="mb-4">
        <h3 className="mb-2 px-5 text-[10px] font-bold text-foreground/30 uppercase tracking-widest select-none">
          {t('notes.sidebarLibrary')}
        </h3>
        <div className="flex flex-col gap-0.5">
          <div className="w-[calc(100%-16px)] flex items-center gap-3 mx-2 px-3 py-1.5 rounded-lg text-[13px] transition-all group bg-black/5 dark:bg-black/10 dark:bg-white/10 text-[var(--accent-color)] font-semibold cursor-default">
            <svg className="w-4 h-4 shrink-0 transition-colors text-[var(--accent-color)]" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 1.5h5.5l3 3V14a.5.5 0 0 1-.5.5H4a.5.5 0 0 1-.5-.5V2a.5.5 0 0 1 .5-.5Zm5.5 0V4.5H12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="truncate flex-1">{t('notes.title')}</span>
            <span className="text-[12px]">{noteCount}</span>
          </div>
          <div className="w-[calc(100%-16px)] flex items-center gap-3 mx-2 px-3 py-1.5 rounded-lg text-[13px] transition-all group text-foreground/60 hover:bg-black/[0.05] dark:hover:bg-white/[0.08] hover:text-foreground cursor-default">
            <svg className="w-4 h-4 shrink-0 transition-colors text-foreground/40 group-hover:text-foreground/70" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.5 4h11 M4 4V13.5a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4 M6 4V2.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1V4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="truncate flex-1">{t('notes.recentlyDeleted')}</span>
            <span className="text-[12px]">0</span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <p className="mb-2 px-5 text-[10px] font-bold text-foreground/30 uppercase tracking-widest select-none">
          {t('notes.sidebarTags')}
        </p>
        <div className="flex flex-col gap-0.5">
          <div className="w-[calc(100%-16px)] flex items-center gap-3 mx-2 px-3 py-1.5 rounded-lg text-[13px] transition-all group text-foreground/60 hover:bg-black/[0.05] dark:hover:bg-white/[0.08] hover:text-foreground cursor-default">
            <span className="text-foreground/40">#</span>
            <span className="truncate flex-1">Portfolio</span>
          </div>
          <div className="w-[calc(100%-16px)] flex items-center gap-3 mx-2 px-3 py-1.5 rounded-lg text-[13px] transition-all group text-foreground/60 hover:bg-black/[0.05] dark:hover:bg-white/[0.08] hover:text-foreground cursor-default">
            <span className="text-foreground/40">#</span>
            <span className="truncate flex-1">Guestbook</span>
          </div>
        </div>
      </div>

      <div className="mt-auto px-5 pt-4">
        <p className="text-[10px] font-medium leading-relaxed text-foreground/30">
          {t('notes.postingRule')}
        </p>
      </div>
    </aside>
  )
}
