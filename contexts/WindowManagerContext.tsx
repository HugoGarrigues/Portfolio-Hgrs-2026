import React, { createContext, useContext, useReducer, type ReactNode } from 'react'

// ─── Types ─────────────────────────────────────────────────────────────────────

export type AppId =
  | 'projects'
  | 'terminal'
  | 'work'
  | 'about'
  | 'contact'
  | 'links'
  | 'resume'

export type WindowState = {
  id: string
  app: AppId
  zIndex: number
  position: { x: number; y: number }
  size: { width: number; height: number }
  minimized: boolean
  maximized: boolean
}

export type WindowManagerState = {
  windows: WindowState[]
}

type Action =
  | { type: 'OPEN'; app: AppId; position?: { x: number; y: number } }
  | { type: 'CLOSE'; id: string }
  | { type: 'FOCUS'; id: string }
  | { type: 'MINIMIZE'; id: string }
  | { type: 'MAXIMIZE'; id: string }
  | { type: 'MOVE'; id: string; position: { x: number; y: number } }

// ─── Defaults ──────────────────────────────────────────────────────────────────

const DEFAULT_SIZE = { width: 760, height: 520 }
const DEFAULT_POSITION = { x: 80, y: 60 }

const DEFAULT_SIZES: Partial<Record<AppId, { width: number; height: number }>> = {
  terminal: { width: 680, height: 420 },
  resume: { width: 800, height: 620 },
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

// ─── Reducer ───────────────────────────────────────────────────────────────────

export function windowManagerReducer(
  state: WindowManagerState,
  action: Action,
): WindowManagerState {
  switch (action.type) {
    case 'OPEN': {
      const existing = state.windows.find((w) => w.app === action.app)

      if (existing) {
        // Bring to front and un-minimize
        return {
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
        position: action.position ?? { ...DEFAULT_POSITION },
        size: defaultSize(action.app),
        minimized: false,
        maximized: false,
      }

      return { windows: [...state.windows, newWindow] }
    }

    case 'CLOSE':
      return { windows: state.windows.filter((w) => w.id !== action.id) }

    case 'FOCUS':
      return {
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, zIndex: maxZIndex(state.windows) + 1 } : w,
        ),
      }

    case 'MINIMIZE':
      return {
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, minimized: true } : w,
        ),
      }

    case 'MAXIMIZE':
      return {
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, maximized: !w.maximized } : w,
        ),
      }

    case 'MOVE':
      return {
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, position: action.position } : w,
        ),
      }

    default:
      return state
  }
}

// ─── Context ───────────────────────────────────────────────────────────────────

type WindowManagerContextValue = {
  windows: WindowState[]
  openWindow: (app: AppId, position?: { x: number; y: number }) => void
  closeWindow: (id: string) => void
  focusWindow: (id: string) => void
  minimizeWindow: (id: string) => void
  maximizeWindow: (id: string) => void
  moveWindow: (id: string, position: { x: number; y: number }) => void
}

const WindowManagerContext = createContext<WindowManagerContextValue | null>(null)

export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(windowManagerReducer, { windows: [] })

  const value: WindowManagerContextValue = {
    windows: state.windows,
    openWindow: (app, position) => dispatch({ type: 'OPEN', app, position }),
    closeWindow: (id) => dispatch({ type: 'CLOSE', id }),
    focusWindow: (id) => dispatch({ type: 'FOCUS', id }),
    minimizeWindow: (id) => dispatch({ type: 'MINIMIZE', id }),
    maximizeWindow: (id) => dispatch({ type: 'MAXIMIZE', id }),
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
