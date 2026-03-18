import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import React from 'react'
import { LocaleProvider } from '@/contexts/LocaleContext'
import { NotificationCenterProvider } from '@/contexts/NotificationCenterContext'
import { NotificationCenter } from '@/components/system/notifications/NotificationCenter'
import { MailApp } from './MailApp'

vi.mock('@/components/desktop/Window', () => ({
  useWindow: () => ({
    dragControls: { start: vi.fn() },
    maximized: false,
  }),
}))

describe('MailApp', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    window.localStorage.setItem('hgrs-locale', 'en')
  })

  function renderMailApp() {
    return render(
      <LocaleProvider>
        <NotificationCenterProvider>
          <MailApp />
          <NotificationCenter />
        </NotificationCenterProvider>
      </LocaleProvider>,
    )
  }

  it('publishes a global error notification when message sending fails', async () => {
    const user = userEvent.setup()
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        new Response(JSON.stringify({ error: 'Mail server is unavailable.' }), { status: 500 }),
      ),
    )

    renderMailApp()

    await user.type(screen.getByPlaceholderText('Your name'), 'Hugo')
    await user.type(screen.getByPlaceholderText('your@email.com'), 'hugo@example.com')
    await user.type(screen.getByPlaceholderText('Message subject'), 'Hello')
    await user.type(screen.getByPlaceholderText('Your message…'), 'Need help')
    await user.click(screen.getByRole('button', { name: /Send/i }))

    await waitFor(() => {
      expect(screen.getByText('Server error')).toBeInTheDocument()
    })

    expect(screen.getByText('Mail server is unavailable.')).toBeInTheDocument()
    expect(screen.getByText('Mail')).toBeInTheDocument()
  })
})
