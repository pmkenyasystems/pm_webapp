import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const counties = await prisma.county.findMany({
      orderBy: { countyName: 'asc' },
    })

    console.log(`Fetched ${counties.length} counties from database`)

    return NextResponse.json({ counties })
  } catch (error: any) {
    console.error('Error fetching counties:', error)
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      meta: error.meta,
    })
    
    return NextResponse.json(
      { 
        error: error.message || 'Failed to fetch counties',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

