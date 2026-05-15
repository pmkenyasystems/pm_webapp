import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import nodemailer from 'nodemailer'

export const dynamic = 'force-dynamic'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { subject, message, statusFilter, electionId } = await request.json()

    if (!subject || !message) {
      return NextResponse.json({ error: 'Subject and message are required' }, { status: 400 })
    }

    const where: Record<string, unknown> = {}
    if (statusFilter !== '' && statusFilter !== undefined) where.status = Number(statusFilter)
    if (electionId) where.electionId = electionId

    const aspirants = await prisma.aspirant.findMany({
      where,
      include: {
        election: { select: { title: true } },
        position: { select: { positionTitle: true } },
      },
    })

    const recipients = aspirants
      .filter((a) => a.email)
      .map((a) => ({
        email: a.email!,
        name: a.fullName || a.idNumber,
        position: a.position.positionTitle,
        election: a.election.title,
      }))

    if (recipients.length === 0) {
      return NextResponse.json({ error: 'No aspirants with email addresses found for the selected filter' }, { status: 400 })
    }

    const senderEmail = process.env.GMAIL_USER
    if (!senderEmail) {
      return NextResponse.json({ error: 'Email not configured on server' }, { status: 500 })
    }

    const htmlMessage = message.replace(/\n/g, '<br/>')

    const results = await Promise.allSettled(
      recipients.map((r) =>
        transporter.sendMail({
          from: `"People's Renaissance Movement" <${senderEmail}>`,
          to: r.email,
          subject,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: #003366; color: white; padding: 20px 28px;">
                <h2 style="margin: 0; font-size: 18px;">People's Renaissance Movement</h2>
                <p style="margin: 4px 0 0; opacity: 0.8; font-size: 13px;">Aspirant Notification</p>
              </div>
              <div style="padding: 28px; background: #f9fafb; border: 1px solid #e5e7eb;">
                <p style="margin: 0 0 16px; color: #374151; font-size: 14px;">Dear ${r.name},</p>
                <div style="color: #111827; font-size: 14px; line-height: 1.6;">${htmlMessage}</div>
                <div style="margin-top: 24px; padding: 12px 16px; background: white; border-left: 3px solid #003366; border-radius: 4px; font-size: 13px; color: #6b7280;">
                  <strong style="color: #374151;">Your Application:</strong> ${r.position} — ${r.election}
                </div>
              </div>
              <div style="padding: 14px 28px; background: #f3f4f6; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0; color: #9ca3af; font-size: 11px;">This email was sent by the PRM Admin Portal.</p>
              </div>
            </div>
          `,
        })
      )
    )

    const sent = results.filter((r) => r.status === 'fulfilled').length
    const failed = results.filter((r) => r.status === 'rejected').length

    return NextResponse.json({ sent, failed, total: recipients.length })
  } catch (error: any) {
    console.error('Notify error:', error)
    return NextResponse.json({ error: error.message || 'Failed to send notifications' }, { status: 500 })
  }
}
