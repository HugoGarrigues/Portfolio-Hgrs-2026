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

### 4. Mail — Contact Form
**Status:** Done
**Priority:** HIGH

| Field | Value |
|---|---|
| Window size | 600 × 440 |
| Content | macOS Mail compose UI — To (pre-filled), Subject, Body textarea, Send button |
| Interactions | Form validation, submit via `app/api/contact/route.ts` (Resend), success/error feedback |

---

### 5. Preview — CV Viewer
**Status:** Done
**Priority:** HIGH

| Field | Value |
|---|---|
| Window size | 680 × 860 |
| Content | PDF viewer (iframe) displaying my CV |
| Interactions | Scroll through pages, download button |

---

### 6. Notes — Sticky Notes
**Status:** Done
**Priority:** MEDIUM

| Field | Value |
|---|---|
| Window size | 940 × 620 |
| Content | Apple Notes-inspired editorial library and guestbook with sidebar sections, note gallery, reading pane, and publish flow. |
| Interactions | Browse owner and visitor notes, search locally, filter by tags, open a detail pane, and publish a guestbook note through the Notes API. |

---

### 7. Health — Bodybuilding Tracker
**Status:** To build
**Priority:** MEDIUM

| Field | Value |
|---|---|
| Window size | 720 × 520 |
| Content | Next planned app. Apple Health-inspired summary dashboard for bodybuilding metrics, adapted to the portfolio desktop with a profile header, sidebar, and pinned card grid. |
| Interactions | Read-only mock-data dashboard for weight trend, calories/macros, workouts, sleep, activity, and lean-bulk progress. Live agent sync is deferred to a later phase. |

---

### 8. Spotify — Music
**Status:** To build
**Priority:** MEDIUM

| Field | Value |
|---|---|
| Window size | 800 × 600 |
| Content | Displays allowed public playlists from my personal Spotify account. |
| Interactions | Browse playlists, click to listen (Spotify embed). |

---

### 9. Photos — Visual Gallery
**Status:** To build
**Priority:** MEDIUM

| Field | Value |
|---|---|
| Window size | 860 × 600 |
| Content | Masonry grid of project screenshots, UI designs, and prototypes. |
| Interactions | Click to open lightbox, scroll through visual work. |

---


### 10. Settings — System Preferences
**Status:** Done
**Priority:** LOW

| Field | Value |
|---|---|
| Window size | 640 × 480 |
| Content | Sections: General (Language, Layout), Desktop (Wallpapers), Appearance (Theme, Colors) |
| Interactions | Modify global appearance, select languages via i18n, change background images |

---

## Desktop Icons

| Icon | Target | Behavior |
|---|---|---|
| LinkedIn | linkedin.com/in/hgrs | Opens in new tab |
| Instagram | instagram.com/hgrs | Opens in new tab |
| GitHub | github.com/hgrs | Opens in new tab |

*Note: Social links (LinkedIn, GitHub, Instagram) will exclusively live on the desktop as folder/link icons, not in the main Dock.*

---

## Build Order Summary

| Priority | App | Status |
|---|---|---|
| HIGH | Finder | ✅ Done |
| HIGH | About | ✅ Done |
| HIGH | Mail | ✅ Done |
| HIGH | Preview (CV) | ✅ Done |
| HIGH | Projects (in Finder) | ✅ Done |
| MEDIUM | Notes | ✅ Done |
| MEDIUM | Health | ⏳ To build |
| MEDIUM | Spotify | ⏳ To build |
| MEDIUM | Photos | ⏳ To build |
| LOW | Settings | ✅ Done |
