import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act, fireEvent } from '@testing-library/react'
import React from 'react'
import { MenuBar } from './MenuBar'

vi.mock('framer-motion', () => ({
  motion: {
    div: React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
      ({ children, ...props }, ref) => <div ref={ref} {...props}>{children}</div>,
    ),
  },
}))

describe('MenuBar', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-07T14:35:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the Hgrs button (no Apple logo)', () => {
    render(<MenuBar />)
    expect(screen.queryByRole('img', { name: /apple/i })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /hgrs/i })).toBeInTheDocument()
  })

  it('renders the Hgrs pseudo button', () => {
    render(<MenuBar />)
    expect(screen.getByRole('button', { name: /hgrs/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /hgrs/i }).textContent).toBe('Hgrs')
  })

  it('calls onOpenAbout when the Hgrs button is clicked', () => {
    const onOpenAbout = vi.fn()
    render(<MenuBar onOpenAbout={onOpenAbout} />)
    fireEvent.click(screen.getByRole('button', { name: /hgrs/i }))
    expect(onOpenAbout).toHaveBeenCalledTimes(1)
  })

  it('displays the date and time in French format', () => {
    render(<MenuBar />)
    expect(screen.getByRole('timer')).toBeInTheDocument()
    // e.g. "Sam. 7 mars 14:35"
    expect(screen.getByRole('timer').textContent).toMatch(/\w+\.\s+\d{1,2}\s+\w+\s+\d{2}:\d{2}/)
  })

  it('updates the clock every second', () => {
    render(<MenuBar />)
    const before = screen.getByRole('timer').textContent

    act(() => {
      vi.setSystemTime(new Date('2026-03-07T14:36:00'))
      vi.advanceTimersByTime(1000)
    })

    // Clock text should have updated (minute changed)
    expect(screen.getByRole('timer').textContent).not.toBe(before)
  })
})
