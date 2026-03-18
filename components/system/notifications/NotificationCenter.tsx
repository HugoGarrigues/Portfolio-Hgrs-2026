'use client'

import { useNotifications } from '@/hooks/useNotifications'
import { NotificationCard } from './NotificationCard'

export function NotificationCenter() {
  const { notifications } = useNotifications()

  return (
    <div
      aria-label="Notifications"
      aria-live="assertive"
      className="pointer-events-none fixed right-4 top-4 z-[200] flex max-w-[calc(100vw-2rem)] flex-col gap-3"
    >
      {notifications.map((notification) => (
        <NotificationCard key={notification.id} notification={notification} />
      ))}
    </div>
  )
}
