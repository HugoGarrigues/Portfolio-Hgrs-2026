# Notes App Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the Notes guestbook into a closer macOS Notes-style experience with a 3-column layout, searchable note gallery, dedicated reading pane, separate compose surface, Supabase persistence through a Next.js API route, and a 24-hour submission limit per browser/device.

**Architecture:** The Notes UI lives in a dedicated desktop app component and talks only to `/api/notes`. The API route validates requests, enforces the cooldown with a browser-stored `client_id`, and reads/writes published notes in Supabase. Moderation stays out of the app and is handled directly in Supabase.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS v4, Vitest, Testing Library, Supabase JavaScript client.

---

## File Structure

### Create

- `components/apps/notes/NotesDetailPane.tsx`

### Modify

- `components/apps/NotesApp.tsx`
- `components/apps/NotesApp.test.tsx`
- `components/apps/notes/NotesSidebar.tsx`
- `components/apps/notes/NotesToolbar.tsx`
- `components/apps/notes/NotesList.tsx`
- `components/apps/notes/NoteCard.tsx`
- `components/apps/notes/NotesComposer.tsx`
- `lib/i18n/translations/en.json`
- `lib/i18n/translations/fr.json`
- `lib/i18n/translations/de.json`
- `lib/i18n/translations/es.json`
- `lib/i18n/translations/it.json`
- `docs/notes-app-plan.md`
- `docs/superpowers/specs/2026-03-17-notes-app-design.md`

## Task 1: Reframe the Layout Around Apple Notes

**Files:**
- Modify: `components/apps/NotesApp.tsx`
- Modify: `components/apps/notes/NotesSidebar.tsx`
- Modify: `components/apps/notes/NotesToolbar.tsx`
- Create: `components/apps/notes/NotesDetailPane.tsx`

- [ ] **Step 1: Build a true 3-column shell**

Refactor the app layout into:

- compact left sidebar
- center gallery column
- right reading pane

Expected: the app feels structurally closer to Apple Notes than to a generic two-panel guestbook.

- [ ] **Step 2: Slim down the sidebar**

Adjust the sidebar to feel denser and more native, including:

- active `Notes` item
- note count context
- recently deleted / tags atmosphere
- subtle posting-rule text

Expected: the left rail looks intentional and no longer feels oversized or empty.

- [ ] **Step 3: Refresh the toolbar**

Update the toolbar styling to feel calmer and more Notes-like:

- compact title and count
- quieter rounded search field
- restrained control buttons

Expected: the top chrome reads more like desktop software and less like a web dashboard.

## Task 2: Turn the Notes List into a Gallery

**Files:**
- Modify: `components/apps/notes/NotesList.tsx`
- Modify: `components/apps/notes/NoteCard.tsx`
- Modify: `components/apps/NotesApp.tsx`

- [ ] **Step 1: Replace row/list behavior with tile selection**

Make note cards selectable buttons that clearly communicate the active note.

Expected: clicking a tile selects it for the reading pane instead of opening a separate modal flow.

- [ ] **Step 2: Style the center column as a gallery**

Render notes as evenly spaced rounded tiles with:

- title
- short content preview
- date
- selected state emphasis

Expected: the center column matches the gallery feel of the approved reference.

- [ ] **Step 3: Keep search local and responsive**

Filter gallery tiles locally and use a deferred query if needed so the UI stays fluid.

Expected: search feels immediate without affecting the API contract.

## Task 3: Add a Dedicated Reading Pane

**Files:**
- Create: `components/apps/notes/NotesDetailPane.tsx`
- Modify: `components/apps/NotesApp.tsx`

- [ ] **Step 1: Track the selected note**

Add selected-note state to the app and auto-select the first available note after loading.

Expected: the right pane has meaningful content immediately when notes exist.

- [ ] **Step 2: Render a polished note preview**

The reading pane should show:

- title
- author name
- formatted date
- full note body

Expected: the selected note feels editorial and readable, not like an expanded card.

- [ ] **Step 3: Handle no-selection and no-notes states**

Provide a calm empty state when there is no note to preview.

Expected: the right pane still feels designed even when content is absent.

## Task 4: Keep Compose Focused but Separate

**Files:**
- Modify: `components/apps/notes/NotesComposer.tsx`
- Modify: `components/apps/NotesApp.tsx`

- [ ] **Step 1: Refine the compose surface**

Restyle the composer so it feels consistent with the redesigned Notes UI without replacing the reading pane architecture.

- [ ] **Step 2: Select newly created notes immediately**

After a successful submission:

- insert the new note into state
- select it in the reading pane
- close the composer
- preserve cooldown messaging

Expected: writing a note feels integrated into the gallery/preview flow.

## Task 5: Update Copy and Tests

**Files:**
- Modify: `components/apps/NotesApp.test.tsx`
- Modify: `lib/i18n/translations/en.json`
- Modify: `lib/i18n/translations/fr.json`
- Modify: `lib/i18n/translations/de.json`
- Modify: `lib/i18n/translations/es.json`
- Modify: `lib/i18n/translations/it.json`

- [ ] **Step 1: Add translation keys for the redesigned UI**

Add strings for:

- sidebar labels
- note count label
- gallery heading
- reading-pane empty state
- detail metadata label
- updated compose subtitle

- [ ] **Step 2: Rewrite the Notes UI tests around the new behavior**

Cover at minimum:

- first note auto-selects
- clicking a tile updates the reading pane
- gallery search filters locally
- composing a note inserts and selects it
- empty state still renders correctly

Expected: the tests protect the new interaction model rather than the old layout.

## Task 6: Verify the Redesign

**Files:**
- Modify as needed after verification

- [ ] **Step 1: Run targeted Notes tests**

Run:

```bash
npm run test:run -- components/apps/NotesApp.test.tsx
```

Expected: all redesigned Notes UI tests pass.

- [ ] **Step 2: Run the broader relevant test set**

Run:

```bash
npm run test:run -- app/api/notes/route.test.ts components/apps/NotesApp.test.tsx
```

Expected: Notes API and Notes UI coverage both pass together.

- [ ] **Step 3: Sanity-check the live app manually**

Verify:

- first note auto-selects
- search only filters the gallery
- clicking a tile swaps the reading pane
- posting a new note selects it immediately
- cooldown state remains visible after publishing

Expected: the redesign feels stable and coherent in the running app.
