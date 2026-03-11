import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const constituencyCode = searchParams.get('constituencyCode')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const skip = (page - 1) * limit

    const include = {
      constituency: {
        select: {
          constituencyName: true,
          county: {
            select: {
              countyName: true,
            },
          },
        },
      },
    }

    if (constituencyCode) {
      const wards = await prisma.ward.findMany({
        where: { constituencyCode: parseInt(constituencyCode) },
        orderBy: { wardName: 'asc' },
        include,
      })
      return NextResponse.json({ wards })
    }

    const wards = await prisma.ward.findMany({
      orderBy: { wardName: 'asc' },
      include,
      skip,
      take: limit,
    })

    return NextResponse.json({ wards })
  } catch (error: any) {
    console.error('Error fetching wards:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch wards' },
      { status: 500 }
    )
  }
}

