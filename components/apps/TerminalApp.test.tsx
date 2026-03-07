import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { TerminalApp } from './TerminalApp'

function typeCommand(input: HTMLElement, command: string) {
  fireEvent.change(input, { target: { value: command } })
  fireEvent.keyDown(input, { key: 'Enter' })
}

describe('TerminalApp', () => {
  it('renders the prompt', () => {
    render(<TerminalApp />)
    expect(screen.getAllByText(/hugo@portfolio/i).length).toBeGreaterThan(0)
  })

  it('displays typed command in history after Enter', () => {
    render(<TerminalApp />)
    const input = screen.getByRole('textbox')
    typeCommand(input, 'whoami')
    expect(screen.getByText('whoami')).toBeInTheDocument()
  })

  it('clears the input after Enter', () => {
    render(<TerminalApp />)
    const input = screen.getByRole('textbox')
    typeCommand(input, 'whoami')
    expect(input).toHaveValue('')
  })

  it('help command lists available commands', () => {
    render(<TerminalApp />)
    typeCommand(screen.getByRole('textbox'), 'help')
    expect(screen.getByText(/whoami/i)).toBeInTheDocument()
    expect(screen.getByText(/skills/i)).toBeInTheDocument()
    expect(screen.getByText(/projects/i)).toBeInTheDocument()
  })

  it('whoami command shows bio', () => {
    render(<TerminalApp />)
    typeCommand(screen.getByRole('textbox'), 'whoami')
    expect(screen.getByText(/hugo garrigues/i)).toBeInTheDocument()
  })

  it('skills command shows skill list', () => {
    render(<TerminalApp />)
    typeCommand(screen.getByRole('textbox'), 'skills')
    expect(screen.getByText(/typescript/i)).toBeInTheDocument()
  })

  it('unknown command shows error message', () => {
    render(<TerminalApp />)
    typeCommand(screen.getByRole('textbox'), 'foobar')
    expect(screen.getByText(/command not found/i)).toBeInTheDocument()
  })

  it('clear command empties the history', () => {
    render(<TerminalApp />)
    const input = screen.getByRole('textbox')
    typeCommand(input, 'whoami')
    typeCommand(input, 'clear')
    expect(screen.queryByText('whoami')).not.toBeInTheDocument()
  })

  it('navigates command history with ArrowUp', () => {
    render(<TerminalApp />)
    const input = screen.getByRole('textbox')
    typeCommand(input, 'whoami')
    fireEvent.keyDown(input, { key: 'ArrowUp' })
    expect(input).toHaveValue('whoami')
  })
})
