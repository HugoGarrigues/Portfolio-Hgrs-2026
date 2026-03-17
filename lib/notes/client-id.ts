const STORAGE_KEY = 'hg_notes_client_id'

export function getNotesClientId() {
  const existing = window.localStorage.getItem(STORAGE_KEY)

  if (existing) {
    return existing
  }

  const next = window.crypto.randomUUID()
  window.localStorage.setItem(STORAGE_KEY, next)
  return next
}
