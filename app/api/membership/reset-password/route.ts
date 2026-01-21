import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'

// Helper function to send SMS (placeholder - integrate with your SMS provider)
async function sendSMS(phone: string, message: string) {
  // TODO: Integrate with SMS service (e.g., Africa's Talking, Twilio, etc.)
  // For now, just log the message
  console.log(`SMS to ${phone}: ${message}`)
  
  // In production, replace with actual SMS API call:
  // const response = await axios.post('YOUR_SMS_API_URL', {
  //   phone,
  //   message,
  // })
  // return response.data
}

export async function POST(request: NextRequest) {
  try {
    const { idNumber } = await request.json()

    if (!idNumber) {
      return NextResponse.json(
        { error: 'ID Number is required' },
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

    if (!member.phone) {
      return NextResponse.json(
        { error: 'No phone number on record. Please contact support.' },
        { status: 400 }
      )
    }

    // Generate a temporary password
    const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8).toUpperCase()
    const hashedPassword = await bcrypt.hash(tempPassword, 10)

    // Update member's password
    await prisma.member.update({
      where: { id: member.id },
      data: { password: hashedPassword },
    })

    // Send temporary password via SMS
    const smsMessage = `Your temporary password for PM Kenya membership portal is: ${tempPassword}. Please change it after logging in.`
    await sendSMS(member.phone, smsMessage)

    return NextResponse.json({
      message: 'A temporary password has been sent to your registered phone number.',
    })
  } catch (error: any) {
    console.error('Error resetting password:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to reset password' },
      { status: 500 }
    )
  }
}

