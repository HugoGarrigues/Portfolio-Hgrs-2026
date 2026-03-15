import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { Dock } from './Dock'
import type { AppId } from '@/contexts/WindowManagerContext'
import type { AppConfig } from '@/lib/apps'

const apps: AppConfig[] = [
  { id: 'finder', label: 'Finder', iconFile: 'finder' },
  { id: 'notes', label: 'Notes', iconFile: 'notes' },
  { id: 'health', label: 'Health', iconFile: 'health' },
]


const baseProps = {
  apps,
  openWindows: [] as Array<{ id: string; app: AppId; minimized: boolean }>,
  onOpen: vi.fn(),
  onFocus: vi.fn(),
}

describe('Dock — rendering', () => {
  it('renders an icon for each app', () => {
    render(<Dock {...baseProps} />)
    expect(screen.getByRole('button', { name: /finder/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /notes/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /notes/i })).toBeInTheDocument()
  })

  it('shows a visible dot under apps that have an open window', () => {
    const props = {
      ...baseProps,
      openWindows: [{ id: 'w1', app: 'notes' as AppId, minimized: false }],
    }
    render(<Dock {...props} />)
    const projectsItem = screen.getByRole('button', { name: /notes/i }).closest('[data-dock-item]')
    const dot = projectsItem?.querySelector('[data-open-dot]')
    expect(dot).toBeInTheDocument()
    expect(dot?.className).toContain('opacity-100')
  })

  it('dot is invisible for apps with no open window', () => {
    render(<Dock {...baseProps} />)
    const finderItem = screen.getByRole('button', { name: /finder/i }).closest('[data-dock-item]')
    const dot = finderItem?.querySelector('[data-open-dot]')
    expect(dot?.className).toContain('opacity-0')
  })
})

describe('Dock — interactions', () => {
  it('calls onOpen with the app id when clicking a dock icon for a closed app', () => {
    const onOpen = vi.fn()
    render(<Dock {...baseProps} onOpen={onOpen} />)
    fireEvent.click(screen.getByRole('button', { name: /notes/i }))
    expect(onOpen).toHaveBeenCalledWith('notes')
  })

  it('calls onFocus with the window id when clicking a dock icon for an already-open app', () => {
    const onFocus = vi.fn()
    const props = {
      ...baseProps,
      onFocus,
      openWindows: [{ id: 'w-99', app: 'notes' as AppId, minimized: false }],
    }
    render(<Dock {...props} />)
    fireEvent.click(screen.getByRole('button', { name: /notes/i }))
    expect(onFocus).toHaveBeenCalledWith('w-99')
  })

  it('calls onOpen when clicking icon for a minimized window (to restore it)', () => {
    const onOpen = vi.fn()
    const props = {
      ...baseProps,
      onOpen,
      openWindows: [{ id: 'w-99', app: 'notes' as AppId, minimized: true }],
    }
    render(<Dock {...props} />)
    fireEvent.click(screen.getByRole('button', { name: 'Notes' }))
    expect(onOpen).toHaveBeenCalledWith('notes')
  })
})
