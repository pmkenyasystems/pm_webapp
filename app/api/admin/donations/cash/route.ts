import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { hasModuleAccess } from '@/lib/permissions'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const hasAccess = await hasModuleAccess('donations')
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have access to the Donations module' },
        { status: 403 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')

    const where: { status?: string } = {}
    if (status) where.status = status

    const donations = await prisma.donation.findMany({
      where: Object.keys(where).length ? where : undefined,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ donations })
  } catch (error: unknown) {
    console.error('Error fetching cash donations:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch donations' },
      { status: 500 }
    )
  }
}
