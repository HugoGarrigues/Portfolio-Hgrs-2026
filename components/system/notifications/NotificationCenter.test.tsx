import { act, fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { LocaleProvider } from '@/contexts/LocaleContext'
import { NotificationCenter } from './NotificationCenter'
import { NotificationCenterProvider } from '@/contexts/NotificationCenterContext'
import { useNotifications } from '@/hooks/useNotifications'

function TriggerButtons() {
  const { pushError } = useNotifications()

  return (
    <div>
      <button
        type="button"
        onClick={() =>
          pushError({
            title: 'Failed to publish note',
            message: 'Please try again later.',
            source: 'Notes',
          })
        }
      >
        Trigger Notes Error
      </button>
      <button
        type="button"
        onClick={() =>
          pushError({
            title: 'Failed to send message',
            message: 'Mail server is unavailable.',
            source: 'Mail',
          })
        }
      >
        Trigger Mail Error
      </button>
    </div>
  )
}

function renderNotificationCenter() {
  return render(
    <LocaleProvider>
      <NotificationCenterProvider>
        <TriggerButtons />
        <NotificationCenter />
      </NotificationCenterProvider>
    </LocaleProvider>,
  )
}

describe('NotificationCenter', () => {
  it('renders pushed error notifications in a top-right stack and auto-dismisses them after 5 seconds', async () => {
    vi.useFakeTimers()

    renderNotificationCenter()

    fireEvent.click(screen.getByRole('button', { name: 'Trigger Notes Error' }))
    fireEvent.click(screen.getByRole('button', { name: 'Trigger Mail Error' }))

    const liveRegion = screen.getByLabelText('Notifications')
    expect(liveRegion.className).toContain('top-4')
    expect(liveRegion.className).toContain('right-4')
    expect(screen.getByText('Failed to publish note')).toBeInTheDocument()
    expect(screen.getByText('Failed to send message')).toBeInTheDocument()
    expect(screen.getByText('Notes')).toBeInTheDocument()
    expect(screen.getByText('Mail')).toBeInTheDocument()

    await act(async () => {
      vi.advanceTimersByTime(5000)
    })

    expect(screen.queryByText('Failed to publish note')).not.toBeInTheDocument()
    expect(screen.queryByText('Failed to send message')).not.toBeInTheDocument()

    vi.useRealTimers()
  })
})
