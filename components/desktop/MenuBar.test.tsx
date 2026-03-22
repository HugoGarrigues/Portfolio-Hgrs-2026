import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act, fireEvent } from '@testing-library/react'
import { MenuBar } from './MenuBar'
import { LocaleProvider } from '@/contexts/LocaleContext'
import { ThemeProvider } from '@/contexts/ThemeContext'

vi.mock('framer-motion', async () => {
  const { mockFramerMotion } = await import('./test-utils/mockFramerMotion')
  return mockFramerMotion()
})

function renderMenuBar(props: React.ComponentProps<typeof MenuBar> = {}) {
  return render(
    <ThemeProvider>
      <LocaleProvider>
        <MenuBar {...props} />
      </LocaleProvider>
    </ThemeProvider>,
  )
}

describe('MenuBar', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-07T14:35:00'))
    window.localStorage.clear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the Hgrs button (no Apple logo)', () => {
    renderMenuBar()
    expect(screen.queryByRole('img', { name: /apple/i })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /hgrs/i })).toBeInTheDocument()
  })

  it('renders the Hgrs pseudo button', () => {
    renderMenuBar()
    expect(screen.getByRole('button', { name: /hgrs/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /hgrs/i }).textContent).toBe('Hgrs')
  })

  it('calls onOpenAbout when the Hgrs button is clicked', () => {
    const onOpenAbout = vi.fn()
    renderMenuBar({ onOpenAbout })
    fireEvent.click(screen.getByRole('button', { name: /hgrs/i }))
    expect(onOpenAbout).toHaveBeenCalledTimes(1)
  })

  it('displays the date and time in French format', () => {
    renderMenuBar()
    expect(screen.getByRole('timer')).toBeInTheDocument()
    // e.g. "Sam. 7 mars 14:35"
    expect(screen.getByRole('timer').textContent).toMatch(/\w+\.\s+\d{1,2}\s+\w+\s+\d{2}:\d{2}/)
  })

  it('renders the simple menu bar shell by default', () => {
    const { container } = renderMenuBar()
    const menuBar = container.firstChild as HTMLElement

    expect(menuBar.className).not.toContain('backdrop-blur-xl')
    expect(menuBar.className).not.toContain('bg-white/12')
    expect(menuBar.className).not.toContain('dark:bg-black/22')
  })

  it('renders a full-width glassmorphism shell when enabled in theme settings', () => {
    window.localStorage.setItem('hgrs-theme', JSON.stringify({ glassMenuBar: true }))

    const { container } = renderMenuBar()
    const menuBar = container.firstChild as HTMLElement

    expect(menuBar.className).toContain('backdrop-blur-lg')
    expect(menuBar.className).toContain('border-b')
    expect(menuBar.className).toContain('border-black/8')
    expect(menuBar.className).toContain('bg-white/8')
    expect(menuBar.className).toContain('dark:border-white/8')
    expect(menuBar.className).toContain('dark:bg-black/18')
  })

  it('updates the clock every second', () => {
    renderMenuBar()
    const before = screen.getByRole('timer').textContent

    act(() => {
      vi.setSystemTime(new Date('2026-03-07T14:36:00'))
      vi.advanceTimersByTime(1000)
    })

    // Clock text should have updated (minute changed)
    expect(screen.getByRole('timer').textContent).not.toBe(before)
  })
})
