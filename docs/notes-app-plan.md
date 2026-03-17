# Notes App Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a public Notes guestbook inside Portfolio OS with a macOS Notes-inspired UI, Supabase persistence through a Next.js API route, instant publishing, local search, and a 24-hour submission limit per browser/device.

**Architecture:** The Notes UI lives in a dedicated desktop app component and talks only to `/api/notes`. The API route validates requests, enforces the cooldown with a browser-stored `client_id`, and reads/writes published notes in Supabase. Moderation stays out of the app and is handled directly in Supabase.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS v4, Vitest, Testing Library, Supabase JavaScript client.

---

## File Structure

### Create

- `components/apps/NotesApp.tsx`
- `components/apps/notes/NotesSidebar.tsx`
- `components/apps/notes/NotesToolbar.tsx`
- `components/apps/notes/NotesList.tsx`
- `components/apps/notes/NoteCard.tsx`
- `components/apps/notes/NotesComposer.tsx`
- `components/apps/notes/types.ts`
- `components/apps/NotesApp.test.tsx`
- `app/api/notes/route.ts`
- `app/api/notes/route.test.ts`
- `lib/notes/client-id.ts`
- `lib/notes/validation.ts`
- `lib/notes/cooldown.ts`
- `lib/supabase.ts`
- `lib/supabase-server.ts`

### Modify

- `components/desktop/Desktop.tsx`
- `lib/i18n/translations/en.json`
- `lib/i18n/translations/fr.json`
- `lib/i18n/translations/de.json`
- `lib/i18n/translations/es.json`
- `lib/i18n/translations/it.json`
- `docs/notes-app-plan.md`

### Optional Create If Needed During Implementation

- `vitest.setup.ts`

### Infrastructure Outside Repo

- Supabase table: `notes`
- Supabase environment variables in local `.env.local`

## Task 1: Install and Wire Supabase

**Files:**
- Modify: `package.json`
- Create: `lib/supabase.ts`
- Create: `lib/supabase-server.ts`

- [ ] **Step 1: Add the dependency**

Run: `npm install @supabase/supabase-js`

Expected: package install completes and `package.json` / lockfile include `@supabase/supabase-js`.

- [ ] **Step 2: Add a browser-safe Supabase helper**

Create `lib/supabase.ts` with a small client factory based on:

```ts
import { createClient } from '@supabase/supabase-js'

export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    throw new Error('Supabase public env vars are missing')
  }

  return createClient(url, anonKey)
}
```

- [ ] **Step 3: Add a server-side Supabase helper**

Create `lib/supabase-server.ts` with:

```ts
import { createClient } from '@supabase/supabase-js'

export function createSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    throw new Error('Supabase env vars are missing')
  }

  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
```

- [ ] **Step 4: Record the required local environment**

Document or add locally:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Expected: local development has the two public Supabase env vars available.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json lib/supabase.ts lib/supabase-server.ts docs/notes-app-plan.md
git commit -m "chore: add notes app supabase setup"
```

## Task 2: Create the Notes Database Contract

**Files:**
- Create: `lib/notes/types.ts` or `components/apps/notes/types.ts` if the app owns the shapes
- Create: `lib/notes/validation.ts`
- Create: `lib/notes/cooldown.ts`
- Infrastructure: Supabase SQL editor

- [ ] **Step 1: Create the database table in Supabase**

Run in Supabase SQL editor:

```sql
create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  author_name text not null,
  client_id text not null,
  status text not null default 'published',
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists notes_status_created_at_idx
  on notes (status, created_at desc);

create index if not exists notes_client_id_created_at_idx
  on notes (client_id, created_at desc);
```

Expected: `notes` exists with the indexes needed for public reads and cooldown checks.

- [ ] **Step 2: Define shared Notes types**

Create the shared types:

```ts
export type NoteStatus = 'published'

export type NoteRecord = {
  id: string
  title: string
  content: string
  author_name: string
  client_id: string
  status: NoteStatus
  created_at: string
  updated_at: string
}

export type CreateNoteInput = {
  displayName: string
  title: string
  message: string
  clientId: string
}
```

- [ ] **Step 3: Add input validation helpers**

Create `lib/notes/validation.ts` with rules for required trimmed fields and max lengths, for example:

```ts
export const NOTE_LIMITS = {
  displayName: 60,
  title: 120,
  message: 1200,
} as const
```

The helper should return normalized values or a clear error object for invalid input.

- [ ] **Step 4: Add cooldown helpers**

Create `lib/notes/cooldown.ts` with helpers such as:

```ts
export const NOTES_COOLDOWN_MS = 24 * 60 * 60 * 1000

