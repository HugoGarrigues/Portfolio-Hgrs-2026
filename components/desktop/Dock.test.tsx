import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { Dock } from './Dock'
import type { AppId } from '@/contexts/WindowManagerContext'
import type { AppConfig } from '@/lib/apps'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { LocaleProvider } from '@/contexts/LocaleContext'

const apps: AppConfig[] = [
  { id: 'finder', label: 'Finder', labelKey: 'app.finder', iconFile: 'finder' },
  { id: 'notes', label: 'Notes', labelKey: 'app.notes', iconFile: 'notes' },
  { id: 'health', label: 'Health', labelKey: 'app.health', iconFile: 'health' },
]


const baseProps = {
  apps,
  openWindows: [] as Array<{ id: string; app: AppId; minimized: boolean }>,
  onOpen: vi.fn(),
  onFocus: vi.fn(),
}

function renderDock(props: React.ComponentProps<typeof Dock>) {
  return render(
    <ThemeProvider>
      <LocaleProvider>
        <Dock {...props} />
      </LocaleProvider>
    </ThemeProvider>,
  )
}

describe('Dock — rendering', () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.localStorage.setItem('hgrs-locale', 'en')
  })

  it('renders an icon for each app', () => {
    renderDock(baseProps)
    expect(screen.getByRole('button', { name: /finder/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /notes/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /notes/i })).toBeInTheDocument()
  })

  it('shows a visible dot under apps that have an open window', () => {
    const props = {
      ...baseProps,
      openWindows: [{ id: 'w1', app: 'notes' as AppId, minimized: false }],
    }
    renderDock(props)
    const projectsItem = screen.getByRole('button', { name: /notes/i }).closest('[data-dock-item]')
    const dot = projectsItem?.querySelector('[data-open-dot]')
    expect(dot).toBeInTheDocument()
    expect(dot?.className).toContain('opacity-100')
  })

  it('dot is invisible for apps with no open window', () => {
    renderDock(baseProps)
    const finderItem = screen.getByRole('button', { name: /finder/i }).closest('[data-dock-item]')
    const dot = finderItem?.querySelector('[data-open-dot]')
    expect(dot?.className).toContain('opacity-0')
  })
})

describe('Dock — interactions', () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.localStorage.setItem('hgrs-locale', 'en')
  })

  it('renders tooltip text in white when hovering a dock icon', async () => {
    const user = userEvent.setup()
    renderDock(baseProps)

    const notesItem = screen.getByRole('button', { name: /notes/i }).closest('[data-dock-item]')
    expect(notesItem).not.toBeNull()

    await user.hover(notesItem as HTMLElement)

    const tooltip = await screen.findByText('Notes')
    expect(tooltip.className).toContain('text-white')
  })

  it('translates the hover tooltip label in french', async () => {
    window.localStorage.setItem('hgrs-locale', 'fr')
    const user = userEvent.setup()
    renderDock(baseProps)

    const healthItem = screen.getByRole('button', { name: /santé/i }).closest('[data-dock-item]')
    expect(healthItem).not.toBeNull()

    await user.hover(healthItem as HTMLElement)

    expect(await screen.findByText('Santé')).toBeInTheDocument()
    expect(screen.queryByText('Health')).not.toBeInTheDocument()
  })

  it('calls onOpen with the app id when clicking a dock icon for a closed app', () => {
    const onOpen = vi.fn()
    renderDock({ ...baseProps, onOpen })
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
    renderDock(props)
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
    renderDock(props)
    fireEvent.click(screen.getByRole('button', { name: 'Notes' }))
    expect(onOpen).toHaveBeenCalledWith('notes')
  })
})
