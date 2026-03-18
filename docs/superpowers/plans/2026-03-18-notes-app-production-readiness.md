# Notes App Production Readiness Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a final Notes app overhaul that is fully functional, production-ready, visually coherent with modern macOS Notes, and aligned with the final product rules: structured sidebar sections, improved gallery cards, locale-aware dates, inline publishing inside the editor, and a stable responsive horizontal layout.

**Architecture:** Keep the current Portfolio OS Notes app as a public guestbook backed by a Next.js API route and Supabase, but refactor both the UI contract and the data model to support three note buckets: `owner`, `visitor`, and `trashed`. The final authoring flow stays entirely inside the right editor pane: drafting happens first, then title and pseudo appear inline in the editor footer when the user chooses to publish. Production hardening must cover database structure, API reliability, validation, responsive layout, i18n correctness, and release readiness.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS v4, Vitest, Testing Library, Supabase JavaScript client, Supabase SQL migrations.

---

## Product Rules Locked for This Plan

- Remove the `Bibliothèque` label from the top of the Notes sidebar.
- The left sidebar must always stay visible, including in responsive layouts.
- The layout must stay horizontal in responsive mode; no fallback to stacked vertical panes for the main Notes surfaces.
- The sidebar must expose four visible groups:
  - `Mes notes`
  - `Notes visiteurs`
  - `Supprimées récemment`
  - `Tags`
- `Mes notes` are your own notes managed through Supabase, so the schema must support a note source/type that distinguishes owner notes from visitor notes.
- Gallery cards must show content inside the card, then below the card in a vertical block:
  - pseudo
  - date
- Dates must be localized through the app locale, not hardcoded to a single formatter locale.
- In the note editor:
  - keep `Nouvelle note` centered at the top
  - add a dedicated action bar at the bottom
  - `Publier` must not open an extra modal
  - title and pseudo inputs must appear inline inside the editor when the user enters the publish step

## File Structure

### Create

- `docs/superpowers/specs/2026-03-18-notes-app-production-spec.md`
- `supabase/migrations/20260318_notes_production_readiness.sql`
- `lib/notes/date-format.ts`
- `lib/notes/errors.ts`
- `lib/notes/repository.ts`
- `lib/notes/presenter.ts`
- `lib/notes/rate-limit.ts`
- `components/apps/NotesApp.responsive.test.tsx`
- `components/apps/NotesApp.integration.test.tsx`
- `components/apps/notes/NotesEditorFooter.tsx`
- `components/apps/notes/NotesStatusBanner.tsx`
- `docs/runbooks/notes-app-production.md`

### Modify

- `components/apps/NotesApp.tsx`
- `components/apps/NotesApp.test.tsx`
- `components/apps/notes/NotesSidebar.tsx`
- `components/apps/notes/NotesToolbar.tsx`
- `components/apps/notes/NotesList.tsx`
- `components/apps/notes/NoteCard.tsx`
- `components/apps/notes/NotesDetailPane.tsx`
- `components/apps/notes/NotesDraftPane.tsx`
- `components/apps/notes/types.ts`
- `app/api/notes/route.ts`
- `app/api/notes/route.test.ts`
- `lib/notes/validation.ts`
- `lib/notes/cooldown.ts`
- `lib/notes/client-id.ts`
- `lib/supabase-server.ts`
- `lib/apps.ts`
- `contexts/WindowManagerContext.tsx`
- `package.json`
- `lib/i18n/translations/en.json`
- `lib/i18n/translations/fr.json`
- `lib/i18n/translations/de.json`
- `lib/i18n/translations/es.json`
- `lib/i18n/translations/it.json`

### Delete If Fully Superseded

- `components/apps/notes/NotesPublishSheet.tsx`
- `components/apps/notes/NotesComposer.tsx`

Only delete once the inline editor-publish flow fully replaces them.

## Task 1: Freeze the Final Product Spec

**Files:**
- Create: `docs/superpowers/specs/2026-03-18-notes-app-production-spec.md`

- [ ] **Step 1: Write the production spec**

Capture the final contract:

- note buckets: owner / visitor / trashed
- sidebar without `Bibliothèque`
- horizontal split pane even in responsive mode
- always-visible sidebar
- content-first gallery cards with metadata below
- centered `Nouvelle note` heading in the editor
- inline publish fields in the editor

- [ ] **Step 2: Document the owner-note assumption**

Define clearly that:

- visitor notes created from the public app are stored as `source = 'visitor'`
- your own notes are inserted/managed directly in Supabase as `source = 'owner'`
- recently deleted notes are identified through `status = 'trashed'`

