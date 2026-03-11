import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { hasModuleAccess } from '@/lib/permissions'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user has access to events module
    const hasAccess = await hasModuleAccess('events')
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have access to the Events module' },
        { status: 403 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const isPublic = searchParams.get('isPublic')
    const search = searchParams.get('search')
    const dateFilter = searchParams.get('dateFilter') // upcoming, past, all

    const where: any = {}
    if (isPublic !== null && isPublic !== undefined) {
      where.isPublic = isPublic === 'true'
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (dateFilter === 'upcoming') {
      where.startDate = { gte: new Date() }
    } else if (dateFilter === 'past') {
      where.startDate = { lt: new Date() }
    }

    const events = await prisma.event.findMany({
      where,
      orderBy: { startDate: 'asc' },
    })

    return NextResponse.json({ events })
  } catch (error: any) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch events' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user has access to events module
    const hasAccess = await hasModuleAccess('events')
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have access to the Events module' },
        { status: 403 }
      )
    }

    const data = await request.json()
    const { title, description, imageUrl, location, startDate, endDate, isPublic, maxAttendees } = data

    if (!title || !description || !location || !startDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const event = await prisma.event.create({
      data: {
        title,
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
    console.error('Error creating event:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create event' },
      { status: 500 }
    )
  }
}

