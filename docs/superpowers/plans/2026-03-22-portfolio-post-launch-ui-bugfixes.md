# Portfolio Post-Launch UI Bugfixes Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the post-launch desktop regressions reported by users: light-mode contrast issues, maximize centering behavior, and overly long About bio copy.

**Architecture:** Keep the visual fixes local to the desktop shell and Finder app instead of doing a broad design-system rewrite. For maximize behavior, make window position a reliable piece of state so drag, maximize, and restore all use the same source of truth instead of mixing reducer state with Framer Motion's internal transform state.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS v4, Framer Motion, Vitest, Testing Library.

**Assumptions:** Update `about.bio` in every shipped locale to the short equivalent of "Developpeur Fullstack oriente Agentic Engineering", and keep this plan scoped to the desktop experience rather than the marketing pages.

---

## File Structure

### Create

- `components/apps/AboutApp.test.tsx`
- `components/apps/FinderApp.test.tsx`

### Modify

- `app/globals.css`
- `components/apps/AboutApp.tsx`
- `components/apps/FinderApp.tsx`
- `components/desktop/Desktop.tsx`
- `components/desktop/Desktop.test.tsx`
- `components/desktop/Window.tsx`
- `components/desktop/Window.test.tsx`
- `contexts/WindowManagerContext.tsx`
- `contexts/WindowManagerContext.test.tsx`
- `lib/i18n/translations/de.json`
- `lib/i18n/translations/en.json`
- `lib/i18n/translations/es.json`
- `lib/i18n/translations/fr.json`
- `lib/i18n/translations/it.json`

## Task 1: Fix Light-Mode Contrast Regressions

**Files:**
- Create: `components/apps/FinderApp.test.tsx`
- Modify: `app/globals.css`
- Modify: `components/apps/FinderApp.tsx`
- Modify: `components/desktop/Desktop.tsx`
- Modify: `components/desktop/Desktop.test.tsx`

- [ ] **Step 1: Add a failing light-mode regression test**

Cover the two reported regressions before changing styles:

- Finder application labels remain readable in light mode
- undeveloped app placeholders (`appId - coming soon`) do not use ultra-faint text in light mode

- [ ] **Step 2: Audit and replace the weakest contrast classes in `FinderApp.tsx`**

Focus on the exact spots already tuned too aggressively for dark mode:

- `AppIcon` labels in the Applications grid
- empty-state placeholders such as `finder.noItems`, `finder.noProjects`, and `finder.noRecentItems`
- any status or helper text that still relies on `text-foreground/30`, `text-black/40`, or similar low-opacity combinations on light surfaces

Prefer explicit light/dark pairs or a shared semantic token over one-off opacity values.

- [ ] **Step 3: Raise the placeholder contrast in `Desktop.tsx`**

Adjust the default undeveloped-app fallback so `Health`, `Spotify`, `Photos`, or any future unimplemented app renders readable copy in light mode without becoming too loud in dark mode.

- [ ] **Step 4: Introduce a tiny shared contrast token if repetition remains**

If the same light/dark contrast fix repeats across Finder and Desktop, add one or two CSS variables or utility classes in `app/globals.css` for muted-but-readable copy instead of copying different opacity values into each component.

- [ ] **Step 5: Run targeted UI tests**

Run:

```bash
npm run test:run -- components/apps/FinderApp.test.tsx components/desktop/Desktop.test.tsx
```

Expected: PASS

## Task 2: Recenter Windows When Maximizing

**Files:**
- Modify: `components/desktop/Desktop.tsx`
- Modify: `components/desktop/Window.tsx`
- Modify: `components/desktop/Window.test.tsx`
- Modify: `contexts/WindowManagerContext.tsx`
- Modify: `contexts/WindowManagerContext.test.tsx`

- [ ] **Step 1: Write reducer coverage for maximize and restore behavior**

Add tests showing:

- maximizing stores the current window bounds before resizing
- maximizing computes a centered position from the current viewport
- unmaximizing restores the last non-maximized bounds

- [ ] **Step 2: Stop relying on Framer Motion's internal drag position as the source of truth**

Wire `Window` drag end back into `moveWindow`, then pass that callback down from `Desktop.tsx`. This removes the current mismatch where the reducer has a `MOVE` action but the UI never persists drag results into state.

- [ ] **Step 3: Extend the maximize action payload**

Update `WindowManagerContext.tsx` so `maximizeWindow` receives the viewport dimensions needed to compute the centered maximized frame. Keep the reducer pure by passing the needed dimensions through the action rather than reading from `window` inside the reducer.

- [ ] **Step 4: Preserve restore bounds explicitly**

Add `restoreBounds` or an equivalent field to `WindowState` so a window returns to its pre-maximize position and size after the second maximize click. This avoids the current behavior where the component grows from the existing top-left anchor and only appears to expand rightward and downward.

- [ ] **Step 5: Render windows from stateful bounds**

Update `Window.tsx` so it respects the current state-driven position consistently during normal, dragged, and maximized states. Keep the visual chrome unchanged; only the geometry logic should move.

- [ ] **Step 6: Run targeted window-management tests**

Run:

```bash
npm run test:run -- contexts/WindowManagerContext.test.tsx components/desktop/Window.test.tsx components/desktop/Desktop.test.tsx
```

Expected: PASS

## Task 3: Shorten the About Bio Copy

**Files:**
- Create: `components/apps/AboutApp.test.tsx`
- Modify: `components/apps/AboutApp.tsx`
- Modify: `lib/i18n/translations/de.json`
- Modify: `lib/i18n/translations/en.json`
- Modify: `lib/i18n/translations/es.json`
- Modify: `lib/i18n/translations/fr.json`
- Modify: `lib/i18n/translations/it.json`

- [ ] **Step 1: Replace the long bio copy in every locale**

Set each `about.bio` entry to a short title-only variant matching the user's request instead of the current longer sentence about OpenClaw and Claude Code.

- [ ] **Step 2: Keep the About layout visually balanced**

Check whether the much shorter bio now leaves too much vertical dead space. If it does, make the smallest possible spacing adjustment in `AboutApp.tsx` rather than redesigning the card.

- [ ] **Step 3: Add an About app smoke test**

Add a render test that proves the short `about.bio` copy appears and the old long-form text no longer does.

- [ ] **Step 4: Run the About app test**

Run:

```bash
npm run test:run -- components/apps/AboutApp.test.tsx
```

Expected: PASS

## Task 4: Final Verification

**Files:**
- Review all files above

- [ ] **Step 1: Run the targeted regression suite**

Run:

```bash
npm run test:run -- contexts/WindowManagerContext.test.tsx components/desktop/Window.test.tsx components/desktop/Desktop.test.tsx components/apps/FinderApp.test.tsx components/apps/AboutApp.test.tsx
```

Expected: PASS

- [ ] **Step 2: Run project-level safety checks**

Run:

```bash
npm run lint
npm run build
```

Expected: PASS

- [ ] **Step 3: Smoke-test the shipped UX manually**

Verify:

- switch the app to light mode and inspect Finder labels, empty states, and undeveloped app placeholders
- drag a window away from center, then maximize it and confirm it recenters instead of only expanding to the right and bottom
- unmaximize the same window and confirm it returns to the pre-maximize bounds
- open the About app in at least French and English and confirm the short bio copy looks intentional