- [ ] **Step 3: Add non-functional requirements**

Include:

- responsive usability
- locale-correct formatting
- public abuse protection
- release verification
- rollback expectations

- [ ] **Step 4: Commit**

```bash
git add docs/superpowers/specs/2026-03-18-notes-app-production-spec.md
git commit -m "docs: define final notes production spec"
```

## Task 2: Extend the Database Model for Final Product Semantics

**Files:**
- Create: `supabase/migrations/20260318_notes_production_readiness.sql`
- Create: `lib/notes/repository.ts`
- Create: `lib/notes/presenter.ts`
- Modify: `app/api/notes/route.ts`
- Modify: `app/api/notes/route.test.ts`
- Modify: `components/apps/notes/types.ts`

- [ ] **Step 1: Write failing API tests for source/status-aware behavior**

Add tests covering:

- published owner notes are returned
- published visitor notes are returned
- trashed notes are excluded from the public list
- sorting is correct
- fields needed for sidebar grouping are present

Run:

```bash
npm run test:run -- app/api/notes/route.test.ts
```

Expected: FAIL because the current schema and presenter do not distinguish owner/visitor/trashed notes.

- [ ] **Step 2: Add a production migration**

Create `supabase/migrations/20260318_notes_production_readiness.sql` with:

- `source text not null check (source in ('owner','visitor'))`
- `status text not null check (status in ('published','trashed'))`
- indexes for:
  - `status, created_at desc`
  - `source, status, created_at desc`
  - `client_id, created_at desc`
- explicit schema-qualified names

- [ ] **Step 3: Update the shared Notes types**

Extend `components/apps/notes/types.ts` to include:

```ts
export type NoteSource = 'owner' | 'visitor'
export type NoteStatus = 'published' | 'trashed'
```

and expose the source/status fields needed by the UI.

- [ ] **Step 4: Move data fetching into a repository/presenter split**

Create:

- `lib/notes/repository.ts` for raw Supabase reads/writes
- `lib/notes/presenter.ts` for mapping DB records into the exact UI/API shape

- [ ] **Step 5: Update the API route**

Ensure:

- public `GET` returns only `published` notes
- `POST` creates visitor notes with `source = 'visitor'` and `status = 'published'`

- [ ] **Step 6: Run API tests**

Run:

```bash
npm run test:run -- app/api/notes/route.test.ts
```

Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add supabase/migrations/20260318_notes_production_readiness.sql lib/notes/repository.ts lib/notes/presenter.ts components/apps/notes/types.ts app/api/notes/route.ts app/api/notes/route.test.ts
git commit -m "feat: add final notes source and status model"
```

## Task 3: Fix Date Localization End-to-End

**Files:**
- Create: `lib/notes/date-format.ts`
- Modify: `components/apps/notes/NoteCard.tsx`
- Modify: `components/apps/notes/NotesDetailPane.tsx`
- Modify: `components/apps/NotesApp.tsx`
- Modify: `components/apps/NotesApp.test.tsx`
- Modify: `lib/i18n/translations/en.json`
- Modify: `lib/i18n/translations/fr.json`
- Modify: `lib/i18n/translations/de.json`
- Modify: `lib/i18n/translations/es.json`
- Modify: `lib/i18n/translations/it.json`

- [ ] **Step 1: Write the failing UI test for localized dates**

Add coverage showing that date formatting changes with the active locale instead of staying hardcoded to `en-GB`.

Run:

```bash
npm run test:run -- components/apps/NotesApp.test.tsx
```

Expected: FAIL because the formatter is currently hardcoded in component code.

- [ ] **Step 2: Centralize date formatting**

Create `lib/notes/date-format.ts` with helpers like:

```ts
export function formatNotesCardDate(date: string, locale: string) {}
export function formatNotesDetailDate(date: string, locale: string) {}
```

- [ ] **Step 3: Pass locale-aware formatting into card and detail views**

Remove hardcoded `Intl.DateTimeFormat('en-GB', ...)` usage from the components.

- [ ] **Step 4: Run Notes UI tests**

Run:

```bash
npm run test:run -- components/apps/NotesApp.test.tsx
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/notes/date-format.ts components/apps/notes/NoteCard.tsx components/apps/notes/NotesDetailPane.tsx components/apps/NotesApp.tsx components/apps/NotesApp.test.tsx lib/i18n/translations/en.json lib/i18n/translations/fr.json lib/i18n/translations/de.json lib/i18n/translations/es.json lib/i18n/translations/it.json
git commit -m "fix: localize notes date formatting"
```

## Task 4: Rebuild the Sidebar Around Final Note Groups

**Files:**
- Modify: `components/apps/notes/NotesSidebar.tsx`
- Modify: `components/apps/NotesApp.tsx`
- Modify: `components/apps/NotesApp.test.tsx`
- Modify: `components/apps/notes/types.ts`

- [ ] **Step 1: Write the failing sidebar test**

Cover:

- no `Bibliothèque` title
- visible groups for `Mes notes`, `Notes visiteurs`, `Supprimées récemment`, and `Tags`
- counts shown next to at least the note buckets

- [ ] **Step 2: Add derived grouping data in `NotesApp.tsx`**

Compute:

- owner published notes
- visitor published notes
- trashed notes

even if the public center list still focuses on a single active filter initially.

- [ ] **Step 3: Rebuild the sidebar structure**

Replace the current generic Notes sidebar with:

- `Mes notes`
- `Notes visiteurs`
- `Supprimées récemment`
- `Tags`

Do not render the `Bibliothèque` label anymore.

- [ ] **Step 4: Keep the sidebar always visible**

Do not reintroduce `hidden`, `lg:flex`, or any responsive rule that removes the sidebar.

- [ ] **Step 5: Run Notes UI tests**

Run:

```bash
npm run test:run -- components/apps/NotesApp.test.tsx
```

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add components/apps/notes/NotesSidebar.tsx components/apps/NotesApp.tsx components/apps/NotesApp.test.tsx components/apps/notes/types.ts
git commit -m "feat: rebuild notes sidebar around final note groups"
```

