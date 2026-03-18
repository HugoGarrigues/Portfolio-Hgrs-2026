# Notes App Modern macOS Redesign Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the Notes app to feel closer to modern macOS Notes by adding a real search icon, an icon-led toolbar, a gallery/list display toggle, in-place drafting in the right pane, and a compact publish sheet at submit time.

**Architecture:** Keep the existing Notes API, Supabase persistence, cooldown logic, and note-loading model unchanged. The redesign is a frontend state and interaction refactor centered on the Notes toolbar, note browsing modes, and replacing the modal composer with an editor-in-the-detail-pane workflow. Drafting should be a local UI state that only becomes a real note after the publish sheet is completed and the existing `POST /api/notes` request succeeds.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS v4, Vitest, Testing Library, existing Notes API route and i18n system.

---

## File Structure

### Create

- `components/apps/notes/NotesDraftPane.tsx`
- `components/apps/notes/NotesPublishSheet.tsx`
- `components/apps/notes/icons.tsx`

### Modify

- `components/apps/NotesApp.tsx`
- `components/apps/NotesApp.test.tsx`
- `components/apps/notes/NotesToolbar.tsx`
- `components/apps/notes/NotesList.tsx`
- `components/apps/notes/NoteCard.tsx`
- `components/apps/notes/NotesDetailPane.tsx`
- `components/apps/notes/types.ts`
- `lib/i18n/translations/en.json`
- `lib/i18n/translations/fr.json`
- `lib/i18n/translations/de.json`
- `lib/i18n/translations/es.json`
- `lib/i18n/translations/it.json`

### Review During Implementation

- `app/api/notes/route.ts`
- `app/api/notes/route.test.ts`

These backend files should stay functionally unchanged unless the publish-sheet payload shape reveals a real mismatch.

## Task 1: Add the New UI States and Shared Types

**Files:**
- Modify: `components/apps/NotesApp.tsx`
- Modify: `components/apps/notes/types.ts`

- [ ] **Step 1: Add the failing Notes UI test for draft mode and view mode**

Extend `components/apps/NotesApp.test.tsx` with failing coverage for:

- clicking the new-note icon opens an in-place draft surface in the right pane
- the existing notes remain visible in the middle column while drafting
- clicking the view-toggle button switches between gallery and list modes

Run: `npm run test:run -- components/apps/NotesApp.test.tsx`

Expected: FAIL because the new draft and view-toggle states do not exist yet.

- [ ] **Step 2: Define the new local state shapes**

Add minimal types in `components/apps/notes/types.ts`:

```ts
export type NotesViewMode = 'gallery' | 'list'

export type DraftNote = {
  content: string
}
```

Keep the draft intentionally small. Title and display name should not be part of the draft state because they belong to the publish sheet, not the writing surface.

- [ ] **Step 3: Add the new app-level state in `NotesApp.tsx`**

Add:

- `viewMode`
- `draft`
- `publishSheetOpen`

The right pane should render either:

- selected published note
- active draft editor
- empty state

- [ ] **Step 4: Commit**

```bash
git add components/apps/NotesApp.tsx components/apps/notes/types.ts components/apps/NotesApp.test.tsx
git commit -m "test: scaffold notes redesign state model"
```

## Task 2: Redesign the Toolbar for Modern macOS Notes

**Files:**
- Modify: `components/apps/notes/NotesToolbar.tsx`
- Create: `components/apps/notes/icons.tsx`
- Modify: `components/apps/NotesApp.tsx`
- Modify: `components/apps/NotesApp.test.tsx`

- [ ] **Step 1: Write the failing toolbar interaction test**

Add a test that expects:

- a leading search icon in the search field
- an icon-first new-note button
- a view-toggle button whose icon/label changes when clicked

Prefer querying by accessible names such as:

- `Search notes`
- `Create note`
- `Switch to list view`
- `Switch to gallery view`

- [ ] **Step 2: Create focused icon components**

Create `components/apps/notes/icons.tsx` with small inline SVG components for:

- search
- compose/new note
- grid view
- list view

Keep them local to the Notes feature instead of adding a new dependency.

- [ ] **Step 3: Rebuild the toolbar**

Update `NotesToolbar.tsx` so it:

- renders a search icon inside the field before the placeholder text
- replaces the current text-heavy `New Note` button with an icon-led control
- adds a display toggle button that swaps grid/list icons and accessible labels

