'use client'

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import type { AppNotification, PushErrorInput } from '@/components/system/notifications/types'

type NotificationCenterContextValue = {
  notifications: AppNotification[]
  pushError: (input: PushErrorInput) => void
  dismissNotification: (id: string) => void
}

const NotificationCenterContext = createContext<NotificationCenterContextValue | null>(null)

export function NotificationCenterProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const timersRef = useRef<Map<string, number>>(new Map())

  const dismissNotification = useCallback((id: string) => {
    const timeoutId = timersRef.current.get(id)
    if (timeoutId) {
      window.clearTimeout(timeoutId)
      timersRef.current.delete(id)
    }

    setNotifications((current) => current.filter((notification) => notification.id !== id))
  }, [])

  const pushError = useCallback(
    (input: PushErrorInput) => {
      const id = window.crypto.randomUUID()
      const nextNotification: AppNotification = {
        id,
        kind: 'error',
        title: input.title,
        message: input.message,
        source: input.source,
      }

      setNotifications((current) => [...current, nextNotification])

      const timeoutId = window.setTimeout(() => {
        dismissNotification(id)
      }, 5000)

      timersRef.current.set(id, timeoutId)
    },
    [dismissNotification],
  )

  const value = useMemo(
    () => ({
      notifications,
      pushError,
      dismissNotification,
    }),
    [dismissNotification, notifications, pushError],
  )

  return <NotificationCenterContext.Provider value={value}>{children}</NotificationCenterContext.Provider>
}

export function useNotificationCenterContext() {
  const context = useContext(NotificationCenterContext)

  if (!context) {
    throw new Error('useNotificationCenterContext must be used within NotificationCenterProvider')
  }

  return context
}
