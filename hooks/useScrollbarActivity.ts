import { useCallback, useEffect, useRef } from 'react'

const ACTIVE_CLASS = 'app-scrollbar-active'
const SCROLLBAR_ACTIVE_MS = 700

export function useScrollbarActivity<T extends HTMLElement>() {
  const cleanupRef = useRef<(() => void) | null>(null)

  const scrollbarRef = useCallback((node: T | null) => {
    cleanupRef.current?.()
    cleanupRef.current = null

    if (!node) {
      return
    }

    let timeoutId: number | null = null

    const markActive = () => {
      node.classList.add(ACTIVE_CLASS)

      if (timeoutId !== null) {
        window.clearTimeout(timeoutId)
      }

      timeoutId = window.setTimeout(() => {
        node.classList.remove(ACTIVE_CLASS)
        timeoutId = null
      }, SCROLLBAR_ACTIVE_MS)
    }

    node.addEventListener('scroll', markActive, { passive: true })

    cleanupRef.current = () => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId)
      }
      node.classList.remove(ACTIVE_CLASS)
      node.removeEventListener('scroll', markActive)
    }
  }, [])

  useEffect(() => {
    return () => {
      cleanupRef.current?.()
    }
  }, [])

  return scrollbarRef
}
