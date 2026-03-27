import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react'
import { readStorage, writeStorage } from '@/lib/browser-storage'

// ─── Types ─────────────────────────────────────────────────────────────────────

export type AppId =
  | 'finder'
  | 'about'
  | 'contact'
  | 'preview'
  | 'settings'
  | 'notes'
  | 'health'
  | 'spotify'
  | 'photos'

export type RecentApp = {
  id: AppId
  openedAt: number // timestamp
}

export type WindowBounds = {
  position: { x: number; y: number }
  size: { width: number; height: number }
}

export type WindowState = {
  id: string
  app: AppId
  zIndex: number
  position: { x: number; y: number }
  size: { width: number; height: number }
  minimized: boolean
  maximized: boolean
  restoreBounds?: WindowBounds
}

export type WindowManagerState = {
  windows: WindowState[]
  recentApps: RecentApp[]
}

const RECENTS_STORAGE_KEY = 'hg_recent_apps'

type Action =
  | { type: 'OPEN'; app: AppId; position?: { x: number; y: number } }
  | { type: 'CLOSE'; id: string }
  | { type: 'FOCUS'; id: string }
  | { type: 'MINIMIZE'; id: string }
  | { type: 'MAXIMIZE'; id: string; viewport: { width: number; height: number } }
  | { type: 'MOVE'; id: string; position: { x: number; y: number } }
  | { type: 'SET_RECENTS'; recents: RecentApp[] }

// ─── Defaults ──────────────────────────────────────────────────────────────────

const DEFAULT_SIZE = { width: 760, height: 520 }

const DEFAULT_SIZES: Partial<Record<AppId, { width: number; height: number }>> = {
  finder: { width: 860, height: 560 },
  about: { width: 360, height: 560 },
  preview: { width: 680, height: 860 },
  settings: { width: 640, height: 480 },
  notes: { width: 940, height: 620 },
  health: { width: 760, height: 540 },
  spotify: { width: 560, height: 480 },
  photos: { width: 860, height: 600 },
}

function defaultSize(app: AppId) {
  return DEFAULT_SIZES[app] ?? DEFAULT_SIZE
}

function maxZIndex(windows: WindowState[]) {
  return windows.length === 0 ? 0 : Math.max(...windows.map((w) => w.zIndex))
}

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function getMaximizedSize(viewport: { width: number; height: number }) {
  return {
    width: Math.round(viewport.width * 0.96),
    height: Math.round(viewport.height * 0.9),
  }
}

function getCenteredPosition(
  size: { width: number; height: number },
  viewport: { width: number; height: number },
) {
  return {
    x: Math.round((viewport.width - size.width) / 2),
    y: Math.round((viewport.height - size.height) / 2),
  }
}

// ─── Reducer ───────────────────────────────────────────────────────────────────

export function windowManagerReducer(
  state: WindowManagerState,
  action: Action,
): WindowManagerState {
  switch (action.type) {
    case 'OPEN': {
      const existing = state.windows.find((w) => w.app === action.app)

      // Update recents: move to top or add new
      const filteredRecents = state.recentApps.filter(a => a.id !== action.app)
      const newRecents = [{ id: action.app, openedAt: Date.now() }, ...filteredRecents].slice(0, 15)

      if (existing) {
        return {
          ...state,
          recentApps: newRecents,
          windows: state.windows.map((w) =>
            w.id === existing.id
              ? { ...w, minimized: false, zIndex: maxZIndex(state.windows) + 1 }
              : w,
          ),
        }
      }

      const newWindow: WindowState = {
        id: generateId(),
        app: action.app,
        zIndex: maxZIndex(state.windows) + 1,
        position: action.position ?? { x: 80, y: 60 },
        size: defaultSize(action.app),
        minimized: false,
        maximized: false,
      }

      return {
        ...state,
        recentApps: newRecents,
        windows: [...state.windows, newWindow]
      }
    }

    case 'CLOSE':
      return { ...state, windows: state.windows.filter((w) => w.id !== action.id) }

    case 'FOCUS':
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, zIndex: maxZIndex(state.windows) + 1 } : w,
        ),
      }

    case 'MINIMIZE':
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, minimized: true } : w,
        ),
      }

    case 'MAXIMIZE':
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id
            ? (() => {
              if (w.maximized && w.restoreBounds) {
                return {
                  ...w,
                  maximized: false,
                  position: w.restoreBounds.position,
                  size: w.restoreBounds.size,
                  restoreBounds: undefined,
                }
              }

              if (w.maximized) {
                return { ...w, maximized: false }
              }

              const maximizedSize = getMaximizedSize(action.viewport)
              return {
                ...w,
                minimized: false,
                maximized: true,
                position: getCenteredPosition(maximizedSize, action.viewport),
                size: maximizedSize,
                restoreBounds: {
                  position: w.position,
                  size: w.size,
                },
              }
            })()
            : w,
        ),
      }

    case 'MOVE':
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, position: action.position } : w,
        ),
      }

    case 'SET_RECENTS':
      return { ...state, recentApps: action.recents }

    default:
      return state
  }
}

// ─── Context ───────────────────────────────────────────────────────────────────

type WindowManagerContextValue = {
  windows: WindowState[]
  recentApps: RecentApp[]
  openWindow: (app: AppId, position?: { x: number; y: number }) => void
  closeWindow: (id: string) => void
  focusWindow: (id: string) => void
  minimizeWindow: (id: string) => void
  maximizeWindow: (id: string) => void
  moveWindow: (id: string, position: { x: number; y: number }) => void
}

const WindowManagerContext = createContext<WindowManagerContextValue | null>(null)

function getInitialWindowManagerState(): WindowManagerState {
  const saved = readStorage(RECENTS_STORAGE_KEY)

  if (!saved) {
    return { windows: [], recentApps: [] }
  }

  try {
    const parsed = JSON.parse(saved) as RecentApp[]
    return { windows: [], recentApps: parsed }
  } catch (error) {
    console.error('Failed to load recents', error)
    return { windows: [], recentApps: [] }
  }
}

export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(windowManagerReducer, undefined, getInitialWindowManagerState)

  useEffect(() => {
    writeStorage(RECENTS_STORAGE_KEY, JSON.stringify(state.recentApps))
  }, [state.recentApps])

  const value: WindowManagerContextValue = {
    windows: state.windows,
    recentApps: state.recentApps,
    openWindow: (app, position) => {
      const size = defaultSize(app)
      const count = state.windows.length
      const offset = count * 30

      // Initial centered position
      const centerX = (window.innerWidth - size.width) / 2
      const centerY = (window.innerHeight - size.height) / 2

      const pos = position ?? {
        x: Math.max(40, centerX + offset),
        y: Math.max(40, centerY + offset),
      }
      dispatch({ type: 'OPEN', app, position: pos })
    },
    closeWindow: (id) => dispatch({ type: 'CLOSE', id }),
    focusWindow: (id) => dispatch({ type: 'FOCUS', id }),
    minimizeWindow: (id) => dispatch({ type: 'MINIMIZE', id }),
    maximizeWindow: (id) =>
      dispatch({
        type: 'MAXIMIZE',
        id,
        viewport: { width: window.innerWidth, height: window.innerHeight },
      }),
    moveWindow: (id, position) => dispatch({ type: 'MOVE', id, position }),
  }

  return (
    <WindowManagerContext.Provider value={value}>
      {children}
    </WindowManagerContext.Provider>
  )
}

export function useWindowManager() {
  const ctx = useContext(WindowManagerContext)
  if (!ctx) throw new Error('useWindowManager must be used within WindowManagerProvider')
  return ctx
}
