'use client'

import { useEffect, useRef, useState } from 'react'

// ─── Commands ──────────────────────────────────────────────────────────────────

type Line = { type: 'input' | 'output' | 'error'; text: string }

const COMMANDS: Record<string, () => string[]> = {
  help: () => [
    'Available commands:',
    '  whoami    — who is this guy?',
    '  skills    — tech stack',
    '  projects  — open Projects app',
    '  contact   — how to reach me',
    '  clear     — clear the terminal',
  ],
  whoami: () => [
    'Hugo Garrigues — fullstack developer',
    'Building products at the intersection of design and engineering.',
    'Based in France. Open to remote opportunities.',
  ],
  skills: () => [
    'Languages  : TypeScript, JavaScript, Python',
    'Frontend   : React, Next.js, Tailwind CSS, Framer Motion',
    'Backend    : Node.js, Express, Prisma, PostgreSQL',
    'Tooling    : Git, Docker, Vercel, Vitest',
    '3D / XR    : Three.js, React Three Fiber',
  ],
  projects: () => [
    'Open the Projects app from the Dock to browse my work.',
  ],
  contact: () => [
    'Email  : hugo@example.com',
    'GitHub : github.com/HugoGarrigues',
    'LinkedIn : linkedin.com/in/hugo-garrigues',
  ],
}

// ─── Component ─────────────────────────────────────────────────────────────────

const PROMPT = 'hugo@portfolio:~$'

export function TerminalApp() {
  const [history, setHistory] = useState<Line[]>([
    { type: 'output', text: 'Welcome! Type `help` to see available commands.' },
  ])
  const [input, setInput] = useState('')
  const [cmdHistory, setCmdHistory] = useState<string[]>([])
  const [historyIdx, setHistoryIdx] = useState(-1)

  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView?.({ behavior: 'smooth' })
  }, [history])

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      const cmd = input.trim()
      const inputLine: Line = { type: 'input', text: cmd }

      if (cmd === 'clear') {
        setHistory([])
        setInput('')
        setCmdHistory((prev) => [cmd, ...prev])
        setHistoryIdx(-1)
        return
      }

      const handler = COMMANDS[cmd]
      const outputLines: Line[] = handler
        ? handler().map((t) => ({ type: 'output', text: t }))
        : [{ type: 'error', text: `${cmd}: command not found. Type \`help\` for available commands.` }]

      setHistory((prev) => [...prev, inputLine, ...outputLines])
      setCmdHistory((prev) => (cmd ? [cmd, ...prev] : prev))
      setHistoryIdx(-1)
      setInput('')
      return
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = Math.min(historyIdx + 1, cmdHistory.length - 1)
      setHistoryIdx(next)
      setInput(cmdHistory[next] ?? '')
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = historyIdx - 1
      if (next < 0) {
        setHistoryIdx(-1)
        setInput('')
      } else {
        setHistoryIdx(next)
        setInput(cmdHistory[next] ?? '')
      }
    }
  }

  return (
    <div
      className="h-full flex flex-col bg-[#1a1a1a] font-mono text-[13px] text-green-400 p-2 overflow-hidden cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      {/* History */}
      <div className="flex-1 overflow-y-auto space-y-0.5">
        {history.map((line, i) => (
          <div key={i} className={line.type === 'error' ? 'text-red-400' : line.type === 'input' ? 'text-foreground' : 'text-green-400'}>
            {line.type === 'input' && (
              <span className="text-green-500 mr-2">{PROMPT}</span>
            )}
            {line.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input row */}
      <div className="flex items-center gap-2 pt-1 border-t border-white/[0.06]">
        <span className="text-green-500 shrink-0">{PROMPT}</span>
        <input
          ref={inputRef}
          role="textbox"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          spellCheck={false}
          autoComplete="off"
          className="flex-1 bg-transparent text-foreground outline-none caret-green-400"
          aria-label="terminal input"
        />
      </div>
    </div>
  )
}