export function getNextAllowedAt(createdAt: string) {
  return new Date(new Date(createdAt).getTime() + NOTES_COOLDOWN_MS).toISOString()
}

export function isCooldownActive(createdAt: string, now = Date.now()) {
  return new Date(createdAt).getTime() + NOTES_COOLDOWN_MS > now
}
```

- [ ] **Step 5: Commit**

```bash
git add lib/notes/validation.ts lib/notes/cooldown.ts components/apps/notes/types.ts
git commit -m "feat: define notes data model and validation"
```

## Task 3: Implement the Notes API Route

**Files:**
- Create: `app/api/notes/route.ts`
- Test: `app/api/notes/route.test.ts`
- Create: `lib/supabase-server.ts`
- Create: `lib/notes/validation.ts`
- Create: `lib/notes/cooldown.ts`

- [ ] **Step 1: Write the failing API tests**

Cover at minimum:

```ts
it('returns published notes sorted newest first')
it('rejects invalid payloads')
it('rejects a second note during the 24h cooldown')
it('creates a published note when submission is allowed')
```

Run: `npm run test:run -- app/api/notes/route.test.ts`

Expected: FAIL because the route does not exist yet.

- [ ] **Step 2: Implement `GET /api/notes`**

Add a `GET` handler that:
- creates a Supabase server client
- selects `published` notes only
- orders by `created_at` descending
- returns a JSON payload like:

```ts
return NextResponse.json({ notes })
```

- [ ] **Step 3: Implement `POST /api/notes`**

Add a `POST` handler that:
- parses JSON safely
- validates and trims `displayName`, `title`, `message`, and `clientId`
- queries the latest note for the same `client_id`
- rejects with `429` if cooldown is active
- inserts a new `published` note
- returns the created note and the next allowed time

Suggested response shape:

```ts
return NextResponse.json({
  note,
  cooldown: { nextAllowedAt },
})
```

- [ ] **Step 4: Run the API tests**

Run: `npm run test:run -- app/api/notes/route.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/api/notes/route.ts app/api/notes/route.test.ts lib/notes/validation.ts lib/notes/cooldown.ts lib/supabase-server.ts
git commit -m "feat: add notes api route"
```

## Task 4: Add Client-Side Notes Utilities

**Files:**
- Create: `lib/notes/client-id.ts`
- Create: `components/apps/notes/types.ts`

- [ ] **Step 1: Create a stable client-id helper**

Add `lib/notes/client-id.ts` with logic similar to:

```ts
const STORAGE_KEY = 'hg_notes_client_id'

export function getNotesClientId() {
  const existing = window.localStorage.getItem(STORAGE_KEY)
  if (existing) return existing

  const next = crypto.randomUUID()
  window.localStorage.setItem(STORAGE_KEY, next)
  return next
}
```

- [ ] **Step 2: Define client-facing Notes view models**

Keep the UI-facing type narrow:

```ts
export type Note = {
  id: string
  title: string
  content: string
  authorName: string
  createdAt: string
}

