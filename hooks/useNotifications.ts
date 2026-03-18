'use client'

import { useNotificationCenterContext } from '@/contexts/NotificationCenterContext'

export function useNotifications() {
  return useNotificationCenterContext()
}
