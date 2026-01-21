import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { hasModuleAccess } from '@/lib/permissions'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET single election
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const hasAccess = await hasModuleAccess('elections')
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have access to the Elections module' },
        { status: 403 }
      )
    }

    const election = await prisma.election.findUnique({
      where: { id: params.id },
      include: {
        aspirants: {
          include: {
            position: true,
            county: true,
            constituency: true,
            ward: true,
          },
        },
      },
    })

    if (!election) {
      return NextResponse.json({ error: 'Election not found' }, { status: 404 })
    }

    return NextResponse.json({ election })
  } catch (error: any) {
    console.error('Error fetching election:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch election' },
      { status: 500 }
    )
  }
}

// PUT update election
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const hasAccess = await hasModuleAccess('elections')
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have access to the Elections module' },
        { status: 403 }
      )
    }

    const { title, description, electionDate, isActive } = await request.json()

    const election = await prisma.election.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(electionDate && { electionDate: new Date(electionDate) }),
        ...(isActive !== undefined && { isActive }),
      },
    })

    return NextResponse.json({ election })
  } catch (error: any) {
    console.error('Error updating election:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update election' },
      { status: 500 }
    )
  }
}

// DELETE election
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const hasAccess = await hasModuleAccess('elections')
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have access to the Elections module' },
        { status: 403 }
      )
    }

    await prisma.election.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Election deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting election:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete election' },
      { status: 500 }
    )
  }
}

