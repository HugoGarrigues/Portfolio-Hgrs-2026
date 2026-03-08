# Portfolio OS — Apps Roadmap

> Priority order for building all apps in the macOS desktop simulation.

---

## Dock Apps

### 1. Finder — File Explorer
**Status:** Done
**Priority:** HIGH

| Field | Value |
|---|---|
| Window size | 780 × 480 |
| Content | Sidebar with categories (Recents, Projects, Skills, etc.), file grid/list view |
| Interactions | Click sidebar items to filter, click files to open sub-windows |

---

### 2. About — Bio & Profile
**Status:** Done
**Priority:** HIGH

| Field | Value |
|---|---|
| Window size | 520 × 340 |
| Content | Photo, name, title ("Agentic Engineer"), short bio, key skills summary |
| Interactions | Static display, links to social profiles |

---

### 3. Projects — Portfolio Projects
**Status:** To build
**Priority:** HIGH

| Field | Value |
|---|---|
| Window size | 820 × 540 |
| Content | Grid of project cards: NEXUS, FridgeScan, FormaLib, Leave App — each with screenshot, description, stack, links |
| Interactions | Click card → opens detail window (case study), links to GitHub / live demo |

---

### 4. Mail — Contact Form
**Status:** To build
**Priority:** HIGH

| Field | Value |
|---|---|
| Window size | 600 × 440 |
| Content | macOS Mail compose UI — To (pre-filled), Subject, Body textarea, Send button |
| Interactions | Form validation, submit via `app/api/contact/route.ts` (Resend), success/error feedback |

---

### 5. Preview — CV Viewer
**Status:** To build
**Priority:** HIGH

| Field | Value |
|---|---|
| Window size | 680 × 860 |
| Content | PDF viewer (iframe) displaying my CV |
| Interactions | Scroll through pages, download button |

---

### 6. Notes — Sticky Notes
**Status:** To build
**Priority:** MEDIUM

| Field | Value |
|---|---|
| Window size | 360 × 420 |
| Content | Yellow notepad-style textarea, multiple notes support |
| Interactions | Type freely, notes persist in localStorage, create/delete notes |

---

### 7. Health — Bodybuilding Tracker
**Status:** To build
**Priority:** MEDIUM

| Field | Value |
|---|---|
| Window size | 720 × 520 |
| Content | PPL split display, current PRs (bench, squat, deadlift, OHP), lean bulk stats (weight, calories, protein), weekly schedule |
| Interactions | Read-only dashboard style, animated progress rings for macros |

---

### 8. Spotify — Music
**Status:** To build
**Priority:** MEDIUM

| Field | Value |
|---|---|
| Window size | 560 × 480 |
| Content | Favorite playlists with cover art, currently playing track (embedded Spotify widget or static) |
| Interactions | Click playlist → opens Spotify embed or external link |

---

### 9. LinkedIn — External Link Launcher
**Status:** To build
**Priority:** LOW

| Field | Value |
|---|---|
| Window size | N/A (no window) |
| Content | Dock icon only — clicking opens linkedin.com/in/hgrs in new tab |
| Interactions | Direct external redirect, no window spawned |

---

### 10. System Preferences — Stack & Settings
**Status:** To build
**Priority:** LOW

| Field | Value |
|---|---|
| Window size | 640 × 480 |
| Content | Sections: Tech Stack (icons grid), Availability toggle (open to work on/off), Social links, Theme toggle |
| Interactions | Availability toggle updates a visible status badge on the desktop, social links open in new tab |

---

## Desktop Icons

| Icon | Target | Behavior |
|---|---|---|
| LinkedIn | linkedin.com/in/hgrs | Opens in new tab |
| Instagram | instagram.com/hgrs | Opens in new tab |
| GitHub | github.com/hgrs | Opens in new tab |

Desktop icons are double-clickable file icons sitting on the wallpaper, not dock items.

---

## Build Order Summary

| Priority | App |
|---|---|
| HIGH | Projects |
| HIGH | Mail |
| HIGH | Preview (CV) |
| MEDIUM | Notes |
| MEDIUM | Health |
| MEDIUM | Spotify |
| LOW | System Preferences |
| LOW | LinkedIn (dock) |
