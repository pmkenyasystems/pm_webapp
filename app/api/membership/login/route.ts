import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { idNumber, password } = await request.json()

    if (!idNumber || !password) {
      return NextResponse.json(
        { error: 'ID Number and password are required' },
        { status: 400 }
      )
    }

    // Find member by ID number with membership category
    const member = await prisma.member.findUnique({
      where: { idNumber },
      include: {
        membershipCategory: true,
      },
    })

    if (!member) {
      return NextResponse.json(
        { error: 'Invalid ID Number or password' },
        { status: 401 }
      )
    }

    if (!member.password) {
      return NextResponse.json(
        { error: 'No password set. Please reset your password.' },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, member.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid ID Number or password' },
        { status: 401 }
      )
    }

    // Return member data (excluding password)
    const { password: _, ...memberWithoutPassword } = member

    return NextResponse.json({
      member: memberWithoutPassword,
      message: 'Login successful',
    })
  } catch (error: any) {
    console.error('Error during member login:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to login' },
      { status: 500 }
    )
  }
}

