import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { serializeMemberForApi } from '@/lib/serialize-member'
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

    // Check if user has access to members module
    const hasAccess = await hasModuleAccess('members')
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have access to the Members module' },
        { status: 403 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const county = searchParams.get('county')
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    const where: any = {}
    
    if (status) {
      where.status = status
    }
    
    if (county) {
      where.county = { countyName: county }
    }
    
    if (category) {
      where.membershipCategoryId = category
    }
    
    if (search) {
      where.OR = [
        { surname: { contains: search, mode: 'insensitive' } },
        { otherNames: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { idNumber: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ]
    }

    const membersRaw = await prisma.member.findMany({
      where,
      include: {
        membershipCategory: {
          select: {
            id: true,
            title: true,
          },
        },
        county: true,
        constituency: true,
        ward: true,
      },
      orderBy: { updatedAt: 'desc' },
    })

    const members = membersRaw.map((m) => serializeMemberForApi(m))

    return NextResponse.json({ members })
  } catch (error: any) {
    console.error('Error fetching members:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch members' },
      { status: 500 }
    )
  }
}

