import { describe, expect, it, vi, beforeEach, afterEach } from "vitest"

import { GET, POST } from "./route"
import { createSupabaseServerClient } from "@/lib/supabase-server"

type SupabaseResponse = { data: unknown; error?: unknown }

vi.mock("@/lib/supabase-server", () => ({
  createSupabaseServerClient: vi.fn(),
}))

function createMockBuilder(getResponse: () => SupabaseResponse) {
  const builder: Record<string, ReturnType<typeof vi.fn>> & {
    then?: (
      onFulfilled: (value: SupabaseResponse) => unknown,
      onRejected?: (reason: unknown) => unknown,
    ) => Promise<unknown>
    catch?: (onRejected: (reason: unknown) => unknown) => Promise<unknown>
  } = {}

  const methods = ["select", "eq", "order", "limit", "maybeSingle", "insert"]
  for (const method of methods) {
    builder[method] = vi.fn(() => builder)
  }

  builder.then = (
    onFulfilled: (value: SupabaseResponse) => unknown,
    onRejected?: (reason: unknown) => unknown,
  ) => Promise.resolve(getResponse()).then(onFulfilled, onRejected)

  builder.catch = (onRejected: (reason: unknown) => unknown) =>
    Promise.resolve(getResponse()).catch(onRejected)

  return builder
}

function createSupabaseMock(responses: SupabaseResponse[]) {
  const queue = [...responses]
  const builders: Array<ReturnType<typeof createMockBuilder>> = []

  return {
    from: vi.fn(() => {
      const response = queue.shift() ?? { data: null, error: null }
      const builder = createMockBuilder(() => response)
      builders.push(builder)
      return builder
    }),
    _builders: builders,
  }
}

function setupSupabaseMock(responses: SupabaseResponse[]) {
  const mock = createSupabaseMock(responses)
  createSupabaseServerClient.mockImplementation(() => mock as never)
  return mock
}

