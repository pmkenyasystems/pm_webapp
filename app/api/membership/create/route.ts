import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import axios from 'axios'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { ippmsId } = await request.json()

    if (!ippmsId) {
      return NextResponse.json(
        { error: 'IPPMS ID is required' },
        { status: 400 }
      )
    }

    // Check if member already exists
    const existingMember = await prisma.member.findUnique({
      where: { ippmsId },
    })

    if (existingMember) {
      return NextResponse.json(
        { error: 'Member profile already exists' },
        { status: 400 }
      )
    }

    // Fetch member data from IPPMS API
    const ippmsApiUrl = process.env.IPPMS_API_URL || 'https://api.ippms.ke'
    const ippmsApiKey = process.env.IPPMS_API_KEY

    const response = await axios.get(`${ippmsApiUrl}/members/${ippmsId}`, {
      headers: {
        'Authorization': `Bearer ${ippmsApiKey}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.data) {
      return NextResponse.json(
        { error: 'Member not found in IPPMS system' },
        { status: 404 }
      )
    }

    const memberData = response.data

    // Create member profile
    const member = await prisma.member.create({
      data: {
        ippmsId,
        firstName: memberData.firstName,
        lastName: memberData.lastName,
        email: memberData.email,
        phone: memberData.phone,
        idNumber: memberData.idNumber,
        dateOfBirth: memberData.dateOfBirth ? new Date(memberData.dateOfBirth) : null,
        address: memberData.address,
        county: memberData.county,
        constituency: memberData.constituency,
        ward: memberData.ward,
        membershipDate: memberData.membershipDate ? new Date(memberData.membershipDate) : new Date(),
      },
    })

    return NextResponse.json({ member, message: 'Profile created successfully' })
  } catch (error: any) {
    console.error('Error creating member profile:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create member profile' },
      { status: 500 }
    )
  }
}

