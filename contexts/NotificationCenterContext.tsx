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
  const notificationsRef = useRef<AppNotification[]>([])
  const timersRef = useRef<Map<string, number>>(new Map())

  const dismissNotification = useCallback((id: string) => {
    const timeoutId = timersRef.current.get(id)
    if (timeoutId) {
      window.clearTimeout(timeoutId)
      timersRef.current.delete(id)
    }

    setNotifications((current) => {
      const nextNotifications = current.filter((notification) => notification.id !== id)
      notificationsRef.current = nextNotifications
      return nextNotifications
    })
  }, [])

  const pushError = useCallback(
    (input: PushErrorInput) => {
      const existingNotification = notificationsRef.current.find(
        (notification) =>
          notification.kind === 'error' &&
          notification.title === input.title &&
          notification.message === input.message &&
          notification.source === input.source,
      )

      const notificationId = existingNotification?.id ?? window.crypto.randomUUID()

      if (!existingNotification) {
        const nextNotification: AppNotification = {
          id: notificationId,
          kind: 'error',
          title: input.title,
          message: input.message,
          source: input.source,
        }

        setNotifications((current) => {
          const nextNotifications = [...current, nextNotification]
          notificationsRef.current = nextNotifications
          return nextNotifications
        })
      }

      const existingTimeoutId = timersRef.current.get(notificationId)
      if (existingTimeoutId) {
        window.clearTimeout(existingTimeoutId)
      }

      const timeoutId = window.setTimeout(() => {
        dismissNotification(notificationId)
      }, 3000)

      timersRef.current.set(notificationId, timeoutId)
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
