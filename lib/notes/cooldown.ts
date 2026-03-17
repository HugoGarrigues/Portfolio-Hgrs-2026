export const NOTES_COOLDOWN_MS = 24 * 60 * 60 * 1000

export function getNextAllowedAt(createdAt: string) {
  const next = new Date(new Date(createdAt).getTime() + NOTES_COOLDOWN_MS)
  return next.toISOString()
}

export function isCooldownActive(createdAt: string, now = Date.now()) {
  return new Date(createdAt).getTime() + NOTES_COOLDOWN_MS > now
}
