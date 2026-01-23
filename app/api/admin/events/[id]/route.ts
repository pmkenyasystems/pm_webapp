import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { hasModuleAccess } from '@/lib/permissions'

export const dynamic = 'force-dynamic'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const hasAccess = await hasModuleAccess('events')
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have access to the Events module' },
        { status: 403 }
      )
    }

    const data = await request.json()
    const { title, slug, description, imageUrl, location, startDate, endDate, isPublic, maxAttendees } = data

    const event = await prisma.event.update({
      where: { id: params.id },
      data: {
        title,
        slug,
        description,
        imageUrl: imageUrl || null,
        location,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        isPublic: isPublic !== false,
        maxAttendees: maxAttendees ? parseInt(maxAttendees) : null,
      },
    })

    return NextResponse.json({ event })
  } catch (error: any) {
    console.error('Error updating event:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update event' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const hasAccess = await hasModuleAccess('events')
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have access to the Events module' },
        { status: 403 }
      )
    }

    await prisma.event.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Event deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting event:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete event' },
      { status: 500 }
    )
  }
}

