import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const FROM = 'Portfolio <onboarding@resend.dev>'
const TO   = 'garrigues.hug@gmail.com'

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Contact non configuré' }, { status: 503 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Corps de requête invalide' }, { status: 400 })
  }

  const { name, email, subject, message } = body as Record<string, unknown>

  if (
    typeof name    !== 'string' || !name.trim()    ||
    typeof email   !== 'string' || !email.trim()   ||
    typeof subject !== 'string' || !subject.trim() ||
    typeof message !== 'string' || !message.trim()
  ) {
    return NextResponse.json({ error: 'Tous les champs sont obligatoires' }, { status: 400 })
  }

  const resend = new Resend(apiKey)

  const { error } = await resend.emails.send({
    from: FROM,
    to:   TO,
    replyTo: email,
    subject: `[Portfolio] ${subject}`,
    text: `De : ${name} <${email}>\n\n${message}`,
  })

  if (error) {
    console.error('Resend error:', error)
    return NextResponse.json({ error: 'Échec de l\'envoi' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
