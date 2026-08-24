import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { isSuperAdmin } from '@/lib/permissions'
import { prisma } from '@/lib/prisma'
import { sendAdminPasswordResetEmail } from '@/lib/mailer'
import { generateTemporaryPassword } from '@/lib/generate-temp-password'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'

// POST initiate a password reset for a user (only super admin) — generates and emails a new temporary password
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const superAdmin = await isSuperAdmin()
    if (!superAdmin) {
      return NextResponse.json({ error: 'Forbidden: Super admin access required' }, { status: 403 })
    }

    const user = await prisma.user.findUnique({
      where: { id: params.id },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const temporaryPassword = generateTemporaryPassword()
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10)

    await prisma.user.update({
      where: { id: params.id },
      data: { password: hashedPassword },
    })

    try {
      await sendAdminPasswordResetEmail({
        name: user.name,
        email: user.email,
        temporaryPassword,
      })
      return NextResponse.json({ emailSent: true })
    } catch (emailError: any) {
      console.error('Error sending admin password reset email:', emailError)
      return NextResponse.json({
        emailSent: false,
        temporaryPassword,
        warning: 'Password was reset, but the notification email could not be sent. Share this temporary password with them directly.',
      })
    }
  } catch (error: any) {
    console.error('Error resetting user password:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to reset password' },
      { status: 500 }
    )
  }
}
