# Global Error Notifications Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a global macOS-style error notification system for Portfolio OS and integrate it first into the Notes and Mail apps.

**Architecture:** Add a top-level notification provider with a small `pushError` API and a single notification center renderer mounted above app content. Apps keep their own domain logic, but publish user-facing errors into the global center instead of rendering ad-hoc transient alert UI locally.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS v4, Vitest, Testing Library, existing Portfolio OS app shell and i18n system.

---

## File Structure

### Create

- `components/system/notifications/NotificationCenter.tsx`
- `components/system/notifications/NotificationCard.tsx`
- `components/system/notifications/types.ts`
- `contexts/NotificationCenterContext.tsx`
- `hooks/useNotifications.ts`
- `components/system/notifications/NotificationCenter.test.tsx`

### Modify

- `app/layout.tsx`
- `components/apps/NotesApp.tsx`
- `components/apps/NotesApp.test.tsx`
- `components/apps/MailApp.tsx`
- `components/apps/MailApp.test.tsx`
- `components/apps/notes/NotesDraftPane.tsx`
- `lib/i18n/translations/en.json`
- `lib/i18n/translations/fr.json`
- `lib/i18n/translations/de.json`
- `lib/i18n/translations/es.json`
- `lib/i18n/translations/it.json`

### Review During Implementation

- `components/desktop/Desktop.tsx`
- `components/desktop/Window.tsx`

Review these only if the final mount point or z-index behavior reveals a shell-level issue.

## Task 1: Define the Notification State Model and Provider

**Files:**
- Create: `components/system/notifications/types.ts`
- Create: `contexts/NotificationCenterContext.tsx`
- Create: `hooks/useNotifications.ts`
- Create: `components/system/notifications/NotificationCenter.test.tsx`

- [ ] **Step 1: Write the failing provider test**

Add coverage for:

- pushing one error notification
- stacking two error notifications
- auto-dismiss after 5 seconds

Run:

```bash
npm run test:run -- components/system/notifications/NotificationCenter.test.tsx
```

Expected: FAIL because the notification system does not exist yet.

- [ ] **Step 2: Define shared notification types**

Create `components/system/notifications/types.ts` with focused types:

```ts
export type NotificationKind = 'error'

export type AppNotification = {
  id: string
  kind: NotificationKind
  title: string
  message: string
  source?: string
}

export type PushErrorInput = {
  title: string
  message: string
  source?: string
}
```

- [ ] **Step 3: Create the provider and context API**

Create `contexts/NotificationCenterContext.tsx` that exposes:

- `notifications`
- `pushError(input)`
- `dismissNotification(id)`

Behavior:

- ids generated in the provider
- one timer per notification
- auto-dismiss after 5000 ms

- [ ] **Step 4: Add a small app-facing hook**

Create `hooks/useNotifications.ts` that wraps the context and throws if used outside the provider.

- [ ] **Step 5: Run the notification test**

Run:

```bash
npm run test:run -- components/system/notifications/NotificationCenter.test.tsx
```

Expected: FAIL may narrow to rendering because the visual components do not exist yet; the provider/state behavior should now compile.

- [ ] **Step 6: Commit**

```bash
git add components/system/notifications/types.ts contexts/NotificationCenterContext.tsx hooks/useNotifications.ts components/system/notifications/NotificationCenter.test.tsx
git commit -m "feat: scaffold global notification state"
```

## Task 2: Build the Notification Center UI

**Files:**
- Create: `components/system/notifications/NotificationCenter.tsx`
- Create: `components/system/notifications/NotificationCard.tsx`
- Modify: `components/system/notifications/NotificationCenter.test.tsx`

- [ ] **Step 1: Extend the failing UI test**

Add assertions for:

- top-right positioning container
- fixed card footprint
- stacked layout spacing
- source label rendering

Run:

```bash
npm run test:run -- components/system/notifications/NotificationCenter.test.tsx
```

Expected: FAIL because the renderer does not exist yet.

- [ ] **Step 2: Create `NotificationCard.tsx`**

Render:

- title
- message
- optional `source`

Use a single visual variant for `error` in V1:

- rounded macOS-style surface
- soft border
- subtle translucent background
- compact typography hierarchy

- [ ] **Step 3: Create `NotificationCenter.tsx`**

Render a fixed top-right stack:

- `pointer-events-none` container
- internal stack with stable spacing
- each card wrapped in `pointer-events-auto`
- live region semantics appropriate for errors

- [ ] **Step 4: Run the notification UI test**

Run:

```bash
npm run test:run -- components/system/notifications/NotificationCenter.test.tsx
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/system/notifications/NotificationCenter.tsx components/system/notifications/NotificationCard.tsx components/system/notifications/NotificationCenter.test.tsx
git commit -m "feat: add global notification center ui"
```

## Task 3: Mount the Global Notification Layer

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Write the failing integration smoke test if a suitable root test exists**

