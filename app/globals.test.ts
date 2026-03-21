import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

describe('notes scrollbar styles', () => {
  const css = readFileSync(join(process.cwd(), 'app/globals.css'), 'utf8')

  it('avoid conflicting standard scrollbar properties in the custom notes scrollbar block', () => {
    const appScrollbarBlock = css.match(/\.app-scrollbar\s*\{[^}]+\}/)?.[0] ?? ''

    expect(appScrollbarBlock).not.toContain('scrollbar-width:')
    expect(appScrollbarBlock).not.toContain('scrollbar-color:')
    expect(css).toContain('.app-scrollbar::-webkit-scrollbar')
  })

  it('keeps the custom notes scrollbar thin to avoid widening the pane', () => {
    const webkitScrollbarBlock = css.match(/\.app-scrollbar::\-webkit-scrollbar,\s*\.notes-scrollbar::\-webkit-scrollbar\s*\{[^}]+\}/)?.[0] ?? ''

    expect(webkitScrollbarBlock).toContain('width: 8px;')
  })

  it('reveals the shared scrollbar thumb only while the scroll area is active', () => {
    expect(css).toContain('.app-scrollbar.app-scrollbar-active::-webkit-scrollbar-thumb')
    expect(css).toContain('background-color: transparent;')
  })

  it('shares the same app scrollbar class across notes, finder, and settings scroll containers', () => {
    const files = [
      'components/apps/notes/NotesSidebar.tsx',
      'components/apps/notes/NotesList.tsx',
      'components/apps/notes/NotesDetailPane.tsx',
      'components/apps/notes/NotesDraftPane.tsx',
      'components/apps/FinderApp.tsx',
      'components/apps/SettingsApp.tsx',
    ]

    for (const file of files) {
      const source = readFileSync(join(process.cwd(), file), 'utf8')
      expect(source).toContain('app-scrollbar')
    }
  })

  it('keeps finder and settings on auto overflow so the shared scrollbar does not shift fixed-width layouts', () => {
    const finderSource = readFileSync(join(process.cwd(), 'components/apps/FinderApp.tsx'), 'utf8')
    const settingsSource = readFileSync(join(process.cwd(), 'components/apps/SettingsApp.tsx'), 'utf8')
    const notesListSource = readFileSync(join(process.cwd(), 'components/apps/notes/NotesList.tsx'), 'utf8')

    expect(finderSource).toContain('app-scrollbar w-[190px] shrink-0 flex flex-col pt-10 pb-3 overflow-y-auto')
    expect(finderSource).toContain('app-scrollbar flex-1 overflow-y-auto overscroll-contain cursor-default')
    expect(settingsSource).toContain('app-scrollbar w-[190px] shrink-0 flex flex-col pt-10 pb-3 overflow-y-auto')
    expect(settingsSource).toContain('app-scrollbar flex-1 overflow-y-auto overscroll-contain p-4 sm:p-8')
    expect(finderSource).not.toContain('app-scrollbar-stable')
    expect(settingsSource).not.toContain('app-scrollbar-stable')
    expect(notesListSource).toContain('app-scrollbar-stable')
    expect(css).toContain('.app-scrollbar-stable')
  })
})
