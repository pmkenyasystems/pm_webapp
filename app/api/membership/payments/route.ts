import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const idNumber = searchParams.get('idNumber')

    if (!idNumber) {
      return NextResponse.json(
        { error: 'ID Number is required' },
        { status: 400 }
      )
    }

    // Verify member exists
    const member = await prisma.member.findUnique({
      where: { idNumber },
    })

    if (!member) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      )
    }

    // Fetch membership subscription payments
    const payments = await prisma.membershipSubscription.findMany({
      where: { idNumber },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ payments })
  } catch (error: any) {
    console.error('Error fetching payments:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch payments' },
      { status: 500 }
    )
  }
}

