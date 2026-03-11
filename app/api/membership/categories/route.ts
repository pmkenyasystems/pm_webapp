import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const categories = await prisma.membershipCategory.findMany({
      orderBy: { title: 'asc' },
    })

    return NextResponse.json({ categories })
  } catch (error: any) {
    console.error('Error fetching membership categories:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch membership categories' },
      { status: 500 }
    )
  }
}