Suggested props:

```ts
type NotesToolbarProps = {
  query: string
  onQueryChange: (value: string) => void
  onCreateNote: () => void
  canCreate: boolean
  noteCount: number
  viewMode: NotesViewMode
  onToggleViewMode: () => void
}
```

- [ ] **Step 4: Run the Notes UI test**

Run: `npm run test:run -- components/apps/NotesApp.test.tsx`

Expected: the toolbar-specific failures now pass, with later failures still guiding the draft-flow work.

- [ ] **Step 5: Commit**

```bash
git add components/apps/notes/NotesToolbar.tsx components/apps/notes/icons.tsx components/apps/NotesApp.tsx components/apps/NotesApp.test.tsx
git commit -m "feat: redesign notes toolbar controls"
```

## Task 3: Support Gallery and List Browsing Modes

**Files:**
- Modify: `components/apps/notes/NotesList.tsx`
- Modify: `components/apps/notes/NoteCard.tsx`
- Modify: `components/apps/NotesApp.tsx`
- Modify: `components/apps/NotesApp.test.tsx`

- [ ] **Step 1: Add the failing view-mode rendering test**

Write a test that:

- starts in gallery mode
- toggles to list mode
- verifies the list renders as stacked full-width rows instead of gallery tiles

Use stable labels like:

- `Notes gallery`
- `Notes list`

- [ ] **Step 2: Add a `viewMode` prop to the note list**

Update `NotesList.tsx` to accept `viewMode` and render the correct container label/class structure for each mode.

- [ ] **Step 3: Update `NoteCard.tsx` to support two shapes**

Add a `viewMode` prop and branch only the layout classes, not the selection logic. The gallery version should keep the rounded tile style; the list version should become a vertical rectangular row with stronger text hierarchy and more horizontal spacing.

Suggested prop:

```ts
type NoteCardProps = {
  note: Note
  selected: boolean
  viewMode: NotesViewMode
  onSelect: (id: string) => void
}
```

- [ ] **Step 4: Run the Notes UI test**

Run: `npm run test:run -- components/apps/NotesApp.test.tsx`

Expected: view-mode interaction passes and any remaining failures are now centered on drafting/publishing.

- [ ] **Step 5: Commit**

```bash
git add components/apps/notes/NotesList.tsx components/apps/notes/NoteCard.tsx components/apps/NotesApp.tsx components/apps/NotesApp.test.tsx
git commit -m "feat: add notes gallery and list modes"
```

## Task 4: Replace the Modal Composer with an In-Place Draft Pane

**Files:**
- Create: `components/apps/notes/NotesDraftPane.tsx`
- Modify: `components/apps/notes/NotesDetailPane.tsx`
- Modify: `components/apps/NotesApp.tsx`
- Modify: `components/apps/NotesApp.test.tsx`

- [ ] **Step 1: Write the failing draft interaction test**

Add a test that verifies:

1. clicking the new-note button opens a blank editable draft in the right pane
2. the middle column still shows the existing notes
3. typing in the draft updates the editor without affecting selected published notes

- [ ] **Step 2: Create `NotesDraftPane.tsx`**

This component should represent a fresh note writing experience in the right pane. It should include:

- a calm editor header
- a large content-editing area
- a `Publish` action
- a `Cancel` action

The editor should only collect the note body at this stage.

- [ ] **Step 3: Update `NotesApp.tsx` to use the draft pane**

Replace the modal-composer flow with:

- `onCreateNote` => clear the current selection and open a draft state
- draft pane rendered in the right column
- cancel action => close draft and restore the previous selected note if available

Do not remove the existing publish API logic yet. Only move the writing surface from modal to pane.

- [ ] **Step 4: Run the Notes UI test**

Run: `npm run test:run -- components/apps/NotesApp.test.tsx`

Expected: draft-mode behavior passes, with publish submission still failing until the sheet is added.

- [ ] **Step 5: Commit**

```bash
git add components/apps/notes/NotesDraftPane.tsx components/apps/NotesApp.tsx components/apps/notes/NotesDetailPane.tsx components/apps/NotesApp.test.tsx
git commit -m "feat: move notes drafting into the detail pane"
```

## Task 5: Add the Compact Publish Sheet

