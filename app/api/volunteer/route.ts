import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const {
      firstName,
      lastName,
      email,
      phone,
      idNumber,
      address,
      county,
      skills,
      availability,
      motivation,
      isMember,
      memberId,
    } = data

    if (!firstName || !lastName || !email || !phone || !availability || !motivation) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // If member, verify member exists
    if (isMember && memberId) {
      const member = await prisma.member.findUnique({
        where: { id: memberId },
      })

      if (!member) {
        return NextResponse.json(
          { error: 'Member ID not found' },
          { status: 404 }
        )
      }
    }

    const volunteer = await prisma.volunteer.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        idNumber: idNumber || null,
        address: address || null,
        county: county || null,
        skills: skills || null,
        availability,
        motivation,
        isMember: isMember || false,
        memberId: isMember && memberId ? memberId : null,
        status: 'pending',
      },
    })

    return NextResponse.json({ volunteer, message: 'Application submitted successfully' })
  } catch (error: any) {
    console.error('Error creating volunteer application:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to submit application' },
      { status: 500 }
    )
  }
}

