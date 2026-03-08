# Portfolio OS — Design System

> Single source of truth extracted from `FinderApp.tsx` + `Window.tsx`.
> Every future app **must** read this file first and follow it exactly.
> Do not invent colors, spacing, or patterns not listed here.

---

## 1. Color Palette

### Window Chrome (Window.tsx)

| Token | Value | Usage |
|---|---|---|
| Window background | `#161616` | `backgroundColor` inline style on `motion.div` |
| Shadow | `shadow-2xl shadow-black/60` | Window drop shadow |

### Traffic Lights (Window.tsx)

| Button | Resting color | Hover color |
|---|---|---|
| Close | `bg-[#FF5F56]` | `hover:bg-[#FF5F56]/80` |
| Minimize | `bg-[#FFBD2E]` | `hover:bg-[#FFBD2E]/80` |
| Maximize | `bg-[#27C93F]` | `hover:bg-[#27C93F]/80` |
| Disabled state | `bg-white/10` | no hover |

Traffic light icon color: `text-black/40`
Icon opacity: `opacity-0` → `group-hover/traffic:opacity-100`

### App Interior (FinderApp.tsx)

| Token | Value | Usage |
|---|---|---|
| App background | `bg-[#161616]` | Outermost `div` fill |
| Sidebar fill | `bg-white/[0.04]` | Floating sidebar panel |
| Sidebar border | `border border-white/[0.05]` | Sidebar edge |
| Main island fill | `bg-white/[0.02]` | Right content column |
| Main island border | `border border-white/[0.03]` | Right content column edge |
| Toolbar divider | `border-b border-white/[0.03]` | Below toolbar nav |
| Row divider | `border-b border-white/[0.025]` | Between list rows (ProjectsApp) |
| Column header divider | `border-b border-white/[0.04]` | Below column headers (ProjectsApp) |

### Text Colors

| Token | Value | Usage |
|---|---|---|
| Primary text | `text-white/95` | Section title in toolbar |
| Body text | `text-white/90` | App icon labels (unselected) |
| Secondary text | `text-white/60` | Sidebar nav item (unselected) |
| Tertiary text | `text-white/38` | Metadata, year, stack tags |
| Quaternary text | `text-white/25` | Column headers, section labels |
| Muted text | `text-white/20` | Sidebar section titles (`FAVORIS`) |
| Ghost text | `text-white/10` | "Aucun élément" empty state |
| Accent blue | `text-blue-400` | Sidebar icon active state |
| Accent blue (icon) | `text-blue-400/60` | File icon in list rows |

### Selection & Interaction

| Token | Value | Usage |
|---|---|---|
| Sidebar item active bg | `bg-white/10` | Selected nav button |
| Sidebar item hover bg | `bg-white/5` | Hovered nav button |
| App icon selected bg | `bg-blue-600` | Label behind selected icon |
| App icon selected label | `text-white` | Label text when selected |
| App icon hover bg | `bg-white/10` | Label on hover (unselected) |
| List row selected bg | `bg-blue-600/20` | Selected project row |
| List row hover bg | `hover:bg-white/[0.03]` | Hovered list row |
| Toolbar button bg | `bg-white/[0.05]` | Back/forward nav buttons |
| Toolbar button border | `border border-white/[0.05]` | Back/forward nav buttons |
| Toolbar button hover | `hover:bg-white/[0.12]` | Back/forward buttons |
| Toolbar button active | `active:bg-white/[0.2]` | Back/forward buttons (pressed) |
| Toolbar button disabled | `opacity-10` | Disabled back/forward |

---

## 2. Typography

| Element | Size | Weight | Class |
|---|---|---|---|
| Sidebar section title | `10px` | bold | `text-[10px] font-bold uppercase tracking-widest` |
| Sidebar nav item | `13px` | normal / semibold when active | `text-[13px]` / `font-semibold` |
| Toolbar section title | `13px` | bold | `text-[13px] font-bold tracking-tight` |
| App icon label | `11px` | medium | `text-[11px] font-medium` |
| Column headers | `11px` | semibold | `text-[11px] font-semibold uppercase tracking-widest` |
| Row primary name | `13px` | medium | `text-[13px] font-medium` |
| Row tagline | `10px` | normal | `text-[10px]` |
| Stack badge | `10px` | normal | `text-[10px]` |
| Year | `12px` | normal | `text-[12px]` |
| Status badge | `10px` | semibold | `text-[10px] font-semibold` |
| Empty state | `13px` | medium | `text-[13px] font-medium tracking-tight uppercase` |
| Font family | system | — | `font-sans` on root div |

---

## 3. Spacing & Sizing

### Window outer padding

```
p-2   (8px all sides) — outermost FinderApp div
gap-2 (8px) — between sidebar and main island
```

### Sidebar

```
width:        w-[190px]   (190px, shrink-0)
padding-top:  pt-10       (40px) — clears traffic lights
padding-bot:  pb-3        (12px)
overflow:     overflow-y-auto
border-radius: rounded-2xl
```