**Files:**
- Create: `components/apps/notes/NotesPublishSheet.tsx`
- Modify: `components/apps/NotesApp.tsx`
- Modify: `components/apps/NotesApp.test.tsx`
- Review: `app/api/notes/route.ts`

- [ ] **Step 1: Write the failing publish-flow test**

Add a test that verifies:

1. the user writes content in the draft pane
2. clicking `Publish` opens a compact publish sheet
3. the sheet collects `title` and `pseudo`
4. confirming the sheet submits the existing API payload
5. the new note appears, becomes selected, and cooldown messaging still appears

- [ ] **Step 2: Create `NotesPublishSheet.tsx`**

This component should be a compact overlay/sheet anchored within the right pane, not a full modal form. It should include:

- title input
- pseudo input
- cancel button
- confirm publish button

Keep validation lightweight and let the server remain the final authority.

- [ ] **Step 3: Rewire the submit flow in `NotesApp.tsx`**

Refactor submit into two stages:

1. draft content creation
2. publish-sheet confirmation that calls the existing `POST /api/notes`

Build the payload as:

```ts
{
  message: draft.content,
  title,
  displayName,
  clientId: getNotesClientId(),
}
```

On success:

- insert the created note at the top
- select it
- clear the draft
- close the publish sheet
- update cooldown state

- [ ] **Step 4: Run the Notes UI test**

Run: `npm run test:run -- components/apps/NotesApp.test.tsx`

Expected: the end-to-end draft-to-publish flow passes.

- [ ] **Step 5: Commit**

```bash
git add components/apps/notes/NotesPublishSheet.tsx components/apps/NotesApp.tsx components/apps/NotesApp.test.tsx
git commit -m "feat: add compact publish sheet for notes drafts"
```

## Task 6: Update Copy and Accessibility Labels

**Files:**
- Modify: `lib/i18n/translations/en.json`
- Modify: `lib/i18n/translations/fr.json`
- Modify: `lib/i18n/translations/de.json`
- Modify: `lib/i18n/translations/es.json`
- Modify: `lib/i18n/translations/it.json`
- Modify: `components/apps/notes/NotesToolbar.tsx`
- Modify: `components/apps/notes/NotesDraftPane.tsx`
- Modify: `components/apps/notes/NotesPublishSheet.tsx`

- [ ] **Step 1: Add the missing translation keys**

Add keys for:

- search placeholder and search label wording that matches the icon field
- create note button label
- switch-to-gallery / switch-to-list labels
- draft pane labels
- publish sheet labels
- cancel / confirm publish copy

- [ ] **Step 2: Check accessible names**

Make sure the new icon-only controls still expose readable labels through `aria-label`, visible text, or both. The tests should rely on these labels, not brittle class names.

- [ ] **Step 3: Run the Notes UI test**

Run: `npm run test:run -- components/apps/NotesApp.test.tsx`

Expected: UI behavior and translated labels remain aligned.

- [ ] **Step 4: Commit**

```bash
git add lib/i18n/translations/en.json lib/i18n/translations/fr.json lib/i18n/translations/de.json lib/i18n/translations/es.json lib/i18n/translations/it.json components/apps/notes/NotesToolbar.tsx components/apps/notes/NotesDraftPane.tsx components/apps/notes/NotesPublishSheet.tsx components/apps/NotesApp.test.tsx
git commit -m "chore: update notes redesign copy and accessibility labels"
```

## Task 7: Verify the Full Redesign

**Files:**
- Modify as needed after verification

- [ ] **Step 1: Run targeted Notes UI coverage**

Run:

```bash
npm run test:run -- components/apps/NotesApp.test.tsx
```

Expected: PASS

- [ ] **Step 2: Run Notes API + UI coverage together**

Run:

```bash
npm run test:run -- app/api/notes/route.test.ts components/apps/NotesApp.test.tsx
```

Expected: PASS

- [ ] **Step 3: Manually verify the live interaction**

Check all of these in the running app:

- search bar shows the leading search icon
- create-note button is icon-first
- toggle button swaps between gallery and list layouts
- creating a note opens a blank editor in the right pane
- existing notes remain visible while drafting
- publish opens a compact metadata sheet
- successful publish inserts and selects the new note
- cooldown messaging still appears after posting

- [ ] **Step 4: Final commit if verification required fixes**

```bash
git add <fixed-files>
git commit -m "fix: polish notes redesign verification issues"
```
