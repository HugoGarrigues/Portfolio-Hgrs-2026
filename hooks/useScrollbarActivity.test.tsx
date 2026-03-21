import { act, fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { RefCallback } from 'react'
import { useScrollbarActivity } from './useScrollbarActivity'

function TestScrollbar() {
  const scrollbarRef = useScrollbarActivity<HTMLDivElement>()

  return (
    <div
      ref={scrollbarRef as RefCallback<HTMLDivElement>}
      data-testid="scroll-area"
      className="app-scrollbar overflow-y-scroll"
    />
  )
}

describe('useScrollbarActivity', () => {
  it('shows the app scrollbar only while scrolling and hides it again after a delay', () => {
    vi.useFakeTimers()
    render(<TestScrollbar />)

    const scrollArea = screen.getByTestId('scroll-area')
    expect(scrollArea.className).not.toContain('app-scrollbar-active')

    fireEvent.scroll(scrollArea)
    expect(scrollArea.className).toContain('app-scrollbar-active')

    act(() => {
      vi.advanceTimersByTime(699)
    })
    expect(scrollArea.className).toContain('app-scrollbar-active')

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(scrollArea.className).not.toContain('app-scrollbar-active')
  })
})