## Task 5: Redesign the Gallery Cards and List Rows

**Files:**
- Modify: `components/apps/notes/NoteCard.tsx`
- Modify: `components/apps/notes/NotesList.tsx`
- Modify: `components/apps/NotesApp.test.tsx`

- [ ] **Step 1: Write the failing card-layout test**

Add coverage for:

- content preview appears inside the card
- pseudo and date appear below the card content in a vertical metadata block
- the same hierarchy remains legible in list mode

- [ ] **Step 2: Rebuild the gallery card hierarchy**

For gallery mode:

- card body contains only the note text/content preview
- below the card body, render:
  - pseudo
  - date

For list mode:

- keep a compact horizontal row
- preserve the same content-first, metadata-second logic

- [ ] **Step 3: Tune selection and spacing**

Avoid making metadata look crammed or visually merged with the card content.

- [ ] **Step 4: Run Notes UI tests**

Run:

```bash
npm run test:run -- components/apps/NotesApp.test.tsx
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/apps/notes/NoteCard.tsx components/apps/notes/NotesList.tsx components/apps/NotesApp.test.tsx
git commit -m "feat: redesign notes cards and metadata hierarchy"
```

## Task 6: Replace the Publish Modal with an Inline Editor Publish State

**Files:**
- Create: `components/apps/notes/NotesEditorFooter.tsx`
- Modify: `components/apps/notes/NotesDraftPane.tsx`
- Modify: `components/apps/NotesApp.tsx`
- Modify: `components/apps/NotesApp.test.tsx`
- Delete If Fully Replaced: `components/apps/notes/NotesPublishSheet.tsx`

- [ ] **Step 1: Write the failing draft/publish interaction test**

Cover:

1. `Nouvelle note` stays centered at the top
2. the editor has a bottom action bar
3. clicking `Publier` does not open a modal
4. title and pseudo inputs appear inline inside the editor
5. confirming publish still creates the note and shows cooldown

- [ ] **Step 2: Create a dedicated editor footer**

Add `components/apps/notes/NotesEditorFooter.tsx` for:

- action bar layout
- cancel button
- publish button
- inline metadata fields during publish step

- [ ] **Step 3: Refactor `NotesDraftPane.tsx`**

The editor should now have three zones:

- top header with centered `Nouvelle note`
- main writing area
- bottom footer/action area

- [ ] **Step 4: Remove the extra publish modal flow**

Refactor `NotesApp.tsx` so:

- `publishSheetOpen` disappears
- publish becomes an inline editor state
- title and pseudo live in the draft editor until submission

Delete `NotesPublishSheet.tsx` only once all tests pass without it.

- [ ] **Step 5: Run Notes UI tests**

Run:

