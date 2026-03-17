'use client'

import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { useWindow } from '@/components/desktop/Window'
import { getNotesClientId } from '@/lib/notes/client-id'
import { useTranslation } from '@/lib/i18n/useTranslation'
import { NotesComposer } from './notes/NotesComposer'
import { NotesDetailPane } from './notes/NotesDetailPane'
import { NotesList } from './notes/NotesList'
import { NotesSidebar } from './notes/NotesSidebar'
import { NotesToolbar } from './notes/NotesToolbar'
import {
  mapNoteRecord,
  type CreateNoteResponse,
  type Note,
  type NotesCooldown,
  type NotesResponse,
} from './notes/types'

const EMPTY_COOLDOWN: NotesCooldown = { nextAllowedAt: null }

export function NotesApp() {
  const { dragControls } = useWindow()
  const { t } = useTranslation()
  const [notes, setNotes] = useState<Note[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [composerOpen, setComposerOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [cooldown, setCooldown] = useState<NotesCooldown>(EMPTY_COOLDOWN)
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)
  const deferredQuery = useDeferredValue(query)

  useEffect(() => {
    let cancelled = false

    async function loadNotes() {
      try {
        const response = await fetch('/api/notes')
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

    if (!normalizedQuery) {
      return notes
    }

    return notes.filter((note) =>
      `${note.title} ${note.content}`.toLowerCase().includes(normalizedQuery),
    )
  }, [deferredQuery, notes])

  useEffect(() => {
    if (notes.length === 0) {
      setSelectedNoteId(null)
      return
    }

    setSelectedNoteId((current) => {
      if (current && notes.some((note) => note.id === current)) {
        return current
      }

      return notes[0].id
    })
  }, [notes])

  const cooldownActive = Boolean(cooldown.nextAllowedAt)
  const selectedNote = notes.find((note) => note.id === selectedNoteId) ?? null

  async function handleSubmit(values: { displayName: string; title: string; message: string }) {
    setSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          clientId: getNotesClientId(),
        }),
      })

      const payload = (await response.json()) as CreateNoteResponse & { error?: string }

      if (!response.ok) {
        throw new Error(payload.error ?? t('notes.serverError'))
      }

      const nextNote = mapNoteRecord(payload.note)
      setNotes((current) => [nextNote, ...current])
      setSelectedNoteId(nextNote.id)
      setCooldown(payload.cooldown)
      setComposerOpen(false)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : t('notes.serverError'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="h-full flex p-2 gap-2 overflow-hidden text-foreground font-sans bg-background">
      <div
        onPointerDown={(event) => dragControls.start(event)}
        className="cursor-grab active:cursor-grabbing flex shrink-0"
      >
        <NotesSidebar noteCount={notes.length} />
      </div>

      <div className="relative flex-1 flex flex-col bg-black/[0.02] dark:bg-black/[0.03] dark:bg-white/[0.02] rounded-2xl border border-border-subtle overflow-hidden">
        <div
          onPointerDown={(event) => dragControls.start(event)}
          className="cursor-grab active:cursor-grabbing"
        >
          <NotesToolbar
            query={query}
            onQueryChange={setQuery}
            onOpenComposer={() => setComposerOpen(true)}
            canCreate={!cooldownActive}
            noteCount={notes.length}
          />
        </div>

        {cooldownActive ? (
          <div className="border-b border-border-subtle px-6 py-3">
            <h3 className="text-[12px] font-semibold text-foreground/90">{t('notes.cooldownTitle')}</h3>
            <p className="mt-1 max-w-3xl text-[12px] leading-relaxed text-foreground/50">
              {t('notes.cooldownBody').replace('{date}', new Date(cooldown.nextAllowedAt ?? '').toLocaleString())}
            </p>
          </div>
        ) : null}

        {error && !composerOpen ? (
          <p className="px-8 py-4 text-[13px] text-red-300">{error}</p>
        ) : null}

        <div className="flex flex-1 overflow-hidden flex-col xl:flex-row">
          <section className="flex min-h-0 min-w-0 flex-1 flex-col xl:max-w-[400px] xl:border-r border-border-subtle">
            {loading ? (
              <div className="flex flex-1 items-center justify-center px-8 text-[13px] text-foreground/35">
                {t('notes.loading')}
              </div>
            ) : (
              <NotesList
                notes={filteredNotes}
                selectedNoteId={selectedNoteId}
                onSelectNote={setSelectedNoteId}
              />
            )}
          </section>

          <NotesDetailPane note={selectedNote} />
        </div>

        <NotesComposer
          open={composerOpen}
          submitting={submitting}
          error={error}
          onClose={() => setComposerOpen(false)}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}