If there is a stable root render test, add one that confirms the notification provider is mounted globally. If not, skip adding a dedicated test and rely on the feature tests below.

- [ ] **Step 2: Mount the provider at the app root**

Wrap the application with `NotificationCenterProvider` in `app/layout.tsx` and render `NotificationCenter` once at the root so every app can publish notifications.

- [ ] **Step 3: Verify no immediate regressions**

Run:

```bash
npm run test:run -- components/system/notifications/NotificationCenter.test.tsx
```

Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: mount global notification provider"
```

## Task 4: Integrate Notes with Global Error Notifications

**Files:**
- Modify: `components/apps/NotesApp.tsx`
- Modify: `components/apps/NotesApp.test.tsx`
- Modify: `components/apps/notes/NotesDraftPane.tsx`

- [ ] **Step 1: Write the failing Notes integration test**

Add or update coverage showing:

- cooldown-triggered publish attempt produces a global notification
- notification appears only after a real publish attempt
- notification auto-dismisses after 5 seconds
- Notes no longer depends on its local transient alert UI for these error cases

Run:

```bash
npm run test:run -- components/apps/NotesApp.test.tsx
```

Expected: FAIL because Notes still uses local alert rendering.

- [ ] **Step 2: Replace Notes local transient error notification logic**

In `components/apps/NotesApp.tsx`:

- inject `useNotifications()`
- publish global errors for:
  - known cooldown rejection
  - failed note creation
  - actionable publish failures

Keep local state only for structural editor behavior, not macOS-style transient errors.

- [ ] **Step 3: Remove obsolete Notes inline alert UI**

Update `components/apps/notes/NotesDraftPane.tsx` so it no longer acts as the primary notification surface for transient global errors.

- [ ] **Step 4: Run Notes tests**

Run:

```bash
npm run test:run -- components/apps/NotesApp.test.tsx components/system/notifications/NotificationCenter.test.tsx
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/apps/NotesApp.tsx components/apps/NotesApp.test.tsx components/apps/notes/NotesDraftPane.tsx
git commit -m "feat: route notes errors through global notifications"
```

## Task 5: Integrate Mail with Global Error Notifications

**Files:**
- Modify: `components/apps/MailApp.tsx`
- Modify: `components/apps/MailApp.test.tsx`

- [ ] **Step 1: Write the failing Mail integration test**

Cover:

- server/send error publishes a global notification
- notification content uses the correct title and message
- field validation remains local if it is form-structural rather than global

Run:

```bash
npm run test:run -- components/apps/MailApp.test.tsx
```

Expected: FAIL because Mail still handles errors locally or inconsistently.

- [ ] **Step 2: Publish Mail send failures into the notification center**

In `components/apps/MailApp.tsx`:

- wire the send-error path into `pushError`
- keep form state intact after failure
- avoid duplicate local transient error UI if the notification now covers it

- [ ] **Step 3: Run Mail tests**

Run:

```bash
npm run test:run -- components/apps/MailApp.test.tsx components/system/notifications/NotificationCenter.test.tsx
```

Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add components/apps/MailApp.tsx components/apps/MailApp.test.tsx
git commit -m "feat: route mail errors through global notifications"
```

## Task 6: Add Copy and Final Verification

**Files:**
- Modify: `lib/i18n/translations/en.json`
- Modify: `lib/i18n/translations/fr.json`
- Modify: `lib/i18n/translations/de.json`
- Modify: `lib/i18n/translations/es.json`
- Modify: `lib/i18n/translations/it.json`

- [ ] **Step 1: Add stable notification copy keys**

Define keys for reusable titles/messages where appropriate, especially for:

- generic send failure
- generic publish failure
- cooldown alert title

- [ ] **Step 2: Run focused verification**

Run:

```bash
npm run test:run -- components/system/notifications/NotificationCenter.test.tsx components/apps/NotesApp.test.tsx components/apps/MailApp.test.tsx app/api/notes/route.test.ts
```

Expected: PASS

- [ ] **Step 3: Run a broader smoke check**

Run:

```bash
npm run test:run
```

Expected: either PASS, or document any pre-existing unrelated failures before merge.

- [ ] **Step 4: Commit**

```bash
git add lib/i18n/translations/en.json lib/i18n/translations/fr.json lib/i18n/translations/de.json lib/i18n/translations/es.json lib/i18n/translations/it.json
git commit -m "chore: finalize global error notification copy"
```

## Task 7: Final Cleanup and Handoff

**Files:**
- Review all notification-related files above

- [ ] **Step 1: Review Notes and Mail for duplicate transient error UI**

Confirm there is no lingering ad-hoc notification behavior that conflicts with the global system.

- [ ] **Step 2: Verify notification visuals inside the shell**

Manually check:

- top-right positioning
- stack spacing
- shape consistency
- behavior over Notes and Mail windows

- [ ] **Step 3: Prepare handoff**

Capture:

- files added
- files changed
- tests run
- any remaining global test debt outside this feature

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add global macos-style error notifications"
```
