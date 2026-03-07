import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import React from 'react'
import {
  windowManagerReducer,
  WindowManagerProvider,
  useWindowManager,
  type WindowState,
  type WindowManagerState,
} from './WindowManagerContext'

// ─── Reducer unit tests ────────────────────────────────────────────────────────

const emptyState: WindowManagerState = { windows: [] }

describe('windowManagerReducer — OPEN', () => {
  it('adds a window with correct app and default values', () => {
    const state = windowManagerReducer(emptyState, {
      type: 'OPEN',
      app: 'terminal',
      position: { x: 100, y: 80 },
    })

    expect(state.windows).toHaveLength(1)
    const win = state.windows[0]
    expect(win.app).toBe('terminal')
    expect(win.position).toEqual({ x: 100, y: 80 })
    expect(win.minimized).toBe(false)
    expect(win.maximized).toBe(false)
    expect(typeof win.id).toBe('string')
    expect(win.id.length).toBeGreaterThan(0)
  })

  it('assigns the highest zIndex when opening alongside existing windows', () => {
    const state1 = windowManagerReducer(emptyState, { type: 'OPEN', app: 'about' })
    const state2 = windowManagerReducer(state1, { type: 'OPEN', app: 'terminal' })

    const zIndexes = state2.windows.map((w) => w.zIndex)
    const newestZIndex = state2.windows.find((w) => w.app === 'terminal')!.zIndex
    expect(newestZIndex).toBe(Math.max(...zIndexes))
  })

  it('does not open a second instance of the same app — focuses existing instead', () => {
    const state1 = windowManagerReducer(emptyState, { type: 'OPEN', app: 'about' })
    const existingId = state1.windows[0].id

    // Open a second window first to give it a higher zIndex
    const state2 = windowManagerReducer(state1, { type: 'OPEN', app: 'terminal' })
    const state3 = windowManagerReducer(state2, { type: 'OPEN', app: 'about' })

    expect(state3.windows).toHaveLength(2)
    const aboutWin = state3.windows.find((w) => w.app === 'about')!
    expect(aboutWin.id).toBe(existingId)
    // Should now have the highest zIndex
    const maxZ = Math.max(...state3.windows.map((w) => w.zIndex))
    expect(aboutWin.zIndex).toBe(maxZ)
  })

  it('un-minimizes a minimized window when opened again', () => {
    const state1 = windowManagerReducer(emptyState, { type: 'OPEN', app: 'about' })
    const state2 = windowManagerReducer(state1, { type: 'MINIMIZE', id: state1.windows[0].id })
    const state3 = windowManagerReducer(state2, { type: 'OPEN', app: 'about' })

    expect(state3.windows[0].minimized).toBe(false)
  })
})

describe('windowManagerReducer — CLOSE', () => {
  it('removes the window with the given id', () => {
    const state1 = windowManagerReducer(emptyState, { type: 'OPEN', app: 'terminal' })
    const id = state1.windows[0].id
    const state2 = windowManagerReducer(state1, { type: 'CLOSE', id })

    expect(state2.windows).toHaveLength(0)
  })

  it('leaves other windows untouched', () => {
    const s1 = windowManagerReducer(emptyState, { type: 'OPEN', app: 'terminal' })
    const s2 = windowManagerReducer(s1, { type: 'OPEN', app: 'about' })
    const idToClose = s1.windows[0].id
    const s3 = windowManagerReducer(s2, { type: 'CLOSE', id: idToClose })

    expect(s3.windows).toHaveLength(1)
    expect(s3.windows[0].app).toBe('about')
  })

  it('is a no-op for an unknown id', () => {
    const state1 = windowManagerReducer(emptyState, { type: 'OPEN', app: 'terminal' })
    const state2 = windowManagerReducer(state1, { type: 'CLOSE', id: 'nonexistent' })

    expect(state2.windows).toHaveLength(1)
  })
})

describe('windowManagerReducer — FOCUS', () => {
  it('gives the focused window the highest zIndex', () => {
    const s1 = windowManagerReducer(emptyState, { type: 'OPEN', app: 'terminal' })
    const s2 = windowManagerReducer(s1, { type: 'OPEN', app: 'about' })
    const terminalId = s1.windows[0].id

    const s3 = windowManagerReducer(s2, { type: 'FOCUS', id: terminalId })

    const maxZ = Math.max(...s3.windows.map((w) => w.zIndex))
    const terminalZ = s3.windows.find((w) => w.id === terminalId)!.zIndex
    expect(terminalZ).toBe(maxZ)
  })

  it('does not change the number of windows', () => {
    const s1 = windowManagerReducer(emptyState, { type: 'OPEN', app: 'terminal' })
    const s2 = windowManagerReducer(s1, { type: 'OPEN', app: 'about' })
    const s3 = windowManagerReducer(s2, { type: 'FOCUS', id: s1.windows[0].id })

    expect(s3.windows).toHaveLength(2)
  })
})

