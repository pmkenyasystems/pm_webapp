import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { hasModuleAccess } from '@/lib/permissions'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET single position
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const hasAccess = await hasModuleAccess('positions')
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have access to the Positions module' },
        { status: 403 }
      )
    }

    const position = await prisma.position.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        aspirants: {
          include: {
            election: true,
          },
        },
      },
    })

    if (!position) {
      return NextResponse.json({ error: 'Position not found' }, { status: 404 })
    }

    return NextResponse.json({ position })
  } catch (error: any) {
    console.error('Error fetching position:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch position' },
      { status: 500 }
    )
  }
}

// PUT update position
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const hasAccess = await hasModuleAccess('positions')
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have access to the Positions module' },
        { status: 403 }
      )
    }

    const { positionTitle, positionLevel } = await request.json()

    const position = await prisma.position.update({
      where: { id: parseInt(params.id) },
      data: {
        ...(positionTitle && { positionTitle }),
        ...(positionLevel && { positionLevel }),
      },
    })

    return NextResponse.json({ position })
  } catch (error: any) {
    console.error('Error updating position:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update position' },
      { status: 500 }
    )
  }
}

// DELETE position
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const hasAccess = await hasModuleAccess('positions')
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have access to the Positions module' },
        { status: 403 }
      )
    }

    await prisma.position.delete({
      where: { id: parseInt(params.id) },
    })

    return NextResponse.json({ message: 'Position deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting position:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete position' },
      { status: 500 }
    )
  }
}

