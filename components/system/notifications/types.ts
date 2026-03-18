export type NotificationKind = 'error'

export type AppNotification = {
  id: string
  kind: NotificationKind
  title: string
  message: string
  source?: string
}

export type PushErrorInput = {
  title: string
  message: string
  source?: string
}
