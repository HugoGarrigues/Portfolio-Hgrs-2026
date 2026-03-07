import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { Dock } from './Dock'
import type { AppId } from '@/contexts/WindowManagerContext'
import type { AppConfig } from '@/lib/apps'

vi.mock('framer-motion', () => ({
  motion: {
    div: React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
      ({ children, ...props }, ref) => <div ref={ref} {...props}>{children}</div>,
    ),
  },
  useMotionValue: () => ({ get: () => 0, set: vi.fn() }),
  useSpring: () => ({ get: () => 1, set: vi.fn() }),
  useTransform: () => ({ get: () => 1 }),
}))

const apps: AppConfig[] = [
  { id: 'terminal', label: 'Terminal', icon: '💻' },
  { id: 'about', label: 'About', icon: '🙋' },
  { id: 'projects', label: 'Projects', icon: '📁' },
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
    expect(screen.getByRole('button', { name: /terminal/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /about/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /projects/i })).toBeInTheDocument()
  })

  it('shows a dot indicator under apps that have an open window', () => {
    const props = {
      ...baseProps,
      openWindows: [{ id: 'w1', app: 'terminal' as AppId, minimized: false }],
    }
    render(<Dock {...props} />)
    const terminalBtn = screen.getByRole('button', { name: /terminal/i })
    // The dot should be rendered inside or adjacent to the button
    expect(terminalBtn.closest('[data-dock-item]')?.querySelector('[data-open-dot]')).toBeInTheDocument()
  })

  it('does not show a dot for apps with no open window', () => {
    render(<Dock {...baseProps} />)
    const aboutItem = screen.getByRole('button', { name: /about/i }).closest('[data-dock-item]')
    expect(aboutItem?.querySelector('[data-open-dot]')).not.toBeInTheDocument()
  })
})

describe('Dock — interactions', () => {
  it('calls onOpen with the app id when clicking a dock icon for a closed app', () => {
    const onOpen = vi.fn()
    render(<Dock {...baseProps} onOpen={onOpen} />)
    fireEvent.click(screen.getByRole('button', { name: /terminal/i }))
    expect(onOpen).toHaveBeenCalledWith('terminal')
  })

  it('calls onFocus with the window id when clicking a dock icon for an already-open app', () => {
    const onFocus = vi.fn()
    const props = {
      ...baseProps,
      onFocus,
      openWindows: [{ id: 'w-99', app: 'terminal' as AppId, minimized: false }],
    }
    render(<Dock {...props} />)
    fireEvent.click(screen.getByRole('button', { name: /terminal/i }))
    expect(onFocus).toHaveBeenCalledWith('w-99')
  })

  it('calls onOpen when clicking icon for a minimized window (to restore it)', () => {
    const onOpen = vi.fn()
    const props = {
      ...baseProps,
      onOpen,
      openWindows: [{ id: 'w-99', app: 'terminal' as AppId, minimized: true }],
    }
    render(<Dock {...props} />)
    fireEvent.click(screen.getByRole('button', { name: /terminal/i }))
    // minimized → re-open (which un-minimizes per WindowManager logic)
    expect(onOpen).toHaveBeenCalledWith('terminal')
  })
})
