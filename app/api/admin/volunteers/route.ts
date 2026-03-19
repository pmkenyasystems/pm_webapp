import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { hasModuleAccess } from '@/lib/permissions'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const hasAccess = await hasModuleAccess('volunteers')
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have access to the Volunteers module' },
        { status: 403 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')

    const where: { status?: string } = {}
    if (status) where.status = status

    const volunteers = await prisma.volunteer.findMany({
      where: Object.keys(where).length ? where : undefined,
      include: {
        member: {
          select: { id: true, idNumber: true, surname: true, otherNames: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const list = volunteers.map((v) => ({
      id: v.id,
      firstName: v.firstName,
      lastName: v.lastName,
      email: v.email,
      phone: v.phone,
      idNumber: v.idNumber,
      address: v.address,
      county: v.county,
      skills: v.skills,
      availability: v.availability,
      motivation: v.motivation,
      isMember: v.isMember,
      memberId: v.memberId,
      member: v.member
        ? {
            id: v.member.id,
            idNumber: v.member.idNumber,
            name: `${v.member.surname} ${v.member.otherNames}`.trim(),
          }
        : null,
      status: v.status,
      createdAt: v.createdAt,
      updatedAt: v.updatedAt,
    }))

    return NextResponse.json({ volunteers: list })
  } catch (error: unknown) {
    console.error('Error fetching volunteers:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch volunteers' },
      { status: 500 }
    )
  }
}