describe('windowManagerReducer — MINIMIZE', () => {
  it('sets minimized to true', () => {
    const s1 = windowManagerReducer(emptyState, { type: 'OPEN', app: 'terminal' })
    const id = s1.windows[0].id
    const s2 = windowManagerReducer(s1, { type: 'MINIMIZE', id })

    expect(s2.windows.find((w) => w.id === id)!.minimized).toBe(true)
  })

  it('does not remove the window', () => {
    const s1 = windowManagerReducer(emptyState, { type: 'OPEN', app: 'terminal' })
    const s2 = windowManagerReducer(s1, { type: 'MINIMIZE', id: s1.windows[0].id })

    expect(s2.windows).toHaveLength(1)
  })
})

describe('windowManagerReducer — MAXIMIZE', () => {
  it('toggles maximized on', () => {
    const s1 = windowManagerReducer(emptyState, { type: 'OPEN', app: 'terminal' })
    const id = s1.windows[0].id
    const s2 = windowManagerReducer(s1, { type: 'MAXIMIZE', id })

    expect(s2.windows.find((w) => w.id === id)!.maximized).toBe(true)
  })

  it('toggles maximized off when already maximized', () => {
    const s1 = windowManagerReducer(emptyState, { type: 'OPEN', app: 'terminal' })
    const id = s1.windows[0].id
    const s2 = windowManagerReducer(s1, { type: 'MAXIMIZE', id })
    const s3 = windowManagerReducer(s2, { type: 'MAXIMIZE', id })

    expect(s3.windows.find((w) => w.id === id)!.maximized).toBe(false)
  })
})

describe('windowManagerReducer — MOVE', () => {
  it('updates the position of the given window', () => {
    const s1 = windowManagerReducer(emptyState, { type: 'OPEN', app: 'terminal' })
    const id = s1.windows[0].id
    const s2 = windowManagerReducer(s1, { type: 'MOVE', id, position: { x: 300, y: 200 } })

    expect(s2.windows.find((w) => w.id === id)!.position).toEqual({ x: 300, y: 200 })
  })

  it('does not mutate other window positions', () => {
    const s1 = windowManagerReducer(emptyState, { type: 'OPEN', app: 'terminal' })
    const s2 = windowManagerReducer(s1, { type: 'OPEN', app: 'about' })
    const terminalId = s1.windows[0].id
    const aboutOriginalPosition = { ...s2.windows.find((w) => w.app === 'about')!.position }

    const s3 = windowManagerReducer(s2, {
      type: 'MOVE',
      id: terminalId,
      position: { x: 999, y: 999 },
    })

    expect(s3.windows.find((w) => w.app === 'about')!.position).toEqual(aboutOriginalPosition)
  })
})

// ─── Context / hook integration tests ─────────────────────────────────────────

describe('useWindowManager hook', () => {
  it('throws when used outside WindowManagerProvider', () => {
    // Suppress React's error boundary console output for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => renderHook(() => useWindowManager())).toThrow()
    consoleSpy.mockRestore()
  })

  it('exposes windows, openWindow, closeWindow, focusWindow, minimizeWindow, maximizeWindow, moveWindow', () => {
    const { result } = renderHook(() => useWindowManager(), {
      wrapper: ({ children }) => <WindowManagerProvider>{children}</WindowManagerProvider>,
    })

    expect(Array.isArray(result.current.windows)).toBe(true)
    expect(typeof result.current.openWindow).toBe('function')
    expect(typeof result.current.closeWindow).toBe('function')
    expect(typeof result.current.focusWindow).toBe('function')
    expect(typeof result.current.minimizeWindow).toBe('function')
    expect(typeof result.current.maximizeWindow).toBe('function')
    expect(typeof result.current.moveWindow).toBe('function')
  })

  it('opens a window via openWindow', () => {
    const { result } = renderHook(() => useWindowManager(), {
      wrapper: ({ children }) => <WindowManagerProvider>{children}</WindowManagerProvider>,
    })

    act(() => result.current.openWindow('terminal'))

    expect(result.current.windows).toHaveLength(1)
    expect(result.current.windows[0].app).toBe('terminal')
  })

  it('closes a window via closeWindow', () => {
    const { result } = renderHook(() => useWindowManager(), {
      wrapper: ({ children }) => <WindowManagerProvider>{children}</WindowManagerProvider>,
    })

    act(() => result.current.openWindow('terminal'))
    const id = result.current.windows[0].id
    act(() => result.current.closeWindow(id))

    expect(result.current.windows).toHaveLength(0)
  })
})
