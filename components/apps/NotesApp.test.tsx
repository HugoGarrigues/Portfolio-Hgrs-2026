import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
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

  it('auto-selects the first note and filters the gallery locally', async () => {
    const user = userEvent.setup()
    renderNotesApp()

    const detailPane = await screen.findByLabelText('Note detail')
    const gallery = screen.getByLabelText('Notes gallery')
    await waitFor(() => {
      expect(within(detailPane).getByRole('heading', { name: 'Newest note' })).toBeInTheDocument()
    })
    expect(within(gallery).getByText('Older note')).toBeInTheDocument()
    expect(within(detailPane).getByText('A fresh entry for the guestbook')).toBeInTheDocument()
    expect(within(detailPane).getByText('Ada')).toBeInTheDocument()

    await user.type(screen.getByPlaceholderText('Search'), 'fresh')

    expect(within(gallery).getByText('Newest note')).toBeInTheDocument()
    expect(within(gallery).queryByText('Older note')).not.toBeInTheDocument()
  })

  it('switches the reading pane when a tile is selected', async () => {
    const user = userEvent.setup()
    renderNotesApp()

    const detailPane = await screen.findByLabelText('Note detail')
    await user.click(screen.getByRole('button', { name: /Open note Older note/i }))

    expect(within(detailPane).getByRole('heading', { name: 'Older note' })).toBeInTheDocument()
    expect(within(detailPane).getByText('Something thoughtful')).toBeInTheDocument()
    expect(within(detailPane).getByText('Linus')).toBeInTheDocument()
  })

  it('submits a new note, selects it, and shows cooldown messaging after success', async () => {
    const user = userEvent.setup()
    renderNotesApp()

    await screen.findByText('Newest note')

    await user.click(screen.getByRole('button', { name: 'New Note' }))
    await user.type(screen.getByLabelText('Name'), 'Grace')
    await user.type(screen.getByLabelText('Title'), 'Posted note')
    await user.type(screen.getByLabelText('Message'), 'Created from the modal')
    await user.click(screen.getByRole('button', { name: 'Publish' }))

    const detailPane = await screen.findByLabelText('Note detail')
    await waitFor(() => {
      expect(within(detailPane).getByRole('heading', { name: 'Posted note' })).toBeInTheDocument()
    })

    expect(within(detailPane).getByText('Created from the modal')).toBeInTheDocument()
    expect(within(detailPane).getByText('Grace')).toBeInTheDocument()
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
