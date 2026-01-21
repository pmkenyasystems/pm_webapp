import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { hasModuleAccess } from '@/lib/permissions'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET all positions
export async function GET() {
  try {
    const session = await getSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has access to positions module
    const hasAccess = await hasModuleAccess('positions')
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have access to the Positions module' },
        { status: 403 }
      )
    }

    const positions = await prisma.position.findMany({
      orderBy: [{ positionLevel: 'asc' }, { positionTitle: 'asc' }],
      include: {
        _count: {
          select: { aspirants: true },
        },
      },
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

// POST create new position
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has access to positions module
    const hasAccess = await hasModuleAccess('positions')
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have access to the Positions module' },
        { status: 403 }
      )
    }

    const { positionTitle, positionLevel } = await request.json()

    if (!positionTitle || !positionLevel) {
      return NextResponse.json(
        { error: 'Position title and level are required' },
        { status: 400 }
      )
    }

    const position = await prisma.position.create({
      data: {
        positionTitle,
        positionLevel,
      },
    })

    return NextResponse.json({ position }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating position:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create position' },
      { status: 500 }
    )
  }
}

