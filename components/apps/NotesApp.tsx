'use client'

import { useEffect, useMemo, useState } from 'react'
import { useWindow } from '@/components/desktop/Window'
import { getNotesClientId } from '@/lib/notes/client-id'
import { useTranslation } from '@/lib/i18n/useTranslation'
import { NotesComposer } from './notes/NotesComposer'
import { NotesList } from './notes/NotesList'
import { NotesSidebar } from './notes/NotesSidebar'
import { NotesToolbar } from './notes/NotesToolbar'
import { mapNoteRecord, type CreateNoteResponse, type Note, type NotesCooldown, type NotesResponse } from './notes/types'

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
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) {
      return notes
    }

    return notes.filter((note) =>
      `${note.title} ${note.content}`.toLowerCase().includes(normalizedQuery),
    )
  }, [notes, query])

  const cooldownActive = Boolean(cooldown.nextAllowedAt)

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

      setNotes((current) => [mapNoteRecord(payload.note), ...current])
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
        className="cursor-grab active:cursor-grabbing"
      >
        <NotesSidebar />
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
          />
        </div>

        {cooldownActive ? (
          <div className="border-b border-border-subtle px-6 py-3">
            <h3 className="text-[12px] font-semibold text-foreground/90">{t('notes.cooldownTitle')}</h3>
            <p className="mt-1 text-[12px] text-foreground/45">
              {t('notes.cooldownBody').replace('{date}', new Date(cooldown.nextAllowedAt ?? '').toLocaleString())}
            </p>
          </div>
        ) : null}

        {error && !composerOpen ? (
          <p className="px-6 py-3 text-[12px] text-red-300">{error}</p>
        ) : null}

        {loading ? (
          <div className="flex flex-1 items-center justify-center text-[12px] text-foreground/35">
            {t('notes.loading')}
          </div>
        ) : (
          <NotesList notes={filteredNotes} />
        )}

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