### Sidebar nav buttons

```
width:   w-[calc(100%-16px)]  (8px margin each side)
margin:  mx-2
padding: px-3 py-1.5
gap:     gap-3 (icon → label)
border-radius: rounded-lg
icon size: w-4 h-4
```

### Sidebar section titles

```
padding-x: px-5
margin-bottom: mb-2
group spacing: mb-4 per section
inner gap: gap-0.5 between buttons
```

### Main island

```
flex: flex-1
border-radius: rounded-2xl
overflow: overflow-hidden
```

### Toolbar nav

```
height:   h-12  (48px)
padding:  px-6
gap:      gap-6 (between nav buttons group and title)
nav button gap: gap-1.5
nav button padding: p-1 px-2.5
nav button border-radius: rounded-lg
```

### Content area (icon grid — Applications view)

```
grid:    grid-cols-[repeat(auto-fill,80px)]
gap:     gap-10 (40px)
padding: p-8   (32px)
place:   place-items-center
icon width/height: 50px × 50px
```

### Traffic lights (Window.tsx)

```
container: absolute top-0 left-0, w-32 h-12, px-4, z-[100]
dot size:  w-3 h-3 (12px × 12px)
dot gap:   gap-2 (8px)
```

### Default drag handle (Window.tsx)

```
position: absolute top-0 left-0 right-0
height:   h-10 (40px)
z-index:  z-0
```

---

## 4. Border & Shadow

| Element | Value |
|---|---|
| Window | `rounded-2xl overflow-hidden shadow-2xl shadow-black/60` |
| Sidebar | `rounded-2xl border border-white/[0.05] shadow-xl` |
| Main island | `rounded-2xl border border-white/[0.03]` |
| Nav buttons | `border border-white/[0.05] shadow-lg shadow-black/20` |
| Sidebar backdrop | `backdrop-blur-3xl` |

---

## 5. Hover & Interaction States

### Sidebar nav button

```
default:    text-white/60
hover:      hover:bg-white/5 hover:text-white/90
active:     bg-white/10 text-white font-semibold
icon default:   text-white/40
icon hover:     group-hover:text-white/60
icon active:    text-blue-400 (or item.color)
```

### Toolbar back/forward buttons

```
enabled:   hover:bg-white/[0.12] active:bg-white/[0.2] cursor-default
disabled:  opacity-10 cursor-default
press:     active:scale-95
```

### App icon (icon grid)

```
container:  active:scale-95, cursor-default, select-none
icon hover: group-hover:bg-white/10 on label
selected:   bg-blue-600 text-white on label; after:inset-[-4px] bg-white/10 rounded-xl overlay on icon
```

### List row (ProjectsApp)

```
default:   hover:bg-white/[0.03]
selected:  bg-blue-600/20
press:     cursor-default, select-none
```

---

## 6. Window Chrome (Window.tsx)

### Motion / animation

```tsx
initial:   { x: position.x, opacity: 0, scale: 0.65, y: position.y + 40 }
animate (normal):  spring { stiffness: 320, damping: 28, mass: 0.9 }
animate (minimized): duration 0.2, ease 'easeIn', scale: 0.6, opacity: 0
exit:      { opacity: 0, scale: 0.75, duration: 0.15, ease: 'easeIn' }
transformOrigin: '50% 100%'
```

### Maximized state

```tsx
maximized: { width: '96vw', height: '90vh' }
normal:    { width: size.width, height: size.height }
```

### Layout

```
Window root:  flex flex-col rounded-2xl overflow-hidden shadow-2xl shadow-black/60 isolate
Content:      flex-1 overflow-auto bg-transparent relative z-10 w-full h-full
Drag handle:  absolute top-0 left-0 right-0 h-10 z-0
Traffic area: absolute top-0 left-0 w-32 h-12 z-[100] pointer-events-none
              (inner div: pointer-events-auto group/traffic)
```

---

## 7. Structural Layout (FinderApp)

```
<div> root: h-full flex p-2 gap-2 overflow-hidden text-white font-sans bg-[#161616]
  <aside> sidebar
    [drag handle via onPointerDown={onDragStart}]
    [sections: mb-4 pointer-events-none]
      <h3> section title: px-5 mb-2 text-[10px] uppercase ...
      <div> pointer-events-auto flex flex-col gap-0.5
        <NavBtn /> × N
    [footer count: mt-auto px-5]
  <div> main island: flex-1 flex flex-col ... overflow-hidden
    <nav> toolbar: h-12 flex items-center px-6 gap-6
      [nav buttons group: pointer-events-auto, stopPropagation on pointerDown]
        <button> back
        <button> forward
      <span> section title: text-[13px] font-bold
    <main> content: flex-1 overflow-y-auto cursor-default
      [content depends on active section]
```

---

## 8. Component Inventory

### `Window` (Window.tsx)

