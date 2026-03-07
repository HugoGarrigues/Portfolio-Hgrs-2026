# Portfolio Design: macOS Desktop Simulation

**Date:** 2026-03-07
**Status:** Approved

---

## Concept

A fully simulated macOS desktop environment. The visitor lands on a "desktop" — wallpaper, dock, menu bar — and discovers portfolio content by opening, dragging, and interacting with apps. No traditional scroll-based layout. The OS metaphor *is* the navigation.

Inspired by [gucduck.com](https://www.gucduck.com/).

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 App Router, TypeScript |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| 3D (wallpaper) | React Three Fiber + `@react-three/drei` |
| Fonts | `next/font` — Geist Sans + Geist Mono |
| Deployment | Vercel |
| Testing | Vitest + React Testing Library + Playwright |

---

## Information Architecture

| App | Content |
|---|---|
| **Projects.app** (Finder UI) | File browser: sidebar categories (Web, AI, OSS), project cards in main pane. Click → document window with full case study. |
| **Terminal.app** | Fake interactive terminal. Commands: `whoami`, `skills`, `stack`, `experience`. Read-only, styled output. |
| **Work.app** (Photos UI) | Visual gallery of screenshots, demos, videos. Lightbox on click. |
| **About.app** | Styled like "About This Mac" — name, bio, specs (skills summary). |
| **Contact.app** (Mail UI) | Compose window. Sends via serverless API route (Resend). Stub for now. |
| **Links.app** (Safari/Bookmarks) | Bookmark manager listing GitHub, LinkedIn, Twitter, etc. |
| **Resume.app** | PDF viewer window (iframe embed). |

---

## Window System

Each window:
- Draggable via Framer Motion `drag`, constrained to viewport
- Z-index managed globally (click brings to front)
- Traffic light buttons: Close (removes), Minimize (animates to Dock), Maximize (fills viewport)
- Resizable via corner handle (v2)

**State:** Single `WindowManager` context with `useReducer`.

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

**Mobile:** "Best viewed on desktop" overlay + simplified card-based fallback.

---

## Visual System

**Wallpaper:** R3F animated scene (gradient mesh or particle field, deep indigo → near-black). Dynamic import, SSR disabled. Falls back to CSS gradient. Runs at 30fps, pauses when windows are open.

**Window chrome:** macOS Ventura/Sonoma dark — `rgba(30,30,30,0.85)` with `backdrop-blur`.

**Palette:**
- Background: `#080808`
- Window chrome: `rgba(30,30,30,0.85)`
- Accent: `#0A84FF` (macOS system blue)
- Text primary: `#F5F5F5`
- Text secondary: `#8E8E93`

**Typography:**
- UI chrome: `-apple-system, BlinkMacSystemFont` (authentic)
- App content: Geist Sans (body) + Geist Mono (Terminal)

**Dock:** Frosted glass pill, icon magnification on hover (Framer Motion scale). Minimized windows animate in with squish effect.

**Menu Bar:** Fixed top, `backdrop-blur-xl`. Left: Apple logo + active app name. Right: live clock, cosmetic status icons.

**Boot sequence:** macOS-style login animation on first load (~2s), then desktop fade-in.

---

## Key Technical Decisions

- R3F scene wrapped in `dynamic(() => import(...), { ssr: false })`
- Each app is lazy-loaded — no upfront bundle cost
- Window state in React context + `useReducer` — no external state library
- Contact form: `app/api/contact/route.ts` stub, ready for Resend
- `next/font` for Geist to avoid layout shift
