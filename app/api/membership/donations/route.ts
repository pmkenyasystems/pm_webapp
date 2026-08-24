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

    const member = await prisma.member.findUnique({
      where: { idNumber },
    })

    if (!member) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      )
    }

    const orConditions: Array<{ donorEmail?: string; donorPhone?: string }> = []
    if (member.email) orConditions.push({ donorEmail: member.email })
    if (member.phone) orConditions.push({ donorPhone: member.phone })

    const donations = orConditions.length
      ? await prisma.donation.findMany({
          where: { status: 'completed', OR: orConditions },
          orderBy: { createdAt: 'desc' },
        })
      : []

    return NextResponse.json({ donations })
  } catch (error: any) {
    console.error('Error fetching member donations:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch donations' },
      { status: 500 }
    )
  }
}
