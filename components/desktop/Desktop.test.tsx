import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { Desktop } from './Desktop'

// Keep all heavy deps out of jsdom
vi.mock('framer-motion', () => ({
  motion: {
    div: React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
      ({ children, ...props }, ref) => <div ref={ref} {...props}>{children}</div>,
    ),
  },
  useMotionValue: () => ({ get: () => 0, set: vi.fn() }),
  useSpring: () => ({ get: () => 1, set: vi.fn() }),
  useTransform: () => ({ get: () => 1 }),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useDragControls: () => ({ start: vi.fn() }),
}))

// Wallpaper is an R3F scene — always SSR-unsafe, mock it
vi.mock('@/components/wallpaper/WallpaperScene', () => ({
  default: () => <div data-testid="wallpaper" />,
}))

// next/dynamic with ssr:false doesn't render in jsdom — unwrap it
// Desktop only wraps WallpaperScene dynamically, so return its mock directly
vi.mock('next/dynamic', () => ({
  default: () => () => <div data-testid="wallpaper" />,
}))

describe('Desktop', () => {
  it('renders the menu bar', () => {
    render(<Desktop />)
    // MenuBar always present — has the Apple logo
    expect(screen.getByRole('img', { name: /apple/i })).toBeInTheDocument()
  })

  it('renders the dock', () => {
    render(<Desktop />)
    // Dock has at least one app button
    expect(screen.getAllByRole('button').length).toBeGreaterThan(0)
  })

  it('renders the wallpaper scene', () => {
    render(<Desktop />)
    expect(screen.getByTestId('wallpaper')).toBeInTheDocument()
  })

  it('opens a window when a dock icon is clicked', () => {
    render(<Desktop />)
    fireEvent.click(screen.getByRole('button', { name: /terminal/i }))
    expect(screen.getByText('Terminal.app')).toBeInTheDocument()
  })

  it('closes a window when its close button is clicked', () => {
    render(<Desktop />)
    fireEvent.click(screen.getByRole('button', { name: /terminal/i }))
    expect(screen.getByText('Terminal.app')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /close/i }))
    expect(screen.queryByText('Terminal.app')).not.toBeInTheDocument()
  })
})