function createPostRequest(body: Record<string, unknown>) {
  return new Request("http://localhost/api/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
}

describe("Notes API route", () => {
  beforeEach(() => {
    vi.useRealTimers()
    createSupabaseServerClient.mockReset()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("returns published notes sorted newest first", async () => {
    const data = [
      {
        id: "note-a",
        title: "First note",
        content: "Hello",
        author_name: "Author",
        client_id: "client-a",
        source: "owner",
        status: "published",
        created_at: "2026-03-15T08:00:00.000Z",
        updated_at: "2026-03-15T08:00:00.000Z",
        note_tags: [
          {
            tags: {
              id: "tag-1",
              slug: "projects",
              label: "Projects",
            },
          },
        ],
      },
      {
        id: "note-b",
        title: "Second note",
        content: "World",
        author_name: "Author B",
        client_id: "client-b",
        source: "visitor",
        status: "published",
        created_at: "2026-03-17T09:00:00.000Z",
        updated_at: "2026-03-17T09:00:00.000Z",
        note_tags: [
          {
            tags: {
              id: "tag-2",
              slug: "guestbook",
              label: "Guestbook",
            },
          },
        ],
      },
    ]

    const supabase = setupSupabaseMock([{ data, error: null }])

    const response = await GET(new Request("http://localhost/api/notes"))
    expect(response.status).toBe(200)

    const json = await response.json()
    expect(json).toEqual({
      notes: [
        {
          id: "note-b",
          title: "Second note",
          content: "World",
          author_name: "Author B",
          source: "visitor",
          status: "published",
          created_at: "2026-03-17T09:00:00.000Z",
          tags: [{ id: "tag-2", slug: "guestbook", label: "Guestbook" }],
        },
        {
          id: "note-a",
          title: "First note",
          content: "Hello",
          author_name: "Author",
          source: "owner",
          status: "published",
          created_at: "2026-03-15T08:00:00.000Z",
          tags: [{ id: "tag-1", slug: "projects", label: "Projects" }],
        },
      ],
      cooldown: { nextAllowedAt: null },
    })

    expect(supabase.from).toHaveBeenCalledWith("notes")
  })

  it("returns the active cooldown for a client on notes fetch", async () => {
    vi.useFakeTimers().setSystemTime(new Date("2026-03-17T00:00:00.000Z"))

    const data = [
      {
        id: "note-a",
        title: "First note",
        content: "Hello",
        author_name: "Author",
        client_id: "client-a",
        status: "published",
        created_at: "2026-03-15T08:00:00.000Z",
        updated_at: "2026-03-15T08:00:00.000Z",
        note_tags: [],
      },
    ]

    setupSupabaseMock([
      { data, error: null },
      {
        data: {
          created_at: "2026-03-16T13:00:00.000Z",
        },
        error: null,
      },
    ])

    const response = await GET(new Request("http://localhost/api/notes?clientId=client-1"))
    expect(response.status).toBe(200)

    const json = await response.json()
    expect(json).toEqual({
      notes: [
        {
          id: "note-a",
          title: "First note",
          content: "Hello",
          author_name: "Author",
          status: "published",
          created_at: "2026-03-15T08:00:00.000Z",
          tags: [],
        },
      ],
      cooldown: {
        nextAllowedAt: "2026-03-17T13:00:00.000Z",
      },
    })
  })

  it("filters notes by section and tag", async () => {
    const data = [
      {
        id: "note-owner-projects",
        title: "Projects",
        content: "Owner projects",
        author_name: "Hugo",
        client_id: "owner-client",
        source: "owner",
        status: "published",
        created_at: "2026-03-19T09:00:00.000Z",
        updated_at: "2026-03-19T09:00:00.000Z",
        note_tags: [{ tags: { id: "tag-1", slug: "projects", label: "Projects" } }],
      },
      {
        id: "note-owner-skills",
        title: "Skills",
        content: "Owner skills",
        author_name: "Hugo",
        client_id: "owner-client",
        source: "owner",
        status: "published",
        created_at: "2026-03-18T09:00:00.000Z",
        updated_at: "2026-03-18T09:00:00.000Z",
        note_tags: [{ tags: { id: "tag-2", slug: "skills", label: "Skills" } }],
      },
    ]

    setupSupabaseMock([{ data, error: null }])

    const response = await GET(new Request("http://localhost/api/notes?section=owner&tag=projects"))
    expect(response.status).toBe(200)

    const json = await response.json()
    expect(json).toEqual({
      notes: [
        {
          id: "note-owner-projects",
          title: "Projects",
          content: "Owner projects",
          author_name: "Hugo",
          source: "owner",
          status: "published",
          created_at: "2026-03-19T09:00:00.000Z",
          tags: [{ id: "tag-1", slug: "projects", label: "Projects" }],
        },
      ],
      cooldown: { nextAllowedAt: null },
    })
  })

  it("returns translated owner note content for the requested locale", async () => {
    const data = [
      {
        id: "note-owner-about",
        title: "About",
        content: "Base English owner note",
        author_name: "Hugo Garrigues",
        client_id: "owner-seeded",
        source: "owner",
        status: "published",
        created_at: "2026-03-20T09:00:00.000Z",
        updated_at: "2026-03-20T09:00:00.000Z",
        note_tags: [{ tags: { id: "tag-1", slug: "about", label: "About" } }],
        owner_note_translations: [
          {
            locale: "fr",
            title: "À propos",
            content: "Note owner en français",
          },
        ],
      },
    ]

    setupSupabaseMock([{ data, error: null }])

    const response = await GET(new Request("http://localhost/api/notes?section=owner&locale=fr"))
    expect(response.status).toBe(200)

    const json = await response.json()
    expect(json).toEqual({
      notes: [
        {
          id: "note-owner-about",
          title: "À propos",
          content: "Note owner en français",
          author_name: "Hugo Garrigues",
          source: "owner",
          status: "published",
          created_at: "2026-03-20T09:00:00.000Z",
          tags: [{ id: "tag-1", slug: "about", label: "About" }],
        },
      ],
      cooldown: { nextAllowedAt: null },
    })
  })

  it("rejects invalid payloads", async () => {
    setupSupabaseMock([{ data: null, error: null }])

    const response = await POST(createPostRequest({ displayName: "", message: "Test" }))
    expect(response.status).toBe(400)

    const json = await response.json()
    expect(json).toHaveProperty("error")
  })

  it("rejects a second note during the 24h cooldown", async () => {
    vi.useFakeTimers().setSystemTime(new Date("2026-03-17T00:00:00.000Z"))

    const payload = {
      displayName: "Tester",
      message: "Cooldown",
      clientId: "client-1",
    }

    setupSupabaseMock([
      {
        data: {
          created_at: "2026-03-16T13:00:00.000Z",
        },
        error: null,
      },
    ])

    const response = await POST(createPostRequest(payload))
    expect(response.status).toBe(429)

    const json = await response.json()
    expect(json).toHaveProperty("error")
    expect(json).toMatchObject({
      cooldown: {
        nextAllowedAt: "2026-03-17T13:00:00.000Z",
      },
    })
  })

  it("creates a published note when submission is allowed", async () => {
    vi.useFakeTimers().setSystemTime(new Date("2026-03-17T00:00:00.000Z"))

    const payload = {
      displayName: "  Trimmed  ",
      message: "  First line of the note\nSecond line  ",
      clientId: "client-1",
    }

    const insertedNote = {
      id: "inserted",
      title: "First line of the note",
      content: "Message",
      author_name: "Trimmed",
      client_id: "client-1",
      source: "visitor",
      status: "published",
      created_at: "2026-03-17T00:05:00.000Z",
      updated_at: "2026-03-17T00:05:00.000Z",
      note_tags: [],
    }

    const supabase = setupSupabaseMock([
      { data: null, error: null },
      { data: insertedNote, error: null },
    ])

    const response = await POST(createPostRequest(payload))
    expect(response.status).toBe(200)

    const json = await response.json()
    expect(json.note).toEqual({
      id: "inserted",
      title: "First line of the note",
      content: "Message",
      author_name: "Trimmed",
      source: "visitor",
      status: "published",
      created_at: "2026-03-17T00:05:00.000Z",
      tags: [],
    })
    expect(json.cooldown).toEqual({ nextAllowedAt: "2026-03-18T00:05:00.000Z" })
    expect(supabase._builders[1].insert).toHaveBeenCalledWith({
      title: "First line of the note",
      content: "First line of the note\nSecond line",
      author_name: "Trimmed",
      client_id: "client-1",
      source: "visitor",
      status: "published",
    })
  })
})
