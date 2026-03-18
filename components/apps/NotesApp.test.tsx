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
                  source: 'visitor',
                  status: 'published',
                  created_at: '2026-03-17T09:00:00.000Z',
                },
                {
                  id: 'note-1',
                  title: 'Older note',
                  content: 'Something thoughtful',
                  author_name: 'Linus',
                  source: 'owner',
                  status: 'published',
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
                content: 'Written from the draft pane',
                author_name: 'Grace',
                source: 'visitor',
                status: 'published',
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
    const { container } = renderNotesApp()

    const detailPane = await screen.findByLabelText('Note detail')
    const gallery = screen.getByLabelText('Notes gallery')
    const createButton = screen.getByRole('button', { name: 'Create note' })
    const viewToggle = screen.getByRole('button', { name: 'Switch to list view' })
    const searchInput = screen.getByPlaceholderText('Search')
    const splitPane = container.querySelector('.notes-split-pane')
    const sidebar = container.querySelector('.notes-sidebar')
    expect(splitPane).not.toBeNull()
    expect(sidebar).not.toBeNull()
    await waitFor(() => {
      expect(within(detailPane).getByText('A fresh entry for the guestbook')).toBeInTheDocument()
    })
    expect(splitPane?.className.split(' ')).toContain('flex-row')
    expect(splitPane?.className.split(' ')).not.toContain('flex-col')
    expect(sidebar?.className.split(' ')).not.toContain('hidden')
    expect(detailPane.className.split(' ')).not.toContain('hidden')
    expect(screen.getByText('iCloud')).toBeInTheDocument()
    expect(screen.queryByText(/2 notes/i)).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'My notes' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Visitor notes' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Recently Deleted' })).toBeInTheDocument()
    expect(createButton.className).toContain('border')
    expect(createButton.className).toContain('rounded-full')
    expect(viewToggle.className).toContain('border')
    expect(viewToggle.className).toContain('rounded-full')
    expect(searchInput.className).toContain('rounded-full')
    expect(within(gallery).queryByText('Something thoughtful')).not.toBeInTheDocument()
    expect(within(detailPane).getByText('A fresh entry for the guestbook')).toBeInTheDocument()
    expect(within(detailPane).getByText('Ada')).toBeInTheDocument()
    const galleryCardSurface = within(gallery).getByTestId('note-card-surface-note-2')
    expect(galleryCardSurface.className).toContain('aspect-[1.6/1]')
    expect(galleryCardSurface.className).toContain('min-h-[112px]')

    await user.type(screen.getByPlaceholderText('Search'), 'fresh')

    expect(within(gallery).getByText('A fresh entry for the guestbook')).toBeInTheDocument()
    expect(within(gallery).queryByText('Something thoughtful')).not.toBeInTheDocument()
  })

  it('switches the reading pane when a tile is selected', async () => {
    const user = userEvent.setup()
    renderNotesApp()

    await user.click(screen.getByRole('button', { name: 'My notes' }))
    const detailPane = await screen.findByLabelText('Note detail')
    await user.click(screen.getByRole('button', { name: /Open note Older note/i }))

    expect(within(detailPane).getByText('Something thoughtful')).toBeInTheDocument()
    expect(within(detailPane).getByText('Linus')).toBeInTheDocument()
  })

  it('creates a draft, publishes via the sheet, and shows cooldown', async () => {
    const user = userEvent.setup()
    renderNotesApp()

    await screen.findByText('A fresh entry for the guestbook')

    // 1. Click the create note button in toolbar
    await user.click(screen.getByRole('button', { name: 'Create note' }))

    // 2. Type content in the draft pane
    const draftTextarea = screen.getByLabelText('New note')
    expect(screen.getByLabelText('Note editor').className.split(' ')).not.toContain('hidden')
    await user.type(draftTextarea, 'Written from the draft pane')
    expect(screen.queryByLabelText('Title')).not.toBeInTheDocument()

    // 3. Click Publish in draft pane to reveal inline publish fields
    await user.click(screen.getByRole('button', { name: 'Publish' }))

    // 4. Fill name inline in the editor
    await user.type(screen.getByLabelText('Name'), 'Grace')

    // 5. Confirm publish from the editor footer
    await user.click(screen.getByRole('button', { name: 'Publish' }))

    // 6. Verify the note appears in detail pane
    const detailPane = await screen.findByLabelText('Note detail')
    await waitFor(() => {
      expect(within(detailPane).getByText('Written from the draft pane')).toBeInTheDocument()
    })

    expect(within(detailPane).getByText('Written from the draft pane')).toBeInTheDocument()
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

  it('renders load errors inside the detail pane', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => {
      throw new Error('Supabase unavailable')
    }))

    renderNotesApp()

    const detailPane = await screen.findByLabelText('Note detail')
    expect(within(detailPane).getByText('Supabase unavailable')).toBeInTheDocument()
    expect(within(detailPane).getByText('Unable to publish your note right now')).toBeInTheDocument()
  })
})
