import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { LocaleProvider } from '@/contexts/LocaleContext'
import { NotesApp } from './NotesApp'

vi.mock('@/components/desktop/Window', () => ({
  useWindow: () => ({
    dragControls: { start: vi.fn() },
    maximized: false,
  }),
}))

describe('NotesApp', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    window.localStorage.clear()
    window.localStorage.setItem('hgrs-locale', 'en')
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        if (typeof input === 'string' && input === '/api/notes' && (!init || init.method === 'GET')) {
          return new Response(
            JSON.stringify({
              notes: [
                {
                  id: 'note-2',
                  title: 'Newest note',
                  content: 'A fresh entry for the guestbook',
                  author_name: 'Ada',
                  created_at: '2026-03-17T09:00:00.000Z',
                },
                {
                  id: 'note-1',
                  title: 'Older note',
                  content: 'Something thoughtful',
                  author_name: 'Linus',
                  created_at: '2026-03-16T09:00:00.000Z',
                },
              ],
              cooldown: { nextAllowedAt: null },
            }),
          )
        }

        if (typeof input === 'string' && input === '/api/notes' && init?.method === 'POST') {
          return new Response(
            JSON.stringify({
              note: {
                id: 'note-3',
                title: 'Posted note',
                content: 'Created from the modal',
                author_name: 'Grace',
                created_at: '2026-03-17T10:00:00.000Z',
              },
              cooldown: { nextAllowedAt: '2026-03-18T10:00:00.000Z' },
            }),
          )
        }

        throw new Error(`Unhandled request: ${String(input)}`)
      }),
    )
  })

  function renderNotesApp() {
    return render(
      <LocaleProvider>
        <NotesApp />
      </LocaleProvider>,
    )
  }

  it('renders fetched notes and filters them locally', async () => {
    const user = userEvent.setup()
    renderNotesApp()

    expect(await screen.findByText('Newest note')).toBeInTheDocument()
    expect(screen.getByText('Older note')).toBeInTheDocument()

    await user.type(screen.getByPlaceholderText('Search'), 'fresh')

    expect(screen.getByText('Newest note')).toBeInTheDocument()
    expect(screen.queryByText('Older note')).not.toBeInTheDocument()
  })

  it('submits a new note and shows cooldown messaging after success', async () => {
    const user = userEvent.setup()
    renderNotesApp()

    await screen.findByText('Newest note')

    await user.click(screen.getByRole('button', { name: 'New Note' }))
    await user.type(screen.getByLabelText('Name'), 'Grace')
    await user.type(screen.getByLabelText('Title'), 'Posted note')
    await user.type(screen.getByLabelText('Message'), 'Created from the modal')
    await user.click(screen.getByRole('button', { name: 'Publish' }))

    await waitFor(() => {
      expect(screen.getByText('Posted note')).toBeInTheDocument()
    })

    expect(screen.getByText(/You already posted a note/i)).toBeInTheDocument()
  })

  it('shows an empty state when no notes exist', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(JSON.stringify({ notes: [], cooldown: { nextAllowedAt: null } }))),
    )

    renderNotesApp()

    expect(await screen.findByText('No notes yet')).toBeInTheDocument()
    expect(screen.getByText('Be the first to leave a note.')).toBeInTheDocument()
  })
})
