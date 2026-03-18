import type { AppNotification } from './types'

export function NotificationCard({ notification }: { notification: AppNotification }) {
  return (
    <article className="pointer-events-auto w-[320px] rounded-2xl border border-white/10 bg-black/70 px-4 py-3 text-white shadow-2xl backdrop-blur-xl dark:bg-black/75">
      <p className="text-[13px] font-semibold leading-tight">{notification.title}</p>
      <p className="mt-1 text-[12px] leading-relaxed text-white/75">{notification.message}</p>
      {notification.source ? (
        <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.18em] text-white/45">
          {notification.source}
        </p>
      ) : null}
    </article>
  )
}
