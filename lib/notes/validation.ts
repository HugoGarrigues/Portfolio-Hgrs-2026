export const NOTE_LIMITS = {
  displayName: 60,
  message: 1200,
} as const

export type ValidatedCreateNoteInput = {
  displayName: string
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
      message,
      clientId,
    },
  }
}
