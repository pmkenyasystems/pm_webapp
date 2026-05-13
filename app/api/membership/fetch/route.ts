import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { serializeMemberForApi } from '@/lib/serialize-member'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { nationalId } = await request.json()

    if (!nationalId) {
      return NextResponse.json({ error: 'National ID is required' }, { status: 400 })
    }

    const member = await prisma.member.findUnique({
      where: { idNumber: nationalId },
      include: { county: true, constituency: true, ward: true },
    })

    if (!member) {
      return NextResponse.json(
        { error: 'This ID has not been found in our ORPP records. Your ORPP registration may not have been synced yet.' },
        { status: 404 }
      )
    }

    // Member already has a profile (password set)
    if (member.password) {
      return NextResponse.json({ alreadyHasProfile: true }, { status: 200 })
    }

    // ORPP record exists, no profile yet — return data for confirmation
    return NextResponse.json({ member: serializeMemberForApi(member as any) })
  } catch (error: any) {
    console.error('Error fetching member:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch member data' },
      { status: 500 }
    )
  }
}
