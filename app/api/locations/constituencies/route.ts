import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const countyCode = searchParams.get('countyCode')

    if (countyCode) {
      const constituencies = await prisma.constituency.findMany({
        where: { countyCode: parseInt(countyCode) },
        orderBy: { constituencyName: 'asc' },
        include: {
          county: {
            select: {
              countyName: true,
            },
          },
          _count: {
            select: {
              wards: true,
            },
          },
        },
      })
      return NextResponse.json({ constituencies })
    }

    const constituencies = await prisma.constituency.findMany({
      orderBy: { constituencyName: 'asc' },
      include: {
        county: {
          select: {
            countyName: true,
          },
        },
        _count: {
          select: {
            wards: true,
          },
        },
      },
    })

    return NextResponse.json({ constituencies })
  } catch (error: any) {
    console.error('Error fetching constituencies:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch constituencies' },
      { status: 500 }
    )
  }
}

