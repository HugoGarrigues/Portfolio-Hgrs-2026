import { NextResponse } from "next/server"

import { getNextAllowedAt, isCooldownActive } from "@/lib/notes/cooldown"
import { createVisitorNote, getLatestNoteForClient, listNotes, type NoteSection } from "@/lib/notes/repository"
import { presentNoteRow, presentNoteRows } from "@/lib/notes/presenter"
import { validateCreateNoteInput } from "@/lib/notes/validation"
import type { Locale } from "@/lib/i18n/locales"

function deriveNoteTitle(message: string) {
  const firstMeaningfulLine = message
    .split("\n")
    .map((line) => line.trim())
    .find(Boolean)

  if (!firstMeaningfulLine) {
    return "Note"
  }

  return firstMeaningfulLine.slice(0, 80)
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const clientId = searchParams.get("clientId")?.trim() ?? ""
  const requestedSection = searchParams.get("section")?.trim() ?? "visitor"
  const activeTag = searchParams.get("tag")?.trim().toLowerCase() ?? ""
  const requestedLocale = (searchParams.get("locale")?.trim() ?? "fr") as Locale

  if (!["owner", "visitor", "trashed"].includes(requestedSection)) {
    return NextResponse.json({ error: "Section de notes invalide" }, { status: 400 })
  }

  const { data, error } = await listNotes(requestedSection as NoteSection)

  if (error) {
    console.error("Supabase GET error", error)
    return NextResponse.json({ error: "Impossible de charger les notes" }, { status: 500 })
  }

  const notes = Array.isArray(data) ? presentNoteRows(data, requestedLocale) : []
  const filteredNotes = activeTag
    ? notes.filter((note) => note.tags?.some((tag) => tag.slug.toLowerCase() === activeTag))
    : notes
  const sortedFilteredNotes = [...filteredNotes].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  )

  if (!clientId) {
    return NextResponse.json({ notes: sortedFilteredNotes, cooldown: { nextAllowedAt: null } })
  }

  const { data: latestNote, error: latestError } = await getLatestNoteForClient(clientId)

  if (latestError) {
    console.error("Supabase GET cooldown lookup failed", latestError)
    return NextResponse.json({ error: "Impossible de vérifier le délai d'attente" }, { status: 500 })
  }

  const cooldown =
    latestNote && typeof latestNote.created_at === "string" && isCooldownActive(latestNote.created_at)
      ? { nextAllowedAt: getNextAllowedAt(latestNote.created_at) }
      : { nextAllowedAt: null }

  return NextResponse.json({ notes: sortedFilteredNotes, cooldown })
}

export async function POST(req: Request) {
  let payload: unknown
  try {
    payload = await req.json()
  } catch (error) {
    console.error("Failed to parse body", error)
    return NextResponse.json({ error: "Corps JSON invalide" }, { status: 400 })
  }

  const validation = validateCreateNoteInput(payload)

  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 })
  }

  const { clientId, displayName, message } = validation.value
  const title = deriveNoteTitle(message)

  const { data: latestNote, error: latestError } = await getLatestNoteForClient(clientId)

  if (latestError) {
    console.error("Supabase cooldown lookup failed", latestError)
    return NextResponse.json({ error: "Impossible de vérifier le délai d'attente" }, { status: 500 })
  }

  if (latestNote && typeof latestNote.created_at === "string" && isCooldownActive(latestNote.created_at)) {
    return NextResponse.json(
      {
        error: "Veuillez patienter avant de publier une nouvelle note",
        cooldown: { nextAllowedAt: getNextAllowedAt(latestNote.created_at) },
      },
      { status: 429 },
    )
  }

  const { data: createdNote, error: insertError } = await createVisitorNote({
    displayName,
    message,
    clientId,
    title,
  })

  if (insertError || !createdNote) {
    console.error("Supabase insert error", insertError)
    return NextResponse.json({ error: "Impossible d'enregistrer la note" }, { status: 500 })
  }

  return NextResponse.json({
    note: presentNoteRow(createdNote),
    cooldown: { nextAllowedAt: getNextAllowedAt(createdNote.created_at) },
  })
}
