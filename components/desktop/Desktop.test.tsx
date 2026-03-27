import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { Desktop } from './Desktop'
import { LocaleProvider } from '@/contexts/LocaleContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { WallpaperProvider } from '@/contexts/WallpaperContext'
import { AvailabilityProvider } from '@/contexts/AvailabilityContext'
import { NotificationCenterProvider } from '@/contexts/NotificationCenterContext'

// Keep all heavy deps out of jsdom
vi.mock('framer-motion', async () => {
  const { mockFramerMotion } = await import('./test-utils/mockFramerMotion')
  return mockFramerMotion({
    useMotionValue: () => ({ get: () => 0, set: vi.fn() }),
    useSpring: () => ({ get: () => 1, set: vi.fn() }),
    useTransform: () => ({ get: () => 1 }),
  })
})

// Wallpaper is an R3F scene — always SSR-unsafe, mock it
vi.mock('@/components/wallpaper/WallpaperScene', () => ({
  default: () => <div data-testid="wallpaper" />,
}))

vi.mock('@/components/apps/PreviewApp', () => ({
  PreviewApp: () => <div>Preview mock</div>,
}))

vi.mock('@/components/apps/NotesApp', () => ({
  NotesApp: () => <input placeholder="Search" aria-label="Search" />,
}))

vi.mock('@/components/apps/HealthApp', () => ({
  HealthApp: () => <div>Health mock</div>,
}))

// BootScreen uses timers — mock it to avoid act() warnings in tests
vi.mock('@/components/desktop/BootScreen', () => ({
  BootScreen: ({ onComplete }: { onComplete: () => void }) => {
    React.useEffect(() => { onComplete() }, [onComplete])
    return null
  },
}))

// next/dynamic with ssr:false doesn't render in jsdom — unwrap it
// Desktop only wraps WallpaperScene dynamically, so return its mock directly
vi.mock('next/dynamic', () => ({
  default: () => () => <div data-testid="wallpaper" />,
}))

function renderDesktop() {
  return render(
    <ThemeProvider>
      <LocaleProvider>
        <WallpaperProvider>
          <AvailabilityProvider>
            <NotificationCenterProvider>
              <Desktop />
            </NotificationCenterProvider>
          </AvailabilityProvider>
        </WallpaperProvider>
      </LocaleProvider>
    </ThemeProvider>,
  )
}

describe('Desktop', () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.localStorage.setItem('hgrs-locale', 'en')
  })

  it('renders the menu bar', () => {
    renderDesktop()
    // MenuBar always present — has the Hgrs button
    expect(screen.getByRole('button', { name: /hgrs/i })).toBeInTheDocument()
  })

  it('renders the dock', () => {
    renderDesktop()
    // Dock has at least one app button
    expect(screen.getAllByRole('button').length).toBeGreaterThan(0)
  })

  it('renders the wallpaper scene', () => {
    renderDesktop()
    expect(screen.getByTestId('wallpaper')).toBeInTheDocument()
  })

  it('opens a window when a dock icon is clicked', () => {
    renderDesktop()
    fireEvent.click(screen.getByRole('button', { name: /notes/i }))
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument()
  })

  it('closes a window when its close button is clicked', () => {
    renderDesktop()
    fireEvent.click(screen.getByRole('button', { name: /notes/i }))
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /close/i }))
    expect(screen.queryByPlaceholderText('Search')).not.toBeInTheDocument()
  })

  it('opens Health as a real app window instead of the default placeholder', () => {
    renderDesktop()
    fireEvent.click(screen.getByRole('button', { name: /health/i }))

    expect(screen.getByText('Health mock')).toBeInTheDocument()
    expect(screen.queryByText(/health — coming soon/i)).not.toBeInTheDocument()
  })

  it('renders coming-soon placeholders with stronger contrast in light mode', () => {
    window.localStorage.setItem('hgrs-theme', JSON.stringify({ appearance: 'light' }))

    renderDesktop()
    fireEvent.click(screen.getByRole('button', { name: /spotify/i }))

    const placeholder = screen.getByText(/spotify — coming soon/i)
    expect(placeholder.className).toContain('text-foreground/65')
    expect(placeholder.className).toContain('dark:text-foreground/40')
  })
})
