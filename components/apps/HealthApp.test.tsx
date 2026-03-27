import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

  it('navigates between health sections with toolbar history controls', async () => {
    const user = userEvent.setup()
    renderHealthApp('en')

    await user.click(screen.getByRole('button', { name: 'PRs' }))
    expect(screen.getByText('Current strength standards and recent records.')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Nutrition' }))
    expect(screen.getByText('Lean bulk intake and bodyweight direction.')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /back/i }))
    expect(screen.getByText('Current strength standards and recent records.')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /forward/i }))
    expect(screen.getByText('Lean bulk intake and bodyweight direction.')).toBeInTheDocument()
  })

  it('translates the health sidebar and hero copy in french', () => {
    renderHealthApp('fr')

    expect(screen.getByRole('button', { name: /aper/i })).toBeInTheDocument()
    expect(screen.getByText('Progression lean bulk')).toBeInTheDocument()
    expect(screen.getByText('Objectif 86.0 kg')).toBeInTheDocument()
    expect(screen.getByText('Moyenne sur 7 jours')).toBeInTheDocument()
    expect(screen.queryByText('Lean bulk progress')).not.toBeInTheDocument()
    expect(screen.queryByText('Target 86.0 kg')).not.toBeInTheDocument()
    expect(screen.queryByText('7-day average')).not.toBeInTheDocument()
  })
})
