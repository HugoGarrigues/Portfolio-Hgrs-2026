import { render, screen, fireEvent } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import React from 'react'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { LocaleProvider } from '@/contexts/LocaleContext'
import { AppearanceSettings } from './AppearanceSettings'

function renderAppearanceSettings() {
  return render(
    <ThemeProvider>
      <LocaleProvider>
        <AppearanceSettings />
      </LocaleProvider>
    </ThemeProvider>,
  )
}

describe('AppearanceSettings', () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.localStorage.setItem('hgrs-locale', 'en')
  })

  it('keeps the menu bar effect toggle disabled by default and persists activation', () => {
    renderAppearanceSettings()

    expect(screen.getByText('Glass menu bar effect')).toBeInTheDocument()
    expect(screen.getByText('Enable a full-width glass menu bar.')).toBeInTheDocument()

    const toggle = screen.getByRole('button', { name: '' })
    expect(toggle.className).toContain('bg-black/20')

    fireEvent.click(toggle)

    expect(window.localStorage.getItem('hgrs-theme')).toContain('"glassMenuBar":true')
  })
})
