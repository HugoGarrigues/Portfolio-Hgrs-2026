import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import React from 'react'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { LocaleProvider } from '@/contexts/LocaleContext'
import { HealthApp } from './HealthApp'

vi.mock('@/components/desktop/Window', () => ({
  useWindow: () => ({
    dragControls: { start: vi.fn() },
    maximized: false,
  }),
}))

describe('HealthApp', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    window.localStorage.clear()
  })

  function renderHealthApp(locale: 'en' | 'fr') {
    window.localStorage.setItem('hgrs-locale', locale)
    window.localStorage.setItem('hgrs-theme', JSON.stringify({ appearance: 'light' }))

    return render(
      <ThemeProvider>
        <LocaleProvider>
          <HealthApp />
        </LocaleProvider>
      </ThemeProvider>,
    )
  }

  it('renders the native health shell with the overview selected by default', () => {
    const { container } = renderHealthApp('en')

    expect(screen.getByRole('button', { name: 'Overview' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Training' })).toBeInTheDocument()
    expect(screen.getByText('Lean bulk progress')).toBeInTheDocument()
    expect(screen.getByText('PR spotlight')).toBeInTheDocument()
    expect(screen.getByText('Insight of the day')).toBeInTheDocument()
    expect(container.innerHTML).toContain('app-scrollbar')
    expect(screen.queryByText('Health mock')).not.toBeInTheDocument()
  })
})
