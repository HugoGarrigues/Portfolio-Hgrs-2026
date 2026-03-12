'use client'

import { useEffect, useState } from 'react'

type BootScreenProps = {
  onComplete: () => void
}

export function BootScreen({ onComplete }: BootScreenProps) {
  const [progress, setProgress] = useState(0)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    // Ramp progress to 100% over ~1.4s
    const steps = [
      { target: 30,  delay: 0 },
      { target: 60,  delay: 200 },
      { target: 85,  delay: 500 },
      { target: 100, delay: 900 },
    ]

    const timers = steps.map(({ target, delay }) =>
      setTimeout(() => setProgress(target), delay),
    )

    const exitTimer = setTimeout(() => {
      setExiting(true)
      setTimeout(onComplete, 400)
    }, 1400)

    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(exitTimer)
    }
  }, [onComplete])

  return (
    <div
      className={`fixed inset-0 bg-black z-[9999] flex items-center justify-center transition-opacity duration-400 ${
        exiting ? 'opacity-0' : 'opacity-100'
      }`}
      aria-hidden="true"
    >
      <div className="flex flex-col items-center gap-8">
        {/* Logo — initials */}
        <div className="w-12 h-12 rounded-2xl bg-black/10 dark:bg-white/10 flex items-center justify-center">
          <span className="text-foreground font-semibold text-lg tracking-tight">HG</span>
        </div>

        {/* Progress bar */}
        <div
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Loading"
          className="w-[300px] h-1 bg-black/20 dark:bg-white/20 rounded-full overflow-hidden"
        >
          <div
            className="h-full bg-white rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}
