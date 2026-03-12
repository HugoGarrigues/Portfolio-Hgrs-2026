import type { AppId } from '@/contexts/WindowManagerContext'

export type AppConfig = {
  id: AppId
  label: string
  iconFile: string  // filename in /icons/ (without extension)
  defaultSize?: { width: number; height: number }
}

export const APPS: AppConfig[] = [
  { id: 'finder', label: 'Finder', iconFile: 'finder', defaultSize: { width: 860, height: 560 } },
  { id: 'instagram', label: 'Instagram', iconFile: 'instagram', defaultSize: { width: 480, height: 600 } },
  { id: 'photos', label: 'Photos', iconFile: 'photos', defaultSize: { width: 900, height: 620 } },
  { id: 'music', label: 'Music', iconFile: 'music', defaultSize: { width: 700, height: 520 } },
  { id: 'terminal', label: 'Terminal', iconFile: 'terminal', defaultSize: { width: 680, height: 420 } },
  { id: 'contact', label: 'Mail', iconFile: 'mail', defaultSize: { width: 600, height: 440 } },
  { id: 'preview', label: 'Preview', iconFile: 'preview', defaultSize: { width: 680, height: 860 } },
  { id: 'settings', label: 'Settings', iconFile: 'settings', defaultSize: { width: 640, height: 480 } },
]
