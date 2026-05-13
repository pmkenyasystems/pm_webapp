import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { resolveMemberLocationFromStrings } from '@/lib/member-location'
import { serializeMemberForApi } from '@/lib/serialize-member'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nationalId, phone, email, membershipCategoryId, manualData } = body

    if (!nationalId) {
      return NextResponse.json({ error: 'National ID is required' }, { status: 400 })
    }
    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 })
    }
    if (!email) {
      return NextResponse.json({ error: 'Email address is required' }, { status: 400 })
    }

    const tempPassword =
      Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-4).toUpperCase()
    const hashedPassword = await bcrypt.hash(tempPassword, 10)

    let member: any

    if (manualData) {
      // Manual path — no ORPP record exists; create a new one
      const existing = await prisma.member.findUnique({ where: { idNumber: nationalId } })
      if (existing?.password) {
        return NextResponse.json(
          { error: 'A profile already exists for this National ID. Please login instead.' },
          { status: 409 }
        )
      }

      const loc = await resolveMemberLocationFromStrings(
        prisma,
        manualData.county,
        manualData.constituency,
        manualData.ward
      )

      const data = {
        idNumber: nationalId,
        surname: manualData.surname || '',
        otherNames: manualData.otherNames || '',
        email,
        phone,
        dateOfBirth: manualData.dateOfBirth ? new Date(manualData.dateOfBirth) : null,
        gender: manualData.gender || null,
        religion: manualData.religion || null,
        ethnicity: manualData.ethnicity || null,
        address: manualData.address || null,
        countyCode: loc.countyCode,
        constituencyCode: loc.constituencyCode,
        wardCode: loc.wardCode,
        youth: manualData.youth ?? false,
        pwd: manualData.pwd ?? false,
        membershipDate: new Date(),
        password: hashedPassword,
        profileSyncStatus: false,
        ...(membershipCategoryId && { membershipCategoryId }),
      }

      member = existing
        ? await prisma.member.update({ where: { id: existing.id }, data })
        : await prisma.member.create({ data })
    } else {
      // ORPP path — record must already exist in the member table (loaded from ORPP)
      const existing = await prisma.member.findUnique({ where: { idNumber: nationalId } })

      if (!existing) {
        return NextResponse.json(
          { error: 'No ORPP record found for this ID. Please use the manual registration option.' },
          { status: 404 }
        )
      }

      if (existing.password) {
        return NextResponse.json(
          { error: 'A profile already exists for this National ID. Please login instead.' },
          { status: 409 }
        )
      }

      // Update the ORPP-loaded record with contact details + password
      member = await prisma.member.update({
        where: { id: existing.id },
        data: {
          email,
          phone,
          password: hashedPassword,
          profileSyncStatus: true,
          ippmsDataSyncedAt: existing.ippmsDataSyncedAt ?? new Date(),
          ...(membershipCategoryId && { membershipCategoryId }),
        },
      })
    }

    // TODO: Send tempPassword to member's email
    console.log(`Temp password for ${email}: ${tempPassword}`)

    const memberWithLoc = await prisma.member.findUnique({
      where: { id: member.id },
      include: { county: true, constituency: true, ward: true },
    })

    return NextResponse.json({
      member: memberWithLoc
        ? serializeMemberForApi(memberWithLoc as any)
        : serializeMemberForApi(member as any),
      message: manualData
        ? 'Profile created. Your data will be synced when your ORPP registration is confirmed. A temporary password has been sent to your email.'
        : 'Profile created successfully. A temporary password has been sent to your email.',
      tempPassword,
    })
  } catch (error: any) {
    console.error('Error creating member profile:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create member profile' },
      { status: 500 }
    )
  }
}
