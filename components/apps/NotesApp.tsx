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
import { mapNoteRecord, type CreateNoteResponse, type DraftNote, type Note, type NoteTag, type NotesCooldown, type NotesResponse, type NotesViewMode } from './notes/types'

const EMPTY_COOLDOWN: NotesCooldown = { nextAllowedAt: null }

function getSectionForNote(note: Note): 'owner' | 'visitor' | 'trashed' {
  if (note.status === 'trashed') {
    return 'trashed'
  }

  return note.source
}

export function NotesApp() {
  const { dragControls } = useWindow()
  const { pushError } = useNotifications()
  const { t, locale } = useTranslation()
  const [notes, setNotes] = useState<Note[]>([])
  const [noteCache, setNoteCache] = useState<Record<string, Note>>({})
  const [sectionCounts, setSectionCounts] = useState<Record<'owner' | 'visitor' | 'trashed', number>>({
    owner: 0,
    visitor: 0,
    trashed: 0,
  })
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [cooldown, setCooldown] = useState<NotesCooldown>(EMPTY_COOLDOWN)
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)
  const [navigationHistory, setNavigationHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [viewMode, setViewMode] = useState<NotesViewMode>('gallery')
  const [draft, setDraft] = useState<DraftNote | null>(null)
  const [activeSection, setActiveSection] = useState<'owner' | 'visitor' | 'trashed'>('visitor')
  const [activeTagSlug, setActiveTagSlug] = useState<string | null>(null)
  const deferredQuery = useDeferredValue(query)

  useEffect(() => {
    let cancelled = false

    async function loadNotes() {
      try {
        const clientId = getNotesClientId()
        const searchParams = new URLSearchParams({
          clientId,
          section: activeSection,
          locale,
        })
        if (activeTagSlug) {
          searchParams.set('tag', activeTagSlug)
        }

        const response = await fetch(`/api/notes?${searchParams.toString()}`)
        const payload = (await response.json()) as NotesResponse

        if (cancelled) {
          return
        }

        const mappedNotes = payload.notes.map(mapNoteRecord)
        setNotes(mappedNotes)
        setNoteCache((current) => {
          const nextCache = { ...current }
          for (const note of mappedNotes) {
            nextCache[note.id] = note
          }
          return nextCache
        })
        setSectionCounts((current) => ({
          ...current,
          [activeSection]: mappedNotes.length,
        }))
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
  }, [activeSection, activeTagSlug, locale, t])

  const filteredNotes = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase()
    if (!normalizedQuery) {
      return notes
    }

    return notes.filter((note) =>
      `${note.authorName} ${note.content}`.toLowerCase().includes(normalizedQuery),
    )
  }, [deferredQuery, notes])

  useEffect(() => {
    if (notes.length === 0) {
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
  const selectedNote = (selectedNoteId ? noteCache[selectedNoteId] : null) ?? null
  const isDrafting = draft !== null
  const hasRightPane = isDrafting || selectedNote !== null || Boolean(error)
  const canGoBack = historyIndex > 0
  const canGoForward = historyIndex >= 0 && historyIndex < navigationHistory.length - 1
  const ownerCount = sectionCounts.owner
  const visitorCount = sectionCounts.visitor
  const trashedCount = sectionCounts.trashed
  const visibleTags = useMemo(() => {
    const seen = new Map<string, NoteTag>()
    for (const note of Object.values(noteCache)) {
      for (const tag of note.tags) {
        if (!seen.has(tag.slug)) {
          seen.set(tag.slug, tag)
        }
      }
    }
    return [...seen.values()]
  }, [noteCache])
  const activeTagLabel = visibleTags.find((tag) => tag.slug === activeTagSlug)?.label ?? activeTagSlug

  function handleCreateNote() {
    setDraft({ content: '', displayName: '', publishMode: false, createdAt: new Date().toISOString() })
    setSelectedNoteId(null)
  }

  function selectNote(id: string) {
    setDraft(null)
    setSelectedNoteId(id)
    setNavigationHistory((current) => {
      const trimmedHistory = current.slice(0, historyIndex + 1)
      if (trimmedHistory[trimmedHistory.length - 1] === id) {
        return trimmedHistory
      }
      const nextHistory = [...trimmedHistory, id]
      setHistoryIndex(nextHistory.length - 1)
      return nextHistory
    })
  }

  function handleGoBack() {
    if (!canGoBack) return
    const nextIndex = historyIndex - 1
    const nextNoteId = navigationHistory[nextIndex] ?? null
    const nextNote = nextNoteId ? noteCache[nextNoteId] : null
    setHistoryIndex(nextIndex)
    setDraft(null)
    setSelectedNoteId(nextNoteId)
    if (nextNote) {
      setActiveSection(getSectionForNote(nextNote))
    }
  }

  function handleGoForward() {
    if (!canGoForward) return
    const nextIndex = historyIndex + 1
    const nextNoteId = navigationHistory[nextIndex] ?? null
    const nextNote = nextNoteId ? noteCache[nextNoteId] : null
    setHistoryIndex(nextIndex)
    setDraft(null)
    setSelectedNoteId(nextNoteId)
    if (nextNote) {
      setActiveSection(getSectionForNote(nextNote))
    }
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
      setNoteCache((current) => ({ ...current, [nextNote.id]: nextNote }))
      setNavigationHistory((current) => {
        const trimmedHistory = current.slice(0, historyIndex + 1)
        const nextHistory = [...trimmedHistory, nextNote.id]
        setHistoryIndex(nextHistory.length - 1)
        return nextHistory
      })
      setSelectedNoteId(nextNote.id)
      setCooldown(payload.cooldown)
      setDraft(null)
      setActiveSection(getSectionForNote(nextNote))
      setSectionCounts((current) => ({
        ...current,
        [getSectionForNote(nextNote)]: current[getSectionForNote(nextNote)] + 1,
      }))
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
          tags={visibleTags}
          activeTagSlug={activeTagSlug}
          activeSection={activeSection}
          onSelectSection={(section) => {
            setActiveSection(section)
            setActiveTagSlug(null)
            setSelectedNoteId(null)
          }}
          onSelectTag={(tagSlug) => {
            setActiveTagSlug(tagSlug)
            setSelectedNoteId(null)
          }}
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
            canGoBack={canGoBack}
            canGoForward={canGoForward}
            onGoBack={handleGoBack}
            onGoForward={handleGoForward}
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
                onSelectNote={selectNote}
                viewMode={viewMode}
                activeSection={activeSection}
                activeTagLabel={activeTagLabel}
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
