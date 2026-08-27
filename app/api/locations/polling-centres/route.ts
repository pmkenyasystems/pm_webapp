import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const wardCode = searchParams.get('wardCode')

    if (!wardCode) {
      return NextResponse.json({ error: 'wardCode is required' }, { status: 400 })
    }

    const pollingCentres = await prisma.pollingCentre.findMany({
      where: { wardCode: parseInt(wardCode) },
      orderBy: { centreName: 'asc' },
    })

    return NextResponse.json({ pollingCentres })
  } catch (error: any) {
    console.error('Error fetching polling centres:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch polling centres' },
      { status: 500 }
    )
  }
}
