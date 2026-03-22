import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import React from 'react'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { LocaleProvider } from '@/contexts/LocaleContext'
import { WindowManagerProvider } from '@/contexts/WindowManagerContext'
import { FinderApp } from './FinderApp'

vi.mock('@/components/desktop/Window', () => ({
  useWindow: () => ({
    dragControls: { start: vi.fn() },
    maximized: false,
  }),
}))

describe('FinderApp', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    window.localStorage.clear()
    window.localStorage.setItem('hgrs-locale', 'en')
    window.localStorage.setItem('hgrs-theme', JSON.stringify({ appearance: 'light' }))
  })

  function renderFinderApp() {
    return render(
      <ThemeProvider>
        <LocaleProvider>
          <WindowManagerProvider>
            <FinderApp />
          </WindowManagerProvider>
        </LocaleProvider>
      </ThemeProvider>,
    )
  }

  it('uses a stronger light-mode label treatment for app icons', () => {
    renderFinderApp()

    const healthLabel = screen.getByText('Health')
    expect(healthLabel.className).toContain('text-white')
    expect(healthLabel.className).toContain('group-hover:bg-black/45')
  })

  it('keeps finder empty states readable in light mode', async () => {
    const user = userEvent.setup()
    renderFinderApp()

    await user.click(screen.getByRole('button', { name: 'Desktop' }))

    const emptyState = screen.getByText('No items')
    expect(emptyState.className).toContain('text-foreground/55')
    expect(emptyState.className).toContain('dark:text-foreground/35')
  })
})
