import { useTranslation } from '@/lib/i18n/useTranslation'

export function NotesSidebar() {
  const { t } = useTranslation()

  return (
    <aside className="w-[190px] shrink-0 flex flex-col pt-10 pb-3 overflow-y-auto bg-black/5 dark:bg-black/[0.04] dark:bg-white/[0.04] backdrop-blur-3xl rounded-2xl border border-border-subtle shadow-xl">
      <div className="mb-4">
        <h3 className="px-5 mb-2 text-[10px] font-bold text-foreground/30 uppercase tracking-widest">
          {t('notes.sidebarLibrary')}
        </h3>
        <div className="px-2">
          <div className="mx-2 px-3 py-1.5 rounded-lg bg-white/10 text-white text-[13px] font-semibold">
            {t('notes.title')}
          </div>
        </div>
      </div>

      <div className="mt-auto px-5 pb-2">
        <p className="text-[11px] leading-5 text-foreground/40">
          {t('notes.postingRule')}
        </p>
      </div>
    </aside>
  )
}
