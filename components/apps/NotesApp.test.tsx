import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { LocaleProvider } from '@/contexts/LocaleContext'
import { NotificationCenterProvider } from '@/contexts/NotificationCenterContext'
import { NotificationCenter } from '@/components/system/notifications/NotificationCenter'
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

    const notesBySection = {
      visitor: [
        {
          id: 'note-2',
          title: 'Newest note',
          content: 'A fresh entry for the guestbook',
          author_name: 'Ada',
          source: 'visitor',
          status: 'published',
          created_at: '2026-03-17T09:00:00.000Z',
          tags: [{ id: 'tag-guestbook', slug: 'guestbook', label: 'Guestbook' }],
        },
      ],
      owner: [
        {
          id: 'note-1',
          title: 'Older note',
          content: 'Something thoughtful',
          author_name: 'Linus',
          source: 'owner',
          status: 'published',
          created_at: '2026-03-16T09:00:00.000Z',
          tags: [{ id: 'tag-projects', slug: 'projects', label: 'Projects' }],
        },
        {
          id: 'note-4',
          title: 'Skill note',
          content: 'TypeScript and product thinking',
          author_name: 'Linus',
          source: 'owner',
          status: 'published',
          created_at: '2026-03-15T09:00:00.000Z',
          tags: [{ id: 'tag-skills', slug: 'skills', label: 'Skills' }],
        },
      ],
      trashed: [
        {
          id: 'note-trashed',
          title: 'Archived note',
          content: 'No longer visible publicly',
          author_name: 'Linus',
          source: 'owner',
          status: 'trashed',
          created_at: '2026-03-14T09:00:00.000Z',
          tags: [{ id: 'tag-projects', slug: 'projects', label: 'Projects' }],
        },
      ],
    } as const

    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        if (typeof input === 'string' && input.startsWith('/api/notes') && (!init || init.method === 'GET')) {
          const url = new URL(input, 'http://localhost')
          const section = (url.searchParams.get('section') ?? 'visitor') as keyof typeof notesBySection
          const tag = url.searchParams.get('tag')
          const sectionNotes = notesBySection[section] ?? []
          const filteredNotes = tag
            ? sectionNotes.filter((note) => note.tags.some((noteTag) => noteTag.slug === tag))
            : sectionNotes

          return new Response(
            JSON.stringify({
              notes: filteredNotes,
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

  afterEach(() => {
    vi.useRealTimers()
  })

  function renderNotesApp() {
    return render(
      <LocaleProvider>
        <NotificationCenterProvider>
          <NotesApp />
          <NotificationCenter />
        </NotificationCenterProvider>
      </LocaleProvider>,
    )
  }

  it('keeps the detail pane closed until a note is selected and filters the gallery locally', async () => {
    const user = userEvent.setup()
    const { container } = renderNotesApp()

    const gallery = await screen.findByLabelText('Notes gallery')
    const createButton = screen.getByRole('button', { name: 'Create note' })
    const viewToggle = screen.getByRole('button', { name: 'Switch to list view' })
    const searchInput = screen.getByPlaceholderText('Search')
    const splitPane = container.querySelector('.notes-split-pane')
    const sidebar = container.querySelector('.notes-sidebar')
    expect(splitPane).not.toBeNull()
    expect(sidebar).not.toBeNull()
    expect(splitPane?.className.split(' ')).toContain('flex-row')
    expect(splitPane?.className.split(' ')).not.toContain('flex-col')
    expect(sidebar?.className.split(' ')).not.toContain('hidden')
    expect(screen.queryByLabelText('Note detail')).not.toBeInTheDocument()
    expect(screen.getByText('iCloud')).toBeInTheDocument()
    expect(screen.queryByText(/2 notes/i)).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'My notes' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Visitor notes' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Recently Deleted' })).toBeInTheDocument()
    expect(await screen.findByText('Tags')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Filter by tag Projects' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Filter by tag Skills' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Filter by tag Guestbook' })).not.toBeInTheDocument()
    expect(createButton.className).toContain('border')
    expect(createButton.className).toContain('rounded-full')
    expect(viewToggle.className).toContain('border')
    expect(viewToggle.className).toContain('rounded-full')
    expect(searchInput.className).toContain('rounded-full')
    expect(within(gallery).queryByText('Something thoughtful')).not.toBeInTheDocument()
    const galleryCardSurface = within(gallery).getByTestId('note-card-surface-note-2')
    expect(galleryCardSurface.className).toContain('aspect-[1.6/1]')
    expect(galleryCardSurface.className).toContain('min-h-[112px]')
    expect(galleryCardSurface.className).toContain('overflow-hidden')
    expect(within(gallery).getByText('A fresh entry for the guestbook').className).toContain('break-words')

    await user.type(screen.getByPlaceholderText('Search'), 'fresh')

    expect(within(gallery).getByText('A fresh entry for the guestbook')).toBeInTheDocument()
    expect(within(gallery).queryByText('Something thoughtful')).not.toBeInTheDocument()
  })

  it('switches the reading pane when a tile is selected', async () => {
    const user = userEvent.setup()
    const { container } = renderNotesApp()

    await user.click(screen.getByRole('button', { name: 'My notes' }))
    await user.click(screen.getByRole('button', { name: /Open note Older note/i }))
    const detailPane = await screen.findByLabelText('Note detail')
    const sidebar = container.querySelector('.notes-sidebar')
    const listPane = screen.getByLabelText('Notes gallery')
    const detailScrollArea = detailPane.querySelector('.notes-scrollbar')
    const mainIsland = container.querySelector('.notes-main-island')
    const splitPane = container.querySelector('.notes-split-pane')

    expect(within(detailPane).getByText('Something thoughtful')).toBeInTheDocument()
    expect(within(detailPane).getByText('Linus')).toBeInTheDocument()
    expect(sidebar?.className).toContain('notes-scrollbar')
    expect(sidebar?.className).toContain('overscroll-contain')
    expect(sidebar?.className).toContain('overflow-y-scroll')
    expect(listPane.className).toContain('notes-scrollbar')
    expect(listPane.className).toContain('overscroll-contain')
    expect(listPane.className).toContain('overflow-y-scroll')
    expect(detailScrollArea?.className).toContain('notes-scrollbar')
    expect(detailScrollArea?.className).toContain('overscroll-contain')
    expect(detailScrollArea?.className).toContain('overflow-y-scroll')
    expect(mainIsland?.className).toContain('min-h-0')
    expect(splitPane?.className).toContain('min-h-0')
  })

  it('filters notes by clicking sidebar tags', async () => {
    const user = userEvent.setup()
    renderNotesApp()

    await user.click(screen.getByRole('button', { name: 'My notes' }))
    const gallery = await screen.findByLabelText('Notes gallery')

    expect(within(gallery).getByText('Something thoughtful')).toBeInTheDocument()
    expect(within(gallery).getByText('TypeScript and product thinking')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Filter by tag Projects' }))

    const filteredGallery = await screen.findByLabelText('Notes gallery')
    expect(within(filteredGallery).getByText('Something thoughtful')).toBeInTheDocument()
    expect(within(filteredGallery).queryByText('TypeScript and product thinking')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'All tags' }))

    const resetGallery = await screen.findByLabelText('Notes gallery')
    expect(within(resetGallery).getByText('Something thoughtful')).toBeInTheDocument()
    expect(within(resetGallery).getByText('TypeScript and product thinking')).toBeInTheDocument()
  })

  it('shows owner tags across sections and routes tag clicks back to My notes', async () => {
    const user = userEvent.setup()
    renderNotesApp()

    expect(await screen.findByText('Tags')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'All tags' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Filter by tag Projects' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Filter by tag Skills' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Filter by tag Guestbook' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Recently Deleted' }))

    expect(await screen.findByText('Tags')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Recently Deleted' })).toHaveClass('font-semibold')

    await user.click(screen.getByRole('button', { name: 'Filter by tag Projects' }))

    const filteredGallery = await screen.findByLabelText('Notes gallery')
    expect(screen.getByRole('button', { name: 'My notes' })).toHaveClass('font-semibold')
    expect(within(filteredGallery).getByText('Something thoughtful')).toBeInTheDocument()
    expect(within(filteredGallery).queryByText('TypeScript and product thinking')).not.toBeInTheDocument()
  })

  it('clears the active tag when switching note sections', async () => {
    const user = userEvent.setup()
    renderNotesApp()

    await user.click(screen.getByRole('button', { name: 'My notes' }))
    await screen.findByLabelText('Notes gallery')
    await user.click(screen.getByRole('button', { name: 'Filter by tag Projects' }))

    const filteredGallery = await screen.findByLabelText('Notes gallery')
    expect(within(filteredGallery).getByText('Something thoughtful')).toBeInTheDocument()
    expect(within(filteredGallery).queryByText('TypeScript and product thinking')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Visitor notes' }))

    const visitorGallery = await screen.findByLabelText('Notes gallery')
    expect(within(visitorGallery).getByText('A fresh entry for the guestbook')).toBeInTheDocument()
  })

  it('shows a filtered empty state when the active tag has no results', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        if (typeof input === 'string' && input.startsWith('/api/notes') && (!init || init.method === 'GET')) {
          const url = new URL(input, 'http://localhost')
          const section = url.searchParams.get('section')
          const tag = url.searchParams.get('tag')

          if (section === 'owner' && tag === 'projects') {
            return new Response(JSON.stringify({ notes: [], cooldown: { nextAllowedAt: null } }))
          }

          if (section === 'owner') {
            return new Response(
              JSON.stringify({
                notes: [
                  {
                    id: 'note-1',
                    title: 'Older note',
                    content: 'Something thoughtful',
                    author_name: 'Linus',
                    source: 'owner',
                    status: 'published',
                    created_at: '2026-03-16T09:00:00.000Z',
                    tags: [{ id: 'tag-projects', slug: 'projects', label: 'Projects' }],
                  },
                  {
                    id: 'note-4',
                    title: 'Skill note',
                    content: 'TypeScript and product thinking',
                    author_name: 'Linus',
                    source: 'owner',
                    status: 'published',
                    created_at: '2026-03-15T09:00:00.000Z',
                    tags: [{ id: 'tag-skills', slug: 'skills', label: 'Skills' }],
                  },
                ],
                cooldown: { nextAllowedAt: null },
              }),
            )
          }

          return new Response(JSON.stringify({ notes: [], cooldown: { nextAllowedAt: null } }))
        }

        throw new Error(`Unhandled request: ${String(input)}`)
      }),
    )

    const user = userEvent.setup()
    renderNotesApp()

    await user.click(screen.getByRole('button', { name: 'My notes' }))
    await screen.findByLabelText('Notes gallery')
    await user.click(screen.getByRole('button', { name: 'Filter by tag Projects' }))

    expect(await screen.findByText('No notes for Projects')).toBeInTheDocument()
    expect(screen.getByText('Try another tag or switch note sections.')).toBeInTheDocument()
  })

  it('uses translated owner note content for the active locale while leaving visitor notes unchanged', async () => {
    window.localStorage.setItem('hgrs-locale', 'fr')
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        if (typeof input === 'string' && input.startsWith('/api/notes') && (!init || init.method === 'GET')) {
          const url = new URL(input, 'http://localhost')
          const section = url.searchParams.get('section')
          const locale = url.searchParams.get('locale')

          if (section === 'owner') {
            expect(locale).toBe('fr')
            return new Response(
              JSON.stringify({
                notes: [
                  {
                    id: 'note-owner-fr',
                    title: 'À propos',
                    content: 'Note owner en français',
                    author_name: 'Hugo Garrigues',
                    source: 'owner',
                    status: 'published',
                    created_at: '2026-03-20T09:00:00.000Z',
                    tags: [{ id: 'tag-about', slug: 'about', label: 'About' }],
                  },
                ],
                cooldown: { nextAllowedAt: null },
              }),
            )
          }

          expect(locale).toBe('fr')
          return new Response(
            JSON.stringify({
              notes: [
                {
                  id: 'note-visitor-fr',
                  title: 'Newest note',
                  content: 'A fresh entry for the guestbook',
                  author_name: 'Ada',
                  source: 'visitor',
                  status: 'published',
                  created_at: '2026-03-17T09:00:00.000Z',
                  tags: [{ id: 'tag-guestbook', slug: 'guestbook', label: 'Guestbook' }],
                },
              ],
              cooldown: { nextAllowedAt: null },
            }),
          )
        }

        throw new Error(`Unhandled request: ${String(input)}`)
      }),
    )

    const user = userEvent.setup()
    renderNotesApp()

    const visitorGallery = await screen.findByLabelText('Notes gallery')
    expect(within(visitorGallery).getByText('A fresh entry for the guestbook')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Mes notes' }))
    const ownerGallery = await screen.findByLabelText('Notes gallery')
    await user.click(screen.getByRole('button', { name: /Open note À propos/i }))

    const detailPane = await screen.findByLabelText('Note detail')
    expect(within(ownerGallery).getByText('Note owner en français')).toBeInTheDocument()
    expect(within(detailPane).getByText('Note owner en français')).toBeInTheDocument()
  })

  it('navigates between opened notes with toolbar back and forward buttons', async () => {
    const user = userEvent.setup()
    renderNotesApp()

    await screen.findByLabelText('Notes gallery')

    const backButton = screen.getByRole('button', { name: 'Go back' })
    const forwardButton = screen.getByRole('button', { name: 'Go forward' })
    expect(backButton).toBeDisabled()
    expect(forwardButton).toBeDisabled()

    await user.click(screen.getByRole('button', { name: /Open note Newest note/i }))
    let detailPane = await screen.findByLabelText('Note detail')
    expect(within(detailPane).getByText('A fresh entry for the guestbook')).toBeInTheDocument()
    expect(backButton).toBeDisabled()
    expect(forwardButton).toBeDisabled()

    await user.click(screen.getByRole('button', { name: 'My notes' }))
    await user.click(screen.getByRole('button', { name: /Open note Older note/i }))
    detailPane = await screen.findByLabelText('Note detail')
    expect(within(detailPane).getByText('Something thoughtful')).toBeInTheDocument()
    expect(backButton).not.toBeDisabled()
    expect(forwardButton).toBeDisabled()

    await user.click(backButton)
    detailPane = await screen.findByLabelText('Note detail')
    expect(within(detailPane).getByText('A fresh entry for the guestbook')).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Visitor notes' })).toHaveClass('font-semibold')
    })
    expect(forwardButton).not.toBeDisabled()

    await user.click(forwardButton)
    detailPane = await screen.findByLabelText('Note detail')
    expect(within(detailPane).getByText('Something thoughtful')).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'My notes' })).toHaveClass('font-semibold')
    })
  })

  it('creates a draft, publishes via the sheet, and selects the new note', async () => {
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
    const nameInput = screen.getByLabelText('Name')
    expect(nameInput.parentElement?.className).toContain('max-w-[236px]')
    expect(nameInput.className).toContain('py-2')
    expect(screen.getByRole('button', { name: 'Cancel' }).className).toContain('rounded-2xl')
    expect(screen.getByRole('button', { name: 'Publish' }).className).toContain('rounded-2xl')
    await user.type(nameInput, 'Grace')

    // 5. Confirm publish from the editor footer
    await user.click(screen.getByRole('button', { name: 'Publish' }))

    // 6. Verify the note appears in detail pane
    const detailPane = await screen.findByLabelText('Note detail')
    await waitFor(() => {
      expect(within(detailPane).getByText('Written from the draft pane')).toBeInTheDocument()
    })

    expect(within(detailPane).getByText('Written from the draft pane')).toBeInTheDocument()
    expect(within(detailPane).getByText('Grace')).toBeInTheDocument()
    expect(screen.queryByText(/You already posted a note/i)).not.toBeInTheDocument()
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

  it('shows a clear cooldown message when note creation is rate-limited', async () => {
    vi.useFakeTimers()
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        if (typeof input === 'string' && input.startsWith('/api/notes') && (!init || init.method === 'GET')) {
          return new Response(JSON.stringify({ notes: [], cooldown: { nextAllowedAt: null } }))
        }

        if (typeof input === 'string' && input === '/api/notes' && init?.method === 'POST') {
          return new Response(
            JSON.stringify({
              error: 'Veuillez patienter avant de publier une nouvelle note',
              cooldown: { nextAllowedAt: '2026-03-18T18:00:00.000Z' },
            }),
            { status: 429 },
          )
        }

        throw new Error(`Unhandled request: ${String(input)}`)
      }),
    )

    renderNotesApp()

    await act(async () => {
      await Promise.resolve()
    })

    expect(screen.getByText('No notes yet')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Create note' }))
    fireEvent.change(screen.getByLabelText('New note'), { target: { value: 'Blocked note' } })
    fireEvent.click(screen.getByRole('button', { name: 'Publish' }))
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Grace' } })
    fireEvent.click(screen.getByRole('button', { name: 'Publish' }))

    await act(async () => {
      await Promise.resolve()
    })

    expect(screen.getByText('You already posted a note')).toBeInTheDocument()
    expect(screen.getByText(/You can publish another note after/i)).toBeInTheDocument()
    expect(screen.queryByText('Veuillez patienter avant de publier une nouvelle note')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Note editor')?.textContent).not.toContain('You already posted a note')

    await act(async () => {
      vi.advanceTimersByTime(3000)
    })

    expect(screen.queryByText('Veuillez patienter avant de publier une nouvelle note')).not.toBeInTheDocument()
    expect(screen.queryByText('You already posted a note')).not.toBeInTheDocument()
  })

  it('renders load errors inside the detail pane', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => {
      throw new Error('Supabase unavailable')
    }))

    renderNotesApp()

    const detailPane = await screen.findByLabelText('Note detail')
    await waitFor(() => {
      expect(within(detailPane).getByText('Supabase unavailable')).toBeInTheDocument()
    })
    expect(within(detailPane).getByText('Unable to publish your note right now')).toBeInTheDocument()
  })

  it('preloads cooldown silently and only shows the alert after a blocked publish attempt', async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      if (typeof input === 'string' && input.startsWith('/api/notes') && (!init || init.method === 'GET')) {
        return new Response(
          JSON.stringify({
            notes: [],
            cooldown: { nextAllowedAt: '2026-03-18T18:00:00.000Z' },
          }),
        )
      }

      if (typeof input === 'string' && input === '/api/notes' && init?.method === 'POST') {
        throw new Error('POST should not be called while cooldown is active')
      }

      throw new Error(`Unhandled request: ${String(input)}`)
    })
    vi.stubGlobal('fetch', fetchMock)

    renderNotesApp()

    expect(await screen.findByText('No notes yet')).toBeInTheDocument()
    const createButton = screen.getByRole('button', { name: 'Create note' })
    expect(createButton).not.toBeDisabled()
    fireEvent.click(createButton)
    fireEvent.change(screen.getByLabelText('New note'), { target: { value: 'Blocked note' } })
    fireEvent.click(screen.getByRole('button', { name: 'Publish' }))
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Grace' } })
    fireEvent.click(screen.getByRole('button', { name: 'Publish' }))
    expect(screen.getByText('You already posted a note')).toBeInTheDocument()
    expect(screen.getByText(/You can publish another note after/i)).toBeInTheDocument()
    expect(screen.queryByLabelText('Note editor')?.textContent).not.toContain('You already posted a note')
    expect(fetchMock.mock.calls.some((call) => call[0] === '/api/notes')).toBe(false)
    expect(String(fetchMock.mock.calls[0]?.[0])).toMatch(/^\/api\/notes\?clientId=.*section=visitor/)
  })
})
