import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { idNumber, currentPassword, newPassword } = await request.json()

    if (!idNumber || !currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'ID Number, current password, and new password are required' },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'New password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // Find member by ID number
    const member = await prisma.member.findUnique({
      where: { idNumber },
    })

    if (!member) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      )
    }

    if (!member.password) {
      return NextResponse.json(
        { error: 'No password set. Please reset your password first.' },
        { status: 400 }
      )
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, member.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 401 }
      )
    }

    // Hash and update password
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await prisma.member.update({
      where: { id: member.id },
      data: { password: hashedPassword },
    })

    return NextResponse.json({
      message: 'Password changed successfully',
    })
  } catch (error: any) {
    console.error('Error changing password:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to change password' },
      { status: 500 }
    )
  }
}

