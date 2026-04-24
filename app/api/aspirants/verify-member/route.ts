import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET verify member by ID number (for aspirant application flow - public, returns minimal safe details only)
export async function GET(request: NextRequest) {
  try {
    const idNumber = request.nextUrl.searchParams.get('idNumber')?.trim()

    if (!idNumber) {
      return NextResponse.json(
        { error: 'ID Number is required' },
        { status: 400 }
      )
    }

    const member = await prisma.member.findUnique({
      where: { idNumber },
      select: {
        id: true,
        surname: true,
        otherNames: true,
        idNumber: true,
        status: true,
        membershipCategory: {
          select: { title: true },
        },
      },
    })

    if (!member) {
      return NextResponse.json({ found: false }, { status: 200 })
    }

    if (member.status !== 'active') {
      return NextResponse.json(
        { found: false, error: 'Your membership is not active.' },
        { status: 200 }
      )
    }

    return NextResponse.json({
      found: true,
      member: {
        surname: member.surname,
        otherNames: member.otherNames,
        idNumber: member.idNumber,
        membershipCategory: member.membershipCategory?.title ?? null,
      },
    })
  } catch (error) {
    console.error('Error verifying member:', error)
    return NextResponse.json(
      { error: 'Failed to verify member' },
      { status: 500 }
    )
  }
}
