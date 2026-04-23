import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { serializeMemberForApi } from '@/lib/serialize-member'
import { getSession } from '@/lib/auth'
import { hasModuleAccess } from '@/lib/permissions'

export const dynamic = 'force-dynamic'

export async function GET(
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

    // Check if user has access to members module
    const hasAccess = await hasModuleAccess('members')
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have access to the Members module' },
        { status: 403 }
      )
    }

    const id = parseInt(params.id, 10)
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: 'Invalid member ID' }, { status: 400 })
    }
    const member = await prisma.member.findUnique({
      where: { id },
      include: {
        membershipCategory: true,
        county: true,
        constituency: true,
        ward: true,
      },
    })

    if (!member) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ member: serializeMemberForApi(member) })
  } catch (error: any) {
    console.error('Error fetching member:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch member' },
      { status: 500 }
    )
  }
}

