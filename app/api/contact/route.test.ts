import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const sendEmailMock = vi.fn()

vi.mock('resend', () => ({
  Resend: vi.fn(function Resend() {
    return {
      emails: {
        send: sendEmailMock,
      },
    }
  }),
}))

import { POST } from './route'

function createContactRequest(body: Record<string, unknown>) {
  return new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('Contact API route', () => {
  const originalApiKey = process.env.RESEND_API_KEY

  beforeEach(() => {
    sendEmailMock.mockReset()
    delete process.env.RESEND_API_KEY
  })

  afterEach(() => {
    if (originalApiKey === undefined) {
      delete process.env.RESEND_API_KEY
      return
    }

    process.env.RESEND_API_KEY = originalApiKey
  })

  it('returns 503 when Resend is not configured', async () => {
    const response = await POST(
      createContactRequest({
        name: 'Hugo',
        email: 'hugo@example.com',
        subject: 'Hello',
        message: 'Need help',
      }),
    )

    expect(response.status).toBe(503)
    await expect(response.json()).resolves.toEqual({ error: 'Contact non configuré' })
    expect(sendEmailMock).not.toHaveBeenCalled()
  })

  it('sends the email when Resend is configured', async () => {
    process.env.RESEND_API_KEY = 're_test_key'
    sendEmailMock.mockResolvedValue({ error: null })

    const response = await POST(
      createContactRequest({
        name: 'Hugo',
        email: 'hugo@example.com',
        subject: 'Hello',
        message: 'Need help',
      }),
    )

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ ok: true })
    expect(sendEmailMock).toHaveBeenCalledWith({
      from: 'Portfolio <onboarding@resend.dev>',
      to: 'garrigues.hug@gmail.com',
      replyTo: 'hugo@example.com',
      subject: '[Portfolio] Hello',
      text: 'De : Hugo <hugo@example.com>\n\nNeed help',
    })
  })
})
