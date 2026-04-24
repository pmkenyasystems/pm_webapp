import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendAspirantNotification } from '@/lib/mailer'

export const dynamic = 'force-dynamic'

// POST apply as aspirant
export async function POST(request: NextRequest) {
  try {
    const { idNumber, fullName, phone, email, electionId, positionId, country, countyCode, constituencyCode, wardCode, pollingStation } = await request.json()

    if (!idNumber || !electionId || !positionId) {
      return NextResponse.json(
        { error: 'ID Number, Election, and Position are required' },
        { status: 400 }
      )
    }

    // Verify member exists
    const member = await prisma.member.findUnique({
      where: { idNumber },
    })

    if (!member) {
      return NextResponse.json(
        { error: 'Member not found. Please create a profile first.' },
        { status: 404 }
      )
    }

    // Verify election exists and is active
    const election = await prisma.election.findUnique({
      where: { id: electionId },
    })

    if (!election) {
      return NextResponse.json(
        { error: 'Election not found' },
        { status: 404 }
      )
    }

    if (!election.isActive) {
      return NextResponse.json(
        { error: 'This election is not currently accepting applications' },
        { status: 400 }
      )
    }

    // Verify position exists
    const position = await prisma.position.findUnique({
      where: { id: positionId },
    })

    if (!position) {
      return NextResponse.json(
        { error: 'Position not found' },
        { status: 404 }
      )
    }

    // Check if already applied for this election and position
    const existingApplication = await prisma.aspirant.findUnique({
      where: {
        idNumber_electionId_positionId: {
          idNumber,
          electionId,
          positionId,
        },
      },
    })

    if (existingApplication) {
      return NextResponse.json(
        { error: 'You have already applied for this position in this election' },
        { status: 400 }
      )
    }

    // Create aspirant application
    const aspirant = await prisma.aspirant.create({
      data: {
        idNumber,
        fullName: fullName?.trim() || null,
        phone: phone?.trim() || null,
        email: email?.trim() || null,
        electionId,
        positionId,
        country: country || 'Kenya',
        countyCode: countyCode || null,
        constituencyCode: constituencyCode || null,
        wardCode: wardCode || null,
        pollingStation: pollingStation?.trim() || null,
      },
      include: {
        election: true,
        position: true,
        county: true,
        constituency: true,
        ward: true,
      },
    })

    // Send email notification to NEB (non-blocking)
    sendAspirantNotification({
      fullName,
      idNumber,
      phone,
      email,
      electionTitle: aspirant.election.title,
      positionTitle: aspirant.position.positionTitle,
      positionLevel: aspirant.position.positionLevel,
      county: aspirant.county?.countyName ?? null,
      constituency: aspirant.constituency?.constituencyName ?? null,
      ward: aspirant.ward?.wardName ?? null,
      pollingStation,
    }).catch((err) => console.error('Failed to send NEB email:', err))

    return NextResponse.json(
      { aspirant, message: 'Application submitted successfully' },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating aspirant application:', error)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'You have already applied for this position in this election' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: error.message || 'Failed to submit application' },
      { status: 500 }
    )
  }
}

