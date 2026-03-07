import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
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

  it('renders the Apple logo', () => {
    render(<MenuBar activeApp="Finder" />)
    expect(screen.getByRole('img', { name: /apple/i })).toBeInTheDocument()
  })

  it('displays the active app name', () => {
    render(<MenuBar activeApp="Terminal" />)
    expect(screen.getByText('Terminal')).toBeInTheDocument()
  })

  it('defaults to Finder when no activeApp is given', () => {
    render(<MenuBar activeApp={undefined} />)
    expect(screen.getByText('Finder')).toBeInTheDocument()
  })

  it('displays the current time', () => {
    render(<MenuBar activeApp="Finder" />)
    // 14:35 formatted as locale time
    expect(screen.getByRole('timer')).toBeInTheDocument()
    expect(screen.getByRole('timer').textContent).toMatch(/\d{1,2}:\d{2}/)
  })

  it('updates the clock every second', () => {
    render(<MenuBar activeApp="Finder" />)
    const before = screen.getByRole('timer').textContent

    act(() => {
      vi.setSystemTime(new Date('2026-03-07T14:36:00'))
      vi.advanceTimersByTime(1000)
    })

    // Clock text should have updated (minute changed)
    expect(screen.getByRole('timer').textContent).not.toBe(before)
  })
})
