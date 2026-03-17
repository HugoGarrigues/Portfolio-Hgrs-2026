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
        status: "published",
        created_at: "2026-03-15T08:00:00.000Z",
        updated_at: "2026-03-15T08:00:00.000Z",
      },
      {
        id: "note-b",
        title: "Second note",
        content: "World",
        author_name: "Author B",
        client_id: "client-b",
        status: "published",
        created_at: "2026-03-17T09:00:00.000Z",
        updated_at: "2026-03-17T09:00:00.000Z",
      },
    ]

    const supabase = setupSupabaseMock([{ data, error: null }])

    const response = await GET(new Request("http://localhost/api/notes"))
    expect(response.status).toBe(200)

    const json = await response.json()
    expect(json).toEqual({
      notes: [data[1], data[0]],
    })

    expect(supabase.from).toHaveBeenCalledWith("notes")
  })

  it("rejects invalid payloads", async () => {
    setupSupabaseMock([{ data: null, error: null }])

    const response = await POST(createPostRequest({ title: "", message: "Test" }))
    expect(response.status).toBe(400)

    const json = await response.json()
    expect(json).toHaveProperty("error")
  })

  it("rejects a second note during the 24h cooldown", async () => {
    vi.useFakeTimers().setSystemTime(new Date("2026-03-17T00:00:00.000Z"))

    const payload = {
      displayName: "Tester",
      title: "Hi",
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
      title: "  Title  ",
      message: "  Message  ",
      clientId: "client-1",
    }

    const insertedNote = {
      id: "inserted",
      title: "Title",
      content: "Message",
      author_name: "Trimmed",
      client_id: "client-1",
      status: "published",
      created_at: "2026-03-17T00:05:00.000Z",
      updated_at: "2026-03-17T00:05:00.000Z",
    }

    const supabase = setupSupabaseMock([
      { data: null, error: null },
      { data: insertedNote, error: null },
    ])

    const response = await POST(createPostRequest(payload))
    expect(response.status).toBe(200)

    const json = await response.json()
    expect(json.note).toEqual(insertedNote)
    expect(json.cooldown).toEqual({ nextAllowedAt: "2026-03-18T00:05:00.000Z" })
    expect(supabase._builders[1].insert).toHaveBeenCalledWith({
      title: "Title",
      content: "Message",
      author_name: "Trimmed",
      client_id: "client-1",
      status: "published",
    })
  })
})
