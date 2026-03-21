'use client'

type BrowserStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem' | 'clear'>

function isBrowserStorage(value: unknown): value is BrowserStorage {
  return (
    typeof value === 'object' &&
    value !== null &&
    'getItem' in value &&
    typeof value.getItem === 'function' &&
    'setItem' in value &&
    typeof value.setItem === 'function' &&
    'removeItem' in value &&
    typeof value.removeItem === 'function' &&
    'clear' in value &&
    typeof value.clear === 'function'
  )
}

export function getBrowserStorage(): BrowserStorage | null {
  if (typeof window === 'undefined') {
    return null
  }

  return isBrowserStorage(window.localStorage) ? window.localStorage : null
}

export function readStorage(key: string): string | null {
  return getBrowserStorage()?.getItem(key) ?? null
}

export function writeStorage(key: string, value: string) {
  getBrowserStorage()?.setItem(key, value)
}
