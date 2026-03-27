import type { AppId } from '@/contexts/WindowManagerContext'

export type AppConfig = {
  id: AppId
  label: string
  labelKey?: string
  iconFile: string  // filename in /icons/ (without extension)
  defaultSize?: { width: number; height: number }
}

export const APPS: AppConfig[] = [
  { id: 'finder', label: 'Finder', labelKey: 'app.finder', iconFile: 'finder', defaultSize: { width: 860, height: 560 } },
  { id: 'contact', label: 'Mail', labelKey: 'app.contact', iconFile: 'mail', defaultSize: { width: 600, height: 440 } },
  { id: 'preview', label: 'Preview', labelKey: 'app.preview', iconFile: 'preview', defaultSize: { width: 680, height: 860 } },
  { id: 'notes', label: 'Notes', labelKey: 'app.notes', iconFile: 'notes', defaultSize: { width: 940, height: 620 } },
  { id: 'health', label: 'Health', labelKey: 'app.health', iconFile: 'health', defaultSize: { width: 760, height: 540 } },
  { id: 'spotify', label: 'Spotify', labelKey: 'app.spotify', iconFile: 'spotify', defaultSize: { width: 560, height: 480 } },
  { id: 'photos', label: 'Photos', labelKey: 'app.photos', iconFile: 'photos', defaultSize: { width: 860, height: 600 } },
  { id: 'settings', label: 'Settings', labelKey: 'app.settings', iconFile: 'settings', defaultSize: { width: 640, height: 480 } },
]
