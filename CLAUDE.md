# CLAUDE.md

## Commands

```bash
npm run dev           # localhost:3000
npm run build         # production build
npm run lint          # ESLint
npm run test:run      # Vitest single run
npm run test:coverage # coverage report
npx vitest run path/to/file.test.tsx
```

## Concept

**macOS desktop simulation portfolio** — no pages, no scroll. Everything opens as a draggable window. Aesthetic: **Void Terminal** (`#080808` background, cyan `#00FFF0` accents, Geist Mono).

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15 App Router |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion 12 |
| 3D Wallpaper | React Three Fiber 9 (SSR-unsafe — always `dynamic(..., { ssr: false })`) |
| State | React context + `useReducer` — no external state lib |

## Apps Status

| App | Status | Window |
|---|---|---|
| Finder | ✅ Done | 860 × 560 |
| About | ✅ Done | 520 × 340 |
| Projects | ✅ Done | 820 × 540 |
| Mail (Contact) | 🔲 Next | 600 × 440 |
| Preview (CV) | 🔲 | 680 × 860 |
| Notes | 🔲 | 360 × 420 |
| Health | 🔲 | 720 × 520 |
| Spotify | 🔲 | 560 × 480 |
| System Preferences | 🔲 | 640 × 480 |
| LinkedIn (dock, ext link) | 🔲 | — |

Desktop icons (external links): LinkedIn, Instagram, GitHub.

Full roadmap: `docs/apps-roadmap.md`

## Window Manager

`WindowManagerContext` — `useReducer` with actions: `OPEN`, `CLOSE`, `FOCUS`, `MINIMIZE`, `MAXIMIZE`, `MOVE`.

```ts
type WindowState = {
  id: string; app: AppId; zIndex: number
  position: { x: number; y: number }
  size: { width: number; height: number }
  minimized: boolean
}
```

## Visual System

- Background: `#080808` (Void Terminal)
- Accent: `#00FFF0` (cyan) + `#0A84FF` (macOS blue for interactive elements)
- Window chrome: `rgba(30,30,30,0.85)` + `backdrop-blur`
- Fonts: Geist Sans (UI) + Geist Mono (Terminal, code)
- Menu bar: liquid glass effect
- About avatar: circular

## Key Constraints

- R3F → always dynamic import with `ssr: false`
- Framer Motion `drag` for windows — constrain with `dragConstraints` on viewport ref
- Mobile → static "best viewed on desktop" overlay only
- Z-index managed by window manager via `FOCUS` dispatch

## Dev Workflow (MANDATORY)

1. `/plan` first → wait for validation → then implement
2. One app = one commit, push after each completed feature
3. `/code-review` after each implementation

## SEO

- Lighthouse 100 target
- Next.js Metadata API + JSON-LD structured data
- Core Web Vitals: LCP < 2.5s, CLS < 0.1, FID < 100ms

## Relevant Skills

Invoke with the `Skill` tool before starting tasks:
- `everything-claude-code:frontend-patterns` — React/Next.js patterns
- `everything-claude-code:coding-standards` — TS/React best practices
- `superpowers:brainstorming` — before any new feature/component
- `superpowers:writing-plans` — before multi-step tasks
- `superpowers:verification-before-completion` — before claiming done
