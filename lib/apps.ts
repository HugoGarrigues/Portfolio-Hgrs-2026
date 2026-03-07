import type { AppId } from '@/contexts/WindowManagerContext'

export type AppConfig = {
  id: AppId
  label: string
  icon: string
  defaultSize?: { width: number; height: number }
}

export const APPS: AppConfig[] = [
  { id: 'projects', label: 'Projects', icon: '📁', defaultSize: { width: 860, height: 560 } },
  { id: 'terminal', label: 'Terminal', icon: '💻', defaultSize: { width: 680, height: 420 } },
  { id: 'work',     label: 'Work',     icon: '🖼️', defaultSize: { width: 780, height: 520 } },
  { id: 'about',    label: 'About',    icon: '🙋', defaultSize: { width: 600, height: 440 } },
  { id: 'contact',  label: 'Contact',  icon: '✉️', defaultSize: { width: 620, height: 480 } },
  { id: 'links',    label: 'Links',    icon: '🔖', defaultSize: { width: 560, height: 440 } },
  { id: 'resume',   label: 'Résumé',   icon: '📄', defaultSize: { width: 800, height: 620 } },
]
