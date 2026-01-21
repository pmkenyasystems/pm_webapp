import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET active elections for aspirant application
export async function GET() {
  try {
    const elections = await prisma.election.findMany({
      where: { isActive: true },
      orderBy: { electionDate: 'desc' },
    })

    return NextResponse.json({ elections })
  } catch (error: any) {
    console.error('Error fetching elections:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch elections' },
      { status: 500 }
    )
  }
}

