import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import React from 'react'
import { LocaleProvider } from '@/contexts/LocaleContext'
import { AboutApp } from './AboutApp'

vi.mock('@/components/desktop/Window', () => ({
  useWindow: () => ({
    dragControls: { start: vi.fn() },
    maximized: false,
  }),
}))

describe('AboutApp', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    window.localStorage.clear()
  })

  function renderAboutApp(locale: 'fr' | 'en') {
    window.localStorage.setItem('hgrs-locale', locale)

    return render(
      <LocaleProvider>
        <AboutApp />
      </LocaleProvider>,
    )
  }

  it('renders the shortened french bio copy without the previous long description', () => {
    renderAboutApp('fr')

    expect(screen.getByText('Développeur Fullstack orienté Agentic Engineering')).toBeInTheDocument()
    expect(screen.queryByText(/OpenClaw/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Claude Code/i)).not.toBeInTheDocument()
  })

  it('renders the shortened english bio copy without the previous long description', () => {
    renderAboutApp('en')

    expect(screen.getByText('Fullstack Developer focused on Agentic Engineering')).toBeInTheDocument()
    expect(screen.queryByText(/OpenClaw/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Claude Code/i)).not.toBeInTheDocument()
  })
})
