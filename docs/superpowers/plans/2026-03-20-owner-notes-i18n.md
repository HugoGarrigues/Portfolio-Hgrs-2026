# Owner Notes I18n Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add multilingual support for owner-authored notes only, while keeping visitor notes and the public guestbook write flow unchanged.

**Architecture:** Keep `notes` as the canonical content record, then add a dedicated translation layer for owner notes. The Notes app should request the active locale and resolve a translated owner-note body when available, while visitor notes continue to render their original content unchanged.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Supabase SQL migrations, Supabase JavaScript client, Vitest, Testing Library.

---

## File Structure

### Create

- `supabase/migrations/20260320_owner_note_translations.sql`
- `lib/notes/translations.ts`

### Modify

- `app/api/notes/route.ts`
- `app/api/notes/route.test.ts`
- `lib/notes/repository.ts`
- `lib/notes/presenter.ts`
- `components/apps/notes/types.ts`
- `components/apps/NotesApp.tsx`
- `components/apps/NotesApp.test.tsx`
- `docs/runbooks/notes-editorial-library.md`

## Task 1: Add the Translation Data Model

**Files:**
- Create: `supabase/migrations/20260320_owner_note_translations.sql`
- Modify: `components/apps/notes/types.ts`

- [ ] **Step 1: Write the failing API test**

Add coverage showing that an owner note can return translated content for a requested locale.

- [ ] **Step 2: Add the migration**

Create `owner_note_translations` with fields such as:

- `id`
- `note_id`
- `locale`
- `title`
- `content`

Add a unique constraint on `(note_id, locale)`.

- [ ] **Step 3: Extend the shared note type**

Add the translation-aware fields needed by the presenter and API response.

## Task 2: Resolve Owner Note Translations in the API

**Files:**
- Modify: `lib/notes/repository.ts`
- Modify: `lib/notes/presenter.ts`
- Modify: `app/api/notes/route.ts`
- Modify: `app/api/notes/route.test.ts`

- [ ] **Step 1: Parse locale in GET**

Add a `locale` query param to the Notes read route.

- [ ] **Step 2: Fetch owner-note translations**

Teach the repository to fetch translations alongside owner notes.

- [ ] **Step 3: Apply fallback rules**

Use this behavior:

- if owner note has a translation for the active locale, use it
- otherwise fall back to the base note content
- visitor notes always use their original content

- [ ] **Step 4: Run API tests**

Run:

```bash
npm run test:run -- app/api/notes/route.test.ts
```

Expected: PASS

## Task 3: Pass Locale-Aware Reads Through the Notes App

**Files:**
- Modify: `components/apps/NotesApp.tsx`
- Modify: `components/apps/NotesApp.test.tsx`

- [ ] **Step 1: Include locale in the Notes fetch request**

Send the active app locale when reading Notes.

- [ ] **Step 2: Verify owner notes switch language**

Add a UI test showing owner notes change when the locale changes and a translation exists.

- [ ] **Step 3: Keep visitor notes unchanged**

Add a test or assertion showing visitor notes are not translated by the app layer.

## Task 4: Update the Runbook

**Files:**
- Modify: `docs/runbooks/notes-editorial-library.md`

- [ ] **Step 1: Document how to insert translations**

Add SQL examples for:

- adding a French translation
- adding an English translation
- updating an existing translation

- [ ] **Step 2: Document fallback behavior**

Explain clearly what happens when a locale-specific translation is missing.

## Task 5: Final Verification

**Files:**
- Review all files above

- [ ] **Step 1: Run targeted verification**

Run:

```bash
npm run test:run -- app/api/notes/route.test.ts components/apps/NotesApp.test.tsx
```

Expected: PASS

- [ ] **Step 2: Smoke-test manually**

Verify:

- owner notes switch language with locale
- visitor notes remain unchanged
- tags and sections still work
