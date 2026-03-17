export const NOTE_LIMITS = {
  displayName: 60,
  title: 120,
  message: 1200,
} as const

export type ValidatedCreateNoteInput = {
  displayName: string
  title: string
  message: string
  clientId: string
}

type ValidationSuccess = {
  success: true
  value: ValidatedCreateNoteInput
}

type ValidationFailure = {
  success: false
  error: string
}

export type CreateNoteValidationResult = ValidationSuccess | ValidationFailure

const normalize = (value: unknown) => (typeof value === 'string' ? value.trim() : '')

export function validateCreateNoteInput(payload: unknown): CreateNoteValidationResult {
  if (payload === null || typeof payload !== 'object') {
    return { success: false, error: 'Le format de la requête est invalide' }
  }

  const record = payload as Record<string, unknown>
  const displayName = normalize(record.displayName)
  const title = normalize(record.title)
  const message = normalize(record.message)
  const clientId = normalize(record.clientId)

  if (!displayName) {
    return { success: false, error: 'Le nom est requis' }
  }

  if (displayName.length > NOTE_LIMITS.displayName) {
    return {
      success: false,
      error: `Le nom doit faire moins de ${NOTE_LIMITS.displayName + 1} caractères`,
    }
  }

  if (!title) {
    return { success: false, error: 'Le titre est requis' }
  }

  if (title.length > NOTE_LIMITS.title) {
    return {
      success: false,
      error: `Le titre doit faire moins de ${NOTE_LIMITS.title + 1} caractères`,
    }
  }

  if (!message) {
    return { success: false, error: 'Le message est requis' }
  }

  if (message.length > NOTE_LIMITS.message) {
    return {
      success: false,
      error: `Le message doit faire moins de ${NOTE_LIMITS.message + 1} caractères`,
    }
  }

  if (!clientId) {
    return { success: false, error: 'Le client_id est requis' }
  }

  return {
    success: true,
    value: {
      displayName,
      title,
      message,
      clientId,
    },
  }
}
