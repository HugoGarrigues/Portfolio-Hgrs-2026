import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { LocaleProvider } from '@/contexts/LocaleContext'
import { HealthApp } from './HealthApp'

vi.mock('@/components/desktop/Window', () => ({
  useWindow: () => ({
    dragControls: { start: vi.fn() },
    maximized: false,
  }),
}))

function renderHealthApp() {
  window.localStorage.clear()
  window.localStorage.setItem('hgrs-locale', 'en')

  return render(
    <LocaleProvider>
      <HealthApp />
    </LocaleProvider>,
  )
}

describe('HealthApp', () => {
  it('renders the summary dashboard with the approved profile header and sidebar state', () => {
    renderHealthApp()

    expect(screen.getByRole('heading', { name: 'Danny' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Summary' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByText('Pinned')).toBeInTheDocument()
    expect(screen.getByText('Profile')).toBeInTheDocument()
  })

  it('renders the six approved summary cards from mock data', () => {
    renderHealthApp()

    expect(screen.getByText('Weight trend')).toBeInTheDocument()
    expect(screen.getByText('Calories & macros')).toBeInTheDocument()
    expect(screen.getByText('Workout summary')).toBeInTheDocument()
    expect(screen.getByText('Sleep')).toBeInTheDocument()
    expect(screen.getByText('Activity')).toBeInTheDocument()
    expect(screen.getByText('Progress')).toBeInTheDocument()
  })

  it('uses a weight-focused progress card as the primary progress signal', () => {
    renderHealthApp()

    expect(screen.getByText('Lean bulk on track')).toBeInTheDocument()
    expect(screen.getByText('+0.4 kg this week')).toBeInTheDocument()
  })
})
