# Notes Editorial Library Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finalize the Notes app as a production-ready editorial library by adding real owner content, operational database-backed tags, and fully populated `Mes notes` / `Notes visiteurs` / `Supprimées récemment` sections.

**Architecture:** Keep the current Notes app shell, API route, and Supabase-backed guestbook flow, but extend the data model with relational tags and section-aware querying. Owner notes remain managed directly in Supabase, while the app consumes a richer read model that supports section filters, tag filters, and trashed notes without changing the public write contract.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS v4, Vitest, Testing Library, Supabase JavaScript client, Supabase SQL migrations.

---

## File Structure

### Create

- `supabase/migrations/20260320_notes_editorial_library.sql`
- `lib/notes/seed-data.ts`
- `docs/runbooks/notes-editorial-library.md`

### Modify

- `app/api/notes/route.ts`
- `app/api/notes/route.test.ts`
- `components/apps/NotesApp.tsx`
- `components/apps/NotesApp.test.tsx`
- `components/apps/notes/NotesSidebar.tsx`
- `components/apps/notes/NotesList.tsx`
- `components/apps/notes/NoteCard.tsx`
- `components/apps/notes/NotesDetailPane.tsx`
- `components/apps/notes/types.ts`
- `lib/notes/repository.ts`
- `lib/notes/presenter.ts`
- `lib/notes/validation.ts`
- `lib/i18n/translations/en.json`
- `lib/i18n/translations/fr.json`
- `lib/i18n/translations/de.json`
- `lib/i18n/translations/es.json`
- `lib/i18n/translations/it.json`

## Task 1: Add Relational Tags to the Notes Data Model

**Files:**
- Create: `supabase/migrations/20260320_notes_editorial_library.sql`
- Modify: `components/apps/notes/types.ts`
- Modify: `lib/notes/repository.ts`
- Modify: `lib/notes/presenter.ts`

- [ ] **Step 1: Write the failing repository/API test for tags**

Add coverage showing that notes can expose tags and that tags are read through a relational model.

Run:

```bash
npm run test:run -- app/api/notes/route.test.ts
```

Expected: FAIL because tags are not yet represented in the read model.

- [ ] **Step 2: Add the migration for tags**

Create `supabase/migrations/20260320_notes_editorial_library.sql` with:

- `tags` table
- `note_tags` join table
- unique slug or name constraint for tags
- foreign keys back to `notes`
- indexes for note/tag filtering

- [ ] **Step 3: Extend the shared Notes types**

Update `components/apps/notes/types.ts` so note records can carry:

- `tags`
- source/status fields already used by the UI

- [ ] **Step 4: Update repository and presenter**

Teach the Notes data layer to:

- fetch note-tag relationships
- flatten them into a UI-friendly note shape

- [ ] **Step 5: Re-run the API test**

Run:

```bash
npm run test:run -- app/api/notes/route.test.ts
```

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add supabase/migrations/20260320_notes_editorial_library.sql components/apps/notes/types.ts lib/notes/repository.ts lib/notes/presenter.ts app/api/notes/route.test.ts
git commit -m "feat: add relational notes tags model"
```

## Task 2: Make the Notes API Section- and Tag-Aware

**Files:**
- Modify: `app/api/notes/route.ts`
- Modify: `app/api/notes/route.test.ts`
- Modify: `lib/notes/validation.ts`

- [ ] **Step 1: Write the failing API test for filters**

Add coverage for:

- `owner` notes returned in `Mes notes`
- `visitor` notes returned in `Notes visiteurs`
- `trashed` notes returned in `Supprimées récemment`
- tag filtering applied to the selected section

Run:

```bash
npm run test:run -- app/api/notes/route.test.ts
```

Expected: FAIL because the route does not yet support section/tag-aware reads.

- [ ] **Step 2: Extend GET query parsing**

Update `app/api/notes/route.ts` to accept a minimal read contract such as:

- `section=owner|visitor|trashed`
- `tag=<slug>`

- [ ] **Step 3: Update the read query logic**

Make the API:

- return only `published` notes for owner/visitor sections
- return `trashed` notes for the trashed section
- apply tag filters through the relation layer

- [ ] **Step 4: Preserve the public write contract**

Keep public `POST` behavior unchanged:

- creates `visitor` notes only
- cooldown remains enforced

- [ ] **Step 5: Re-run the API suite**

Run:

```bash
npm run test:run -- app/api/notes/route.test.ts
```

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add app/api/notes/route.ts app/api/notes/route.test.ts lib/notes/validation.ts
git commit -m "feat: add notes section and tag filters"
```

## Task 3: Make Tags Operational in the Notes UI

**Files:**
- Modify: `components/apps/NotesApp.tsx`
- Modify: `components/apps/NotesApp.test.tsx`
- Modify: `components/apps/notes/NotesSidebar.tsx`

- [ ] **Step 1: Write the failing UI test for tag filtering**

Add coverage showing:

- tags render from data
- clicking a tag filters visible notes
- changing section preserves or clears the filter correctly

Run:

```bash
npm run test:run -- components/apps/NotesApp.test.tsx
```

Expected: FAIL because tags are currently decorative only.

- [ ] **Step 2: Add active tag state to NotesApp**

Track:

- current section
- current tag slug or `null`

