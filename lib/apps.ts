import type { AppId } from '@/contexts/WindowManagerContext'

export type AppConfig = {
  id: AppId
  label: string
  iconFile: string  // filename in /icons/ (without extension)
  defaultSize?: { width: number; height: number }
}

export const APPS: AppConfig[] = [
  { id: 'finder', label: 'Finder', iconFile: 'finder', defaultSize: { width: 860, height: 560 } },
  { id: 'contact', label: 'Mail', iconFile: 'mail', defaultSize: { width: 600, height: 440 } },
  { id: 'preview', label: 'Preview', iconFile: 'preview', defaultSize: { width: 680, height: 860 } },
  { id: 'notes', label: 'Notes', iconFile: 'notes', defaultSize: { width: 1180, height: 760 } },
  { id: 'health', label: 'Health', iconFile: 'health', defaultSize: { width: 720, height: 520 } },
  { id: 'spotify', label: 'Spotify', iconFile: 'spotify', defaultSize: { width: 560, height: 480 } },
  { id: 'photos', label: 'Photos', iconFile: 'photos', defaultSize: { width: 860, height: 600 } },
  { id: 'settings', label: 'Settings', iconFile: 'settings', defaultSize: { width: 640, height: 480 } },
]
