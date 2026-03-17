# Notes App Design Spec

**Date:** 2026-03-17

## Goal

Build a public Notes guestbook inside Portfolio OS with a dark macOS Notes-inspired interface, instant publishing, a gallery-style browsing experience, and a simple 24-hour submission limit per browser/device.

## Product Scope

### Included in V1

- Public browsing of published notes
- Public creation of a new note with `displayName`, `title`, and `message`
- Immediate publication after a successful submission
- Local search in the client
- One submission every 24 hours per browser/device
- Moderation handled manually in Supabase, outside the app UI

### Explicitly Out of Scope for V1

- In-app trash or restore controls
- In-app admin mode
- Account system or identity verification
- Approval workflow before publication
- Real-time updates
- Advanced anti-spam tooling beyond the 24-hour device limit

## User Rules

- Any visitor can read published notes.
- Any visitor can create a note.
- Visitors cannot delete, trash, restore, or moderate notes from the UI.
- The author field is free text and acts as a display signature only.
- A visitor can submit at most one note every 24 hours on the same browser/device.

## Architecture

The Notes app uses a Next.js API route as the single read/write gateway between the public client and Supabase. The browser never talks directly to Supabase for this feature.

The frontend is responsible for rendering the desktop-style Notes interface, managing local UI state, performing local search, tracking the currently selected note, and persisting a stable `client_id` in browser storage. The API route is responsible for validation, cooldown enforcement, and all database reads/writes.

## UI Design

### Window Integration

- The app lives in `components/apps/NotesApp.tsx`
- It must match the existing Portfolio OS app-window layout and dark visual language
- It should feel closer to native Apple Notes than to a generic web guestbook

### V2 Layout Direction

The redesigned Notes app follows a 3-column structure inspired by the reference UI:

- Left sidebar:
  - compact Notes navigation
  - active `Notes` section
  - subtle metadata like note count and the 24-hour posting rule
  - non-functional visual items such as recently deleted / tags for Notes-like atmosphere
- Center gallery:
  - searchable grid of note tiles
  - newest notes first
  - selected note visibly highlighted
  - empty state when there are no notes
- Right reading pane:
  - full preview of the selected note
  - polished header with title, author, and date
  - empty instructional state only when there is no selectable note

### Interaction Model

- The first available note auto-selects after notes load
- Clicking a tile updates the reading pane instead of opening a modal
- Search filters the gallery locally without changing the selected-note behavior unexpectedly
- After a successful post, the new note is inserted into the gallery and becomes the selected note immediately
- Cooldown messaging remains visible in the app when the current device cannot post again yet

### Compose Experience

- `New Note` opens a dedicated compose surface inside the app
- Compose does not replace the reading pane permanently
- Required fields:
  - `displayName`
  - `title`
  - `message`
- On success:
  - the note appears immediately in the gallery
  - the new note becomes selected in the reading pane
  - the compose surface closes
  - the UI enters cooldown mode until the 24-hour window expires
- On failure:
  - the app shows a clear inline message for validation, cooldown, or server errors

## Data Model

### Supabase Table

Recommended V1 fields:

- `id`
- `title`
- `content`
- `author_name`
- `client_id`
- `status`
- `created_at`
- `updated_at`

### Field Notes

- `author_name` stores the free-text display name entered by the visitor
- `client_id` stores the stable browser/device identifier used for cooldown enforcement
- `status` defaults to `published` to keep room for future moderation states
- `created_at` is used for sorting and cooldown checks
- `updated_at` supports future editing or moderation workflows even if unused in V1 UI

## API Behavior

### `GET /api/notes`

- Returns only notes with `status = published`
- Orders by `created_at DESC`
- Returns the minimal fields needed for the UI
- Does not expose moderation-only behavior

### `POST /api/notes`

- Accepts:
  - `displayName`
  - `title`
  - `message`
  - `clientId`
- Trims and validates all inputs
- Rejects invalid payloads with clear error responses
- Checks whether the same `client_id` has submitted a note in the last 24 hours
- Inserts a new published note when allowed
- Returns the created note plus cooldown metadata for the UI

## Cooldown Strategy

The 24-hour limit is enforced per browser/device, not per human identity. On first use, the client generates and stores a stable `client_id` locally, then sends it with each submission.

The server uses the most recent note from that `client_id` to determine whether the user is still within the cooldown window. If so, it rejects the request and returns the next allowed submission time so the UI can explain the restriction clearly.

## Validation Rules

- All fields are required after trimming
- `displayName`, `title`, and `message` must have maximum lengths to prevent abusive or layout-breaking payloads
- The API returns structured errors for:
  - invalid fields
  - active cooldown
  - unexpected persistence failures

## Frontend State

The client should manage:

- loaded notes
- loading and error state
- search query
- selected note id
- compose surface open/closed state
- compose form state
- submit status
- cooldown metadata

Search should remain fully local in V1 for responsiveness and simplicity.

## Testing Strategy

### API

- validation failures
- cooldown rejection
- successful note creation
- published notes query behavior

### UI

- first note auto-selection
- gallery tile rendering
- clicking a tile updates the reading pane
- local search filtering in the gallery
- compose success inserts and selects the new note
- cooldown messaging after submission
- empty state rendering
- error handling for failed submissions

## Future Evolution

Possible later additions, intentionally deferred from V1:

- agent-assisted moderation
- pre-publication review states
- richer anti-spam rules
- in-app private admin tooling
- trash and restore workflows surfaced in the UI