| Prop | Type | Notes |
|---|---|---|
| `id` | `string` | Window instance ID |
| `title` | `string` | Shown in MenuBar, not in chrome |
| `zIndex` | `number` | Managed by WindowManagerContext |
| `minimized` | `boolean` | Triggers scale/opacity animation |
| `maximized` | `boolean` | Switches to 96vw × 90vh |
| `position` | `{ x, y }` | Initial drag position |
| `size` | `{ width, height }` | Default size per app |
| `disableMinimize` | `boolean?` | Renders traffic light as `bg-white/10` |
| `disableMaximize` | `boolean?` | Renders traffic light as `bg-white/10` |
| `onClose` | `(id) => void` | — |
| `onMinimize` | `(id) => void` | — |
| `onMaximize` | `(id) => void` | — |
| `onFocus` | `(id) => void` | Called on `onMouseDown` |

Provides `WindowContext` → `useWindow()` → `{ dragControls, maximized }`.

### `TrafficLight` (Window.tsx — internal)

| Prop | Type |
|---|---|
| `label` | `string` |
| `color` | `string` (Tailwind bg class) |
| `hoverColor` | `string` (Tailwind hover class) |
| `icon` | `React.ReactNode?` |
| `onClick` | `(e) => void` |

### `Ico` (FinderApp.tsx — pattern)

```tsx
function Ico({ d, className = '' }: { d: string; className?: string }) {
  return (
    <svg className={`shrink-0 ${className}`} viewBox="0 0 16 16" fill="none">
      <path d={d} stroke="currentColor" strokeWidth="1.3"
            strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
```

Used for all UI icons: pass SVG path `d` string, size via `className` (e.g. `w-4 h-4`).

### `NavBtn` (FinderApp.tsx — pattern)

```tsx
function NavBtn({ item, active, onSelect }) {
  const isSel = active === item.id
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onSelect(item.id) }}
      onPointerDown={(e) => e.stopPropagation()}
      className={`w-[calc(100%-16px)] flex items-center gap-3 mx-2 px-3 py-1.5 rounded-lg
        text-[13px] transition-all group
        ${isSel ? 'bg-white/10 text-white font-semibold' : 'text-white/60 hover:bg-white/5 hover:text-white/90'}`}
    >
      <div className={`shrink-0 flex items-center justify-center w-4 h-4 transition-colors
        ${isSel ? (item.color || 'text-blue-400') : 'text-white/40 group-hover:text-white/60'}`}>
        {/* Ico or ReactNode */}
      </div>
      <span className="truncate">{item.label}</span>
    </button>
  )
}
```

### `AppIcon` (FinderApp.tsx — icon grid only)

| Prop | Type |
|---|---|
| `id` | `string` |
| `name` | `string` |
| `iconFile` | `string` (filename in `/icons/*.png`) |
| `selected` | `boolean` |
| `onSelect` | `(id) => void` |
| `onOpen` | `(id) => void` |

---

## 9. Drag Handle Pattern

Apps use `useWindow()` from `Window.tsx` to access `dragControls`. Draggable regions call:

```tsx
const { dragControls } = useWindow()
const onDragStart = (e: React.PointerEvent) => dragControls.start(e)
```

Applied to:
- `<aside onPointerDown={onDragStart}>` — sidebar
- `<nav onPointerDown={onDragStart}>` — toolbar

Interactive elements inside these regions must call `e.stopPropagation()` on `onPointerDown` to prevent accidental drag start.

---

## 10. Empty States

```tsx
<div className="h-full flex items-center justify-center text-white/10 text-[13px] font-medium tracking-tight uppercase">
  Aucun élément
</div>
```

---

## 11. Icon Files

Icons live at `/public/icons/*.png`. Referenced as:

```tsx
<img src={`/icons/${iconFile}.png`} alt={name} className="w-full h-full object-contain" draggable={false} />
```

---

## 12. Rules for New Apps

1. **Use the exact colors** — no approximations. `bg-white/[0.04]` is not `bg-white/5`.
2. **Outer container**: always `h-full flex p-2 gap-2 overflow-hidden text-white font-sans bg-[#161616]`.
3. **Sidebar**: always `w-[190px] shrink-0`, `pt-10` (clears traffic lights), `rounded-2xl`, `backdrop-blur-3xl`.
4. **Main island**: always `flex-1 flex flex-col`, `rounded-2xl`, `overflow-hidden`.
5. **Toolbar**: always `h-12 flex items-center px-6 gap-6`, `border-b border-white/[0.03]`.
6. **Drag handles**: sidebar and toolbar. Interactive children must `stopPropagation` on `onPointerDown`.
7. **Icons**: use the `Ico` helper with `viewBox="0 0 16 16"`, `strokeWidth="1.3"`.
8. **Nav buttons**: use the `NavBtn` pattern exactly — same class strings, same logic.
9. **Empty state**: use the exact class string from §10.
10. **Traffic lights**: rendered by `Window.tsx` — apps never render their own.
