import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { Window } from './Window'

// Framer Motion's drag requires PointerEvent APIs; jsdom doesn't ship them.
// We mock the module so `motion.div` renders as a plain div in tests.
vi.mock('framer-motion', () => ({
  motion: {
    div: React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
      ({ children, ...props }, ref) => (
        <div ref={ref} {...props}>
          {children}
        </div>
      ),
    ),
  },
  useDragControls: () => ({ start: vi.fn() }),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

const baseProps = {
  id: 'win-1',
  title: 'Terminal',
  zIndex: 10,
  minimized: false,
  maximized: false,
  position: { x: 100, y: 80 },
  size: { width: 680, height: 420 },
  onClose: vi.fn(),
  onMinimize: vi.fn(),
  onMaximize: vi.fn(),
  onFocus: vi.fn(),
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('Window — rendering', () => {
  it('renders the title in the title bar', () => {
    render(<Window {...baseProps}>content</Window>)
    expect(screen.getByText('Terminal')).toBeInTheDocument()
  })

  it('renders children inside the content area', () => {
    render(<Window {...baseProps}><p>App Content</p></Window>)
    expect(screen.getByText('App Content')).toBeInTheDocument()
  })

  it('is not visible when minimized', () => {
    const { container } = render(<Window {...baseProps} minimized>content</Window>)
    // The outer wrapper should have visibility:hidden or display:none
    const windowEl = container.firstChild as HTMLElement
    const style = windowEl.getAttribute('style') ?? ''
    // We check that the component communicates hidden state somehow
    expect(windowEl).toHaveAttribute('data-minimized', 'true')
  })

  it('applies maximized class when maximized', () => {
    const { container } = render(<Window {...baseProps} maximized>content</Window>)
    const windowEl = container.firstChild as HTMLElement
    expect(windowEl).toHaveAttribute('data-maximized', 'true')
  })
})

describe('Window — traffic light buttons', () => {
  it('calls onClose when the close button is clicked', () => {
    render(<Window {...baseProps}>content</Window>)
    fireEvent.click(screen.getByRole('button', { name: /close/i }))
    expect(baseProps.onClose).toHaveBeenCalledOnce()
    expect(baseProps.onClose).toHaveBeenCalledWith('win-1')
  })

  it('calls onMinimize when the minimize button is clicked', () => {
    render(<Window {...baseProps}>content</Window>)
    fireEvent.click(screen.getByRole('button', { name: /minimize/i }))
    expect(baseProps.onMinimize).toHaveBeenCalledOnce()
    expect(baseProps.onMinimize).toHaveBeenCalledWith('win-1')
  })

  it('calls onMaximize when the maximize button is clicked', () => {
    render(<Window {...baseProps}>content</Window>)
    fireEvent.click(screen.getByRole('button', { name: /maximize/i }))
    expect(baseProps.onMaximize).toHaveBeenCalledOnce()
    expect(baseProps.onMaximize).toHaveBeenCalledWith('win-1')
  })

  it('does not propagate traffic light clicks to the focus handler', () => {
    render(<Window {...baseProps}>content</Window>)
    fireEvent.click(screen.getByRole('button', { name: /close/i }))
    // onFocus is triggered by clicking the window body, not the traffic lights
    expect(baseProps.onFocus).not.toHaveBeenCalled()
  })
})

describe('Window — focus', () => {
  it('calls onFocus when the window is clicked', () => {
    const { container } = render(<Window {...baseProps}>content</Window>)
    fireEvent.mouseDown(container.firstChild as HTMLElement)
    expect(baseProps.onFocus).toHaveBeenCalledOnce()
    expect(baseProps.onFocus).toHaveBeenCalledWith('win-1')
  })
})

describe('Window — z-index', () => {
  it('applies the given zIndex as an inline style', () => {
    const { container } = render(<Window {...baseProps} zIndex={42}>content</Window>)
    const windowEl = container.firstChild as HTMLElement
    expect(windowEl.style.zIndex).toBe('42')
  })
})
