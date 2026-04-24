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

    const hasAccess = await hasModuleAccess('aspirants')
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have access to the Aspirants module' },
        { status: 403 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const electionId = searchParams.get('electionId')
    const positionId = searchParams.get('positionId')

    const where: { status?: number; electionId?: string; positionId?: number } = {}
    if (status !== null && status !== '') where.status = parseInt(status, 10)
    if (electionId) where.electionId = electionId
    if (positionId) where.positionId = parseInt(positionId, 10)

    const aspirants = await prisma.aspirant.findMany({
      where: Object.keys(where).length ? where : undefined,
      include: {
        election: { select: { id: true, title: true, electionDate: true } },
        position: { select: { id: true, positionTitle: true, positionLevel: true } },
        county: { select: { countyCode: true, countyName: true } },
        constituency: { select: { constituencyCode: true, constituencyName: true } },
        ward: { select: { wardCode: true, wardName: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    const idNumbers = Array.from(new Set(aspirants.map((a) => a.idNumber)))
    const members = await prisma.member.findMany({
      where: { idNumber: { in: idNumbers } },
      select: { idNumber: true, surname: true, otherNames: true },
    })
    const memberByName: Record<string, { surname: string; otherNames: string }> = {}
    members.forEach((m) => {
      memberByName[m.idNumber] = { surname: m.surname, otherNames: m.otherNames }
    })

    const list = aspirants.map((a) => {
      const member = memberByName[a.idNumber]
      return {
        id: a.id,
        idNumber: a.idNumber,
        memberName: member ? `${member.surname} ${member.otherNames}`.trim() : null,
        election: a.election,
        position: a.position,
        county: a.county?.countyName ?? null,
        constituency: a.constituency?.constituencyName ?? null,
        ward: a.ward?.wardName ?? null,
        status: a.status,
        country: a.country,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
      }
    })

    const elections = Array.from(new Map(aspirants.map((a) => [a.election.id, { id: a.election.id, title: a.election.title }])).values())
    const positions = Array.from(new Map(aspirants.map((a) => [a.position.id, { id: a.position.id, positionTitle: a.position.positionTitle, positionLevel: a.position.positionLevel }])).values())

    return NextResponse.json({ aspirants: list, elections, positions })
  } catch (error: unknown) {
    console.error('Error fetching aspirants:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch aspirants' },
      { status: 500 }
    )
  }
}
