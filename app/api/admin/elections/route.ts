import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { hasModuleAccess } from '@/lib/permissions'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET all elections
export async function GET() {
  try {
    const session = await getSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has access to elections module
    const hasAccess = await hasModuleAccess('elections')
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have access to the Elections module' },
        { status: 403 }
      )
    }

    const elections = await prisma.election.findMany({
      orderBy: { electionDate: 'desc' },
      include: {
        _count: {
          select: { aspirants: true },
        },
      },
    })

    return NextResponse.json({ elections })
  } catch (error: any) {
    console.error('Error fetching elections:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch elections' },
      { status: 500 }
    )
  }
}

// POST create new election
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has access to elections module
    const hasAccess = await hasModuleAccess('elections')
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have access to the Elections module' },
        { status: 403 }
      )
    }

    const { title, description, electionDate, isActive } = await request.json()

    if (!title || !electionDate) {
      return NextResponse.json(
        { error: 'Title and election date are required' },
        { status: 400 }
      )
    }

    const election = await prisma.election.create({
      data: {
        title,
        description: description || null,
        electionDate: new Date(electionDate),
        isActive: isActive !== undefined ? isActive : true,
      },
    })

    return NextResponse.json({ election }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating election:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create election' },
      { status: 500 }
    )
  }
}

