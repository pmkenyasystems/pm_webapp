import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendNdcWelcomeEmail } from '@/lib/mailer'

export const dynamic = 'force-dynamic'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const name = String(data.name || '').trim()
    const phone = String(data.phone || '').trim()
    const email = String(data.email || '').trim()

    if (!name || !phone || !email) {
      return NextResponse.json({ error: 'Name, phone and email are required' }, { status: 400 })
    }

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const registration = await prisma.ndcRegistration.create({
      data: { name, phone, email },
    })

    sendNdcWelcomeEmail({ name, email }).catch((err) =>
      console.error('Failed to send NDC welcome email:', err)
    )

    return NextResponse.json({ registration, message: 'Registration successful' })
  } catch (error: any) {
    console.error('Error creating NDC registration:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to submit registration' },
      { status: 500 }
    )
  }
}
