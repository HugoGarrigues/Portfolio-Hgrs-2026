import { NextResponse } from "next/server"

import { createSupabaseServerClient } from "@/lib/supabase-server"
import { getNextAllowedAt, isCooldownActive } from "@/lib/notes/cooldown"
import { validateCreateNoteInput } from "@/lib/notes/validation"

type NoteRecord = {
  id: string
  title: string
  content: string
  author_name: string
  client_id: string
  status: "published" | "trashed"
  created_at: string
  updated_at: string
}

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

export async function GET() {
  const supabase = createSupabaseServerClient()

  const { data, error } = await supabase
    .from("notes")
    .select("id,title,content,author_name,client_id,status,created_at,updated_at")
    .eq("status", "published")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Supabase GET error", error)
    return NextResponse.json({ error: "Impossible de charger les notes" }, { status: 500 })
  }

  const notes = Array.isArray(data) ? (data as NoteRecord[]) : []
  const sortedNotes = [...notes].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  )

  return NextResponse.json({ notes: sortedNotes })
}

export async function POST(req: Request) {
  const supabase = createSupabaseServerClient()

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

  const { data: latestNote, error: latestError } = await supabase
    .from("notes")
    .select("created_at")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

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

  const { data: createdNote, error: insertError } = await supabase
    .from("notes")
    .insert({
      title,
      content: message,
      author_name: displayName,
      client_id: clientId,
      status: "published",
    })
    .select("id,title,content,author_name,client_id,status,created_at,updated_at")
    .maybeSingle()

  if (insertError || !createdNote) {
    console.error("Supabase insert error", insertError)
    return NextResponse.json({ error: "Impossible d'enregistrer la note" }, { status: 500 })
  }

  return NextResponse.json({
    note: createdNote,
    cooldown: { nextAllowedAt: getNextAllowedAt(createdNote.created_at) },
  })
}