```bash
npm run test:run -- components/apps/NotesApp.test.tsx
```

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add components/apps/notes/NotesEditorFooter.tsx components/apps/notes/NotesDraftPane.tsx components/apps/NotesApp.tsx components/apps/NotesApp.test.tsx
git rm components/apps/notes/NotesPublishSheet.tsx
git commit -m "feat: move notes publish flow inline into the editor"
```

## Task 7: Lock the Responsive Contract for Production

**Files:**
- Create: `components/apps/NotesApp.responsive.test.tsx`
- Modify: `components/apps/NotesApp.tsx`
- Modify: `components/apps/notes/NotesSidebar.tsx`
- Modify: `components/apps/notes/NotesDetailPane.tsx`
- Modify: `components/apps/notes/NotesDraftPane.tsx`
- Modify: `lib/apps.ts`
- Modify: `contexts/WindowManagerContext.tsx`

- [ ] **Step 1: Write the failing responsive test suite**

Cover:

- sidebar remains visible
- split pane remains horizontal
- detail pane remains visible
- editor remains visible
- default Notes window size opens only slightly larger than Finder

- [ ] **Step 2: Remove any responsive hiding of core surfaces**

Audit and remove:

- `hidden ... xl:flex`
- `flex-col xl:flex-row`
- any breakpoint logic that hides the sidebar

- [ ] **Step 3: Stabilize widths**

Set a safe width contract for:

- sidebar
- notes list
- detail/editor pane

without collapsing the app into a vertical stack.

- [ ] **Step 4: Finalize default Notes size**

Keep Notes a little larger than Finder, but still natural on first open.

- [ ] **Step 5: Run responsive and UI tests**

Run:

```bash
npm run test:run -- components/apps/NotesApp.responsive.test.tsx components/apps/NotesApp.test.tsx
```

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add components/apps/NotesApp.responsive.test.tsx components/apps/NotesApp.tsx components/apps/notes/NotesSidebar.tsx components/apps/notes/NotesDetailPane.tsx components/apps/notes/NotesDraftPane.tsx lib/apps.ts contexts/WindowManagerContext.tsx
git commit -m "fix: lock final notes responsive layout"
```

## Task 8: Harden API, Validation, and Release Confidence

**Files:**
- Create: `lib/notes/errors.ts`
- Create: `lib/notes/rate-limit.ts`
- Create: `docs/runbooks/notes-app-production.md`
- Modify: `lib/notes/validation.ts`
- Modify: `lib/notes/cooldown.ts`
- Modify: `lib/supabase-server.ts`
- Modify: `app/api/notes/route.ts`
- Modify: `app/api/notes/route.test.ts`
- Modify: `package.json`

- [ ] **Step 1: Write failing API tests for production hardening**

Cover:

- validation errors
- cooldown errors
- rate-limit errors
- stable error response shape
- DB failure handling

- [ ] **Step 2: Add typed errors and minimal server-side rate limiting**

Create:

- `lib/notes/errors.ts`
- `lib/notes/rate-limit.ts`

Keep the anti-abuse layer minimal but production-credible.

- [ ] **Step 3: Finalize server credential policy**

Review `lib/supabase-server.ts` and make the production credential strategy explicit instead of implicit.

- [ ] **Step 4: Add a production runbook**

Create `docs/runbooks/notes-app-production.md` with:

- env vars
- migration rollout
- smoke tests
- rollback
- manual moderation in Supabase

- [ ] **Step 5: Run API tests**

Run:

```bash
npm run test:run -- app/api/notes/route.test.ts
```

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add lib/notes/errors.ts lib/notes/rate-limit.ts lib/notes/validation.ts lib/notes/cooldown.ts lib/supabase-server.ts app/api/notes/route.ts app/api/notes/route.test.ts docs/runbooks/notes-app-production.md package.json
git commit -m "feat: harden notes backend for production"
```

## Task 9: Final Verification and Release Checklist

**Files:**
- Modify as needed after verification

- [ ] **Step 1: Run all Notes suites**

Run:

```bash
npm run test:run -- app/api/notes/route.test.ts components/apps/NotesApp.test.tsx components/apps/NotesApp.responsive.test.tsx components/apps/NotesApp.integration.test.tsx
```

Expected: PASS

- [ ] **Step 2: Run broader repo checks**

Run:

```bash
npm run lint
npm run test:run
```

If unrelated failures remain, record them explicitly.

- [ ] **Step 3: Manual production smoke test**

Verify:

- sidebar always visible
- panes stay horizontal
- note groups appear correctly
- owner/visitor/trashed semantics are correct
- card metadata layout matches the final design
- dates follow locale
- editor uses inline publish fields
- note creation works
- cooldown works

- [ ] **Step 4: Apply the Supabase migration**

Run the final migration and verify indexes/constraints before release.

- [ ] **Step 5: Final commit for verification fixes if needed**

```bash
git add <fixed-files>
git commit -m "fix: close remaining notes production gaps"
```
