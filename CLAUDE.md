# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
npm run test         # Vitest in watch mode
npm run test:run     # Vitest single run
npm run test:coverage # Vitest with coverage report
```

To run a single test file:
```bash
npx vitest run path/to/file.test.tsx
```

## Architecture

This is a **macOS desktop simulation portfolio** — the entire UI is a fake OS environment. There is no traditional page layout or scroll-based navigation. Content is surfaced by opening, dragging, and interacting with simulated apps.

### Concept

- **Desktop**: canvas with animated R3F wallpaper, hosts all windows
- **Dock**: bottom launcher bar with app icons and minimized window thumbnails
- **Menu Bar**: top bar showing active app name and live clock
- **Windows**: draggable/minimizable/closeable floating panels — each contains one app's content

### App Map

| App | Content |
|---|---|
| Projects.app | Finder-style file browser — sidebar categories, project cards, case study document windows |
| Terminal.app | Fake interactive terminal — `whoami`, `skills`, `stack`, `experience` commands |
| Work.app | Photo gallery of screenshots, demos, videos with lightbox |
| About.app | "About This Mac" style — bio, skills summary |
| Contact.app | Mail compose UI — sends via `app/api/contact/route.ts` (Resend) |
| Links.app | Bookmarks manager — GitHub, LinkedIn, etc. |
| Resume.app | PDF viewer iframe |

### Window State

All window state lives in a single React context (`WindowManagerContext`) using `useReducer`. The state shape:

```ts
type WindowState = {
  id: string
  app: AppId
  zIndex: number
  position: { x: number; y: number }
  size: { width: number; height: number }
  minimized: boolean
}
```

Actions: `OPEN`, `CLOSE`, `FOCUS`, `MINIMIZE`, `MAXIMIZE`, `MOVE`.

### Directory Layout (planned)

```
app/
  layout.tsx              # Root layout — fonts, providers
  page.tsx                # Desktop root (the OS canvas)
  api/
    contact/route.ts      # Contact form endpoint (Resend)
components/
  desktop/
    Desktop.tsx           # Main canvas, renders wallpaper + windows + dock
    MenuBar.tsx
    Dock.tsx
    Window.tsx            # Draggable window shell with traffic lights
  apps/
    ProjectsApp.tsx       # Finder-style project browser
    TerminalApp.tsx       # Fake terminal with command parsing
    WorkApp.tsx           # Photo gallery
    AboutApp.tsx          # About This Mac style
    ContactApp.tsx        # Mail compose UI
    LinksApp.tsx          # Bookmarks
    ResumeApp.tsx         # PDF viewer
  wallpaper/
    WallpaperScene.tsx    # R3F scene (dynamic import, ssr: false)
contexts/
  WindowManagerContext.tsx
lib/
  apps.ts                 # App registry (id, label, icon, component)
```

### Key Constraints

- **R3F is SSR-unsafe** — always import `WallpaperScene` with `dynamic(() => import(...), { ssr: false })`
- **Framer Motion `drag`** handles window dragging — constrain with `dragConstraints` to viewport ref
- **Z-index** is managed via the window manager — clicking any window dispatches `FOCUS` to bring it to front
- **Mobile**: render a static "best viewed on desktop" overlay; do not attempt to simulate a mobile OS
- **No external state library** — React context + `useReducer` is sufficient for window management

### Visual System

- Window chrome: `rgba(30,30,30,0.85)` + `backdrop-blur`
- Accent: `#0A84FF` (macOS system blue)
- UI font: `-apple-system, BlinkMacSystemFont` (authentic macOS feel)
- Content font: Geist Sans (body) + Geist Mono (Terminal app, code)
- Wallpaper: animated R3F gradient mesh/particles, deep indigo → near-black

### Design Doc

Full approved design: `docs/plans/2026-03-07-portfolio-design.md`
