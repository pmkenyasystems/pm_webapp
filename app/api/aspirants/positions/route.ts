import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET positions, optionally filtered by level
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const level = searchParams.get('level')

    const where = level ? { positionLevel: level } : {}

    const positions = await prisma.position.findMany({
      where,
      orderBy: [{ positionLevel: 'asc' }, { positionTitle: 'asc' }],
    })

    return NextResponse.json({ positions })
  } catch (error: any) {
    console.error('Error fetching positions:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch positions' },
      { status: 500 }
    )
  }
}