- [ ] **Step 3: Make the sidebar tags clickable**

Update `NotesSidebar.tsx` so the tags section:

- renders active state
- emits selected tag changes
- can clear the active tag when appropriate

- [ ] **Step 4: Filter note results through the selected tag**

Apply the filter to the Notes list rendering flow.

- [ ] **Step 5: Re-run the Notes UI tests**

Run:

```bash
npm run test:run -- components/apps/NotesApp.test.tsx
```

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add components/apps/NotesApp.tsx components/apps/NotesApp.test.tsx components/apps/notes/NotesSidebar.tsx
git commit -m "feat: make notes tags operational"
```

## Task 4: Populate `Mes notes` with Real Editorial Content

**Files:**
- Create: `lib/notes/seed-data.ts`
- Create: `docs/runbooks/notes-editorial-library.md`
- Modify: `components/apps/notes/NoteCard.tsx`
- Modify: `components/apps/notes/NotesDetailPane.tsx`

- [ ] **Step 1: Define the initial owner-note content set**

Create a seed/reference module in `lib/notes/seed-data.ts` containing the initial owner-note payloads and their tags.

Include themes such as:

- about
- experience
- projects
- skills
- vision

- [ ] **Step 2: Tune note presentation for editorial reading**

Adjust card/detail metadata display if needed so owner notes read naturally for recruiters.

- [ ] **Step 3: Write the content maintenance runbook**

Create `docs/runbooks/notes-editorial-library.md` describing:

- how to insert owner notes
- how to assign tags
- how to trash/restore notes
- how to keep the library updated

- [ ] **Step 4: Verify the seeded content plan is usable**

Check that the content set is coherent, non-duplicative, and mapped to the intended tags.

- [ ] **Step 5: Commit**

```bash
git add lib/notes/seed-data.ts docs/runbooks/notes-editorial-library.md components/apps/notes/NoteCard.tsx components/apps/notes/NotesDetailPane.tsx
git commit -m "docs: define owner notes editorial content"
```

## Task 5: Finish Section Semantics in the UI

**Files:**
- Modify: `components/apps/NotesApp.tsx`
- Modify: `components/apps/NotesApp.test.tsx`
- Modify: `components/apps/notes/NotesList.tsx`

- [ ] **Step 1: Write the failing UI test for section buckets**

Add coverage showing:

- `Mes notes` shows owner notes
- `Notes visiteurs` shows visitor notes
- `Supprimées récemment` shows trashed notes

Run:

```bash
npm run test:run -- components/apps/NotesApp.test.tsx
```

Expected: FAIL if the current UI still relies on incomplete mock semantics.

- [ ] **Step 2: Align the client fetch contract with section-aware API reads**

Update NotesApp so section changes fetch or resolve the correct dataset contract.

- [ ] **Step 3: Preserve navigation and selection behavior**

Ensure:

- selection still works
- history buttons still work
- opening a note from a filtered view behaves predictably

- [ ] **Step 4: Re-run the Notes UI tests**

Run:

```bash
npm run test:run -- components/apps/NotesApp.test.tsx
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/apps/NotesApp.tsx components/apps/NotesApp.test.tsx components/apps/notes/NotesList.tsx
git commit -m "feat: finalize notes section buckets"
```

## Task 6: Update Copy and Ship Readiness

**Files:**
- Modify: `lib/i18n/translations/en.json`
- Modify: `lib/i18n/translations/fr.json`
- Modify: `lib/i18n/translations/de.json`
- Modify: `lib/i18n/translations/es.json`
- Modify: `lib/i18n/translations/it.json`
- Modify: `components/apps/NotesApp.test.tsx`

- [ ] **Step 1: Add any remaining strings for tags and editorial empty states**

Cover:

- tag labels
- no-results states
- owner-library wording if needed

- [ ] **Step 2: Add or update UI tests for empty/filter states**

Cover:

- empty tag result
- empty trashed bucket
- owner notes section with active tag

- [ ] **Step 3: Run the targeted Notes verification**

Run:

```bash
npm run test:run -- app/api/notes/route.test.ts components/apps/NotesApp.test.tsx
```

Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add lib/i18n/translations/en.json lib/i18n/translations/fr.json lib/i18n/translations/de.json lib/i18n/translations/es.json lib/i18n/translations/it.json components/apps/NotesApp.test.tsx
git commit -m "test: verify notes editorial library readiness"
```

## Task 7: Production Handoff

**Files:**
- Review: `docs/runbooks/notes-editorial-library.md`
- Review: `supabase/migrations/20260320_notes_editorial_library.sql`

- [ ] **Step 1: Apply the Supabase migration**

Run the SQL migration in Supabase and verify that:

- `tags` exists
- `note_tags` exists
- indexes are present

- [ ] **Step 2: Insert the initial owner notes**

Populate your editorial notes and attach their tags.

- [ ] **Step 3: Smoke-test the live app**

Verify:

- owner notes appear under `Mes notes`
- visitor notes still publish correctly
- trashed notes appear only in `Supprimées récemment`
- tag filters work end to end

- [ ] **Step 4: Final verification**

Run:

```bash
npm run test:run -- app/api/notes/route.test.ts components/apps/NotesApp.test.tsx
```

Expected: PASS
