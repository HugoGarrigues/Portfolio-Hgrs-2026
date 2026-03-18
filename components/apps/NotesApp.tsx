'use client'

import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { useWindow } from '@/components/desktop/Window'
import { useNotifications } from '@/hooks/useNotifications'
import { getNotesClientId } from '@/lib/notes/client-id'
import { useTranslation } from '@/lib/i18n/useTranslation'
import { NotesDetailPane } from './notes/NotesDetailPane'
import { NotesDraftPane } from './notes/NotesDraftPane'
import { NotesList } from './notes/NotesList'
import { NotesSidebar } from './notes/NotesSidebar'
import { NotesToolbar } from './notes/NotesToolbar'
import {
  mapNoteRecord,
  type CreateNoteResponse,
  type DraftNote,
  type Note,
  type NotesCooldown,
  type NotesResponse,
  type NotesViewMode,
} from './notes/types'

const EMPTY_COOLDOWN: NotesCooldown = { nextAllowedAt: null }

export function NotesApp() {
  const { dragControls } = useWindow()
  const { pushError } = useNotifications()
  const { t } = useTranslation()
  const [notes, setNotes] = useState<Note[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [cooldown, setCooldown] = useState<NotesCooldown>(EMPTY_COOLDOWN)
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<NotesViewMode>('gallery')
  const [draft, setDraft] = useState<DraftNote | null>(null)
  const [activeSection, setActiveSection] = useState<'owner' | 'visitor' | 'trashed'>('visitor')
  const deferredQuery = useDeferredValue(query)

  useEffect(() => {
    let cancelled = false

    async function loadNotes() {
      try {
        const clientId = getNotesClientId()
        const response = await fetch(`/api/notes?clientId=${encodeURIComponent(clientId)}`)
        const payload = (await response.json()) as NotesResponse

        if (cancelled) {
          return
        }

        setNotes(payload.notes.map(mapNoteRecord))
        setCooldown(payload.cooldown ?? EMPTY_COOLDOWN)
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : t('notes.serverError'))
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadNotes()

    return () => {
      cancelled = true
    }
  }, [t])

  const filteredNotes = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase()
    const sectionNotes = notes.filter((note) => {
      if (activeSection === 'trashed') {
        return note.status === 'trashed'
      }

      return note.status === 'published' && note.source === activeSection
    })

    if (!normalizedQuery) {
      return sectionNotes
    }

    return sectionNotes.filter((note) =>
      `${note.authorName} ${note.content}`.toLowerCase().includes(normalizedQuery),
    )
  }, [activeSection, deferredQuery, notes])

  useEffect(() => {
    if (notes.length === 0) {
      setSelectedNoteId(null)
      return
    }

    setSelectedNoteId((current) => {
      if (current && notes.some((note) => note.id === current)) {
        return current
      }
      return null
    })
  }, [filteredNotes, notes])

  const cooldownActive = Boolean(cooldown.nextAllowedAt)
  const selectedNote = notes.find((note) => note.id === selectedNoteId) ?? null
  const isDrafting = draft !== null
  const hasRightPane = isDrafting || selectedNote !== null || Boolean(error)
  const ownerCount = notes.filter((note) => note.source === 'owner' && note.status === 'published').length
  const visitorCount = notes.filter((note) => note.source === 'visitor' && note.status === 'published').length
  const trashedCount = notes.filter((note) => note.status === 'trashed').length

  function handleCreateNote() {
    setDraft({ content: '', displayName: '', publishMode: false, createdAt: new Date().toISOString() })
    setSelectedNoteId(null)
  }

  function handleCancelDraft() {
    setDraft(null)
  }

  async function handleDraftPublish() {
    if (!draft) return

    if (!draft.publishMode) {
      setDraft((current) => (current ? { ...current, publishMode: true } : current))
      return
    }

    if (cooldownActive) {
      pushError({
        title: t('notes.cooldownTitle'),
        message: t('notes.cooldownBody').replace('{date}', new Date(cooldown.nextAllowedAt ?? '').toLocaleString()),
        source: t('notes.title'),
      })
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          displayName: draft.displayName,
          message: draft.content,
          clientId: getNotesClientId(),
        }),
      })

      const payload = (await response.json()) as CreateNoteResponse & { error?: string }

      if (!response.ok) {
        if (payload.cooldown) {
          setCooldown(payload.cooldown)
          pushError({
            title: t('notes.cooldownTitle'),
            message: t('notes.cooldownBody').replace(
              '{date}',
              new Date(payload.cooldown.nextAllowedAt ?? '').toLocaleString(),
            ),
            source: t('notes.title'),
          })
          return
        }
        pushError({
          title: t('notes.serverError'),
          message: payload.error ?? t('notes.serverError'),
          source: t('notes.title'),
        })
        return
      }

      const nextNote = mapNoteRecord(payload.note)
      setNotes((current) => [nextNote, ...current])
      setSelectedNoteId(nextNote.id)
      setCooldown(payload.cooldown)
      setDraft(null)
      setActiveSection(nextNote.source)
    } catch (submitError) {
      pushError({
        title: t('notes.serverError'),
        message: submitError instanceof Error ? submitError.message : t('notes.serverError'),
        source: t('notes.title'),
      })
    } finally {
      setSubmitting(false)
    }
  }

  function renderRightPane() {
    if (isDrafting) {
      return (
        <NotesDraftPane
          content={draft.content}
          displayName={draft.displayName}
          publishMode={draft.publishMode}
          createdAt={draft.createdAt}
          submitting={submitting}
          onContentChange={(value) =>
            setDraft((current) => (current ? { ...current, content: value } : current))
          }
          onDisplayNameChange={(value) =>
            setDraft((current) => (current ? { ...current, displayName: value } : current))
          }
          onPublish={handleDraftPublish}
          onCancel={handleCancelDraft}
        />
      )
    }

    if (!selectedNote && !error) {
      return null
    }

    return <NotesDetailPane note={selectedNote} error={error} />
  }

  return (
    <div className="h-full flex p-2 gap-2 overflow-hidden text-foreground font-sans bg-background">
      <div
        onPointerDown={(event) => dragControls.start(event)}
        className="cursor-grab active:cursor-grabbing flex shrink-0"
      >
        <NotesSidebar
          ownerCount={ownerCount}
          visitorCount={visitorCount}
          trashedCount={trashedCount}
          activeSection={activeSection}
          onSelectSection={setActiveSection}
        />
      </div>

      <div className="relative flex-1 flex flex-col bg-black/[0.02] dark:bg-black/[0.03] dark:bg-white/[0.02] rounded-2xl border border-border-subtle overflow-hidden">
        <div
          onPointerDown={(event) => dragControls.start(event)}
          className="cursor-grab active:cursor-grabbing"
        >
          <NotesToolbar
            query={query}
            onQueryChange={setQuery}
            onCreateNote={handleCreateNote}
            canCreate={!isDrafting}
            viewMode={viewMode}
            onToggleViewMode={() => setViewMode((v) => (v === 'gallery' ? 'list' : 'gallery'))}
          />
        </div>

        <div className="notes-split-pane flex flex-1 flex-row overflow-hidden">
          <section className="flex min-h-0 min-w-[320px] basis-[44%] flex-col border-r border-border-subtle">
            {loading ? (
              <div className="flex flex-1 items-center justify-center px-8 text-[13px] text-foreground/35">
                {t('notes.loading')}
              </div>
            ) : (
              <NotesList
                notes={filteredNotes}
                selectedNoteId={selectedNoteId}
                onSelectNote={(id) => {
                  setDraft(null)
                  setSelectedNoteId(id)
                }}
                viewMode={viewMode}
              />
            )}
          </section>

          <div className="flex min-h-0 min-w-[360px] basis-[56%] shrink-0">
            {hasRightPane ? renderRightPane() : <div aria-hidden="true" className="flex-1" />}
          </div>
        </div>
      </div>
    </div>
  )
}