export type NotesCooldown = {
  nextAllowedAt: string | null
}
```

- [ ] **Step 3: Add any mapping helpers needed between API and UI shapes**

Example:

```ts
export function mapNoteRecord(record: {
  id: string
  title: string
  content: string
  author_name: string
  created_at: string
}) {
  return {
    id: record.id,
    title: record.title,
    content: record.content,
    authorName: record.author_name,
    createdAt: record.created_at,
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add lib/notes/client-id.ts components/apps/notes/types.ts
git commit -m "feat: add notes client utilities"
```

## Task 5: Build the Notes UI Components

**Files:**
- Create: `components/apps/NotesApp.tsx`
- Create: `components/apps/notes/NotesSidebar.tsx`
- Create: `components/apps/notes/NotesToolbar.tsx`
- Create: `components/apps/notes/NotesList.tsx`
- Create: `components/apps/notes/NoteCard.tsx`
- Create: `components/apps/notes/NotesComposer.tsx`
- Modify: `components/desktop/Desktop.tsx`

- [ ] **Step 1: Write the failing UI tests**

Cover at minimum:

```ts
it('renders fetched notes')
it('filters notes locally from the search field')
it('submits a new note and appends it to the list')
it('shows cooldown messaging after a successful submission')
it('shows an empty state when no notes exist')
```

Run: `npm run test:run -- components/apps/NotesApp.test.tsx`

Expected: FAIL because the Notes app is not implemented yet.

- [ ] **Step 2: Build the static app shell**

Create `components/apps/NotesApp.tsx` using the same window/app conventions as `FinderApp.tsx` and `MailApp.tsx`:
- outer `p-2 gap-2` shell
- draggable sidebar and toolbar zones through `useWindow()`
- dark background and rounded inner panels matching the design system

- [ ] **Step 3: Split the app into focused UI pieces**

Implement:
- `NotesSidebar` for the left rail and posting rule
- `NotesToolbar` for title, search, and `New Note`
- `NotesList` for empty state and cards
- `NoteCard` for single-note rendering
- `NotesComposer` for the create form and submission state

- [ ] **Step 4: Add data loading and local search**

Inside `NotesApp.tsx`:
- fetch `/api/notes` on mount
- store notes, loading, error, search, and cooldown state
- filter by `title` and `content` in memory

- [ ] **Step 5: Add submission flow**

On submit:
- read `client_id` from `getNotesClientId()`
- `POST` to `/api/notes`
- append the returned note to local state
- update cooldown state from the response
- disable or hide the composer action until cooldown expires

- [ ] **Step 6: Wire the app into the desktop switch**

Update `components/desktop/Desktop.tsx`:

```ts
import { NotesApp } from '@/components/apps/NotesApp'
```

And add:

```ts
case 'notes': return <NotesApp />
```

- [ ] **Step 7: Run the Notes app tests**

Run: `npm run test:run -- components/apps/NotesApp.test.tsx`

Expected: PASS

- [ ] **Step 8: Commit**

```bash
git add components/apps/NotesApp.tsx components/apps/notes components/desktop/Desktop.tsx components/apps/NotesApp.test.tsx
git commit -m "feat: add notes desktop app"
```

## Task 6: Add Notes Localization

**Files:**
- Modify: `lib/i18n/translations/en.json`
- Modify: `lib/i18n/translations/fr.json`
- Modify: `lib/i18n/translations/de.json`
- Modify: `lib/i18n/translations/es.json`
- Modify: `lib/i18n/translations/it.json`

- [ ] **Step 1: Add Notes translation keys in English first**

Add a `notes` namespace with keys like:

```json
{
  "notes": {
    "title": "Notes",
    "newNote": "New Note",
    "searchPlaceholder": "Search",
    "postingRule": "1 note every 24 hours on this device",
    "emptyTitle": "No notes yet",
    "emptyBody": "Be the first to leave a note.",
    "fieldDisplayName": "Name",
    "fieldTitle": "Title",
    "fieldMessage": "Message",
    "submit": "Publish",
    "submitting": "Publishing…",
    "cooldownTitle": "You already posted a note",
    "cooldownBody": "You can publish another note after {date}.",
    "validationRequired": "All fields are required",
    "serverError": "Unable to publish your note right now"
  }
}
```

- [ ] **Step 2: Add matching keys to the other locale files**

Keep the same key structure in `fr`, `de`, `es`, and `it`.

- [ ] **Step 3: Use the translation keys in the Notes components**

Replace hardcoded UI strings in the Notes app with `useTranslation()`.

- [ ] **Step 4: Commit**

```bash
git add lib/i18n/translations/en.json lib/i18n/translations/fr.json lib/i18n/translations/de.json lib/i18n/translations/es.json lib/i18n/translations/it.json components/apps/NotesApp.tsx components/apps/notes
git commit -m "feat: localize notes app copy"
```

## Task 7: Verify the Full Feature

**Files:**
- Modify as needed based on failures found during verification

- [ ] **Step 1: Run lint**

Run: `npm run lint`

Expected: PASS

- [ ] **Step 2: Run targeted tests**

Run: `npm run test:run -- app/api/notes/route.test.ts components/apps/NotesApp.test.tsx`

Expected: PASS

- [ ] **Step 3: Run the full test suite**

Run: `npm run test:run`

Expected: PASS

- [ ] **Step 4: Manual smoke test in the app**

Run: `npm run dev`

Verify manually:
- Notes opens from the Dock/Finder
- Existing notes load
- Search filters locally
- New note submission works
- A second submission on the same device is blocked for 24 hours
- The success/cooldown copy is readable on desktop and mobile sizes

- [ ] **Step 5: Final commit**

```bash
git add .
git commit -m "feat: ship notes guestbook app"
```

## Implementation Notes

- Do not reintroduce public trash or restore controls in V1.
- Do not add hidden admin UI for moderation.
- Keep search fully client-side unless performance proves otherwise.
- Prefer small components over one large `NotesApp.tsx`.
- Follow the existing dark window styling from `components/apps/FinderApp.tsx` and `components/apps/MailApp.tsx`.
- Only add Framer Motion if the animation has a clear product reason.

## Done Definition

The feature is complete when:

- the Notes app renders as a first-class Portfolio OS app
- published notes are loaded from Supabase through `/api/notes`
- visitors can create exactly one note per device every 24 hours
- local search works
- the UI is translated through the existing i18n system
- tests and lint pass
