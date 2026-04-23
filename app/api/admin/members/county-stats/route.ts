import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { hasModuleAccess } from '@/lib/permissions'

export const dynamic = 'force-dynamic'

export interface CountyStat {
  countyCode: number
  countyName: string
  registeredVoters: number
  memberCount: number
}

export async function GET() {
  try {
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const hasAccess = await hasModuleAccess('members')
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have access to the Members module' },
        { status: 403 }
      )
    }

    const [counties, wardsWithCounty, membersByCounty] = await Promise.all([
      prisma.county.findMany({
        orderBy: { countyCode: 'asc' },
        select: { countyCode: true, countyName: true },
      }),
      prisma.ward.findMany({
        select: {
          registeredVoters: true,
          constituency: { select: { countyCode: true } },
        },
      }),
      prisma.member.findMany({
        where: { countyCode: { not: null } },
        select: { countyCode: true },
      }),
    ])

    const votersByCounty: Record<number, number> = {}
    for (const w of wardsWithCounty) {
      const code = w.constituency.countyCode
      votersByCounty[code] = (votersByCounty[code] ?? 0) + (w.registeredVoters ?? 0)
    }

    const memberCountByCountyCode: Record<number, number> = {}
    for (const m of membersByCounty) {
      if (m.countyCode == null) continue
      memberCountByCountyCode[m.countyCode] = (memberCountByCountyCode[m.countyCode] ?? 0) + 1
    }

    const stats: CountyStat[] = counties.map((c) => ({
      countyCode: c.countyCode,
      countyName: c.countyName,
      registeredVoters: votersByCounty[c.countyCode] ?? 0,
      memberCount: memberCountByCountyCode[c.countyCode] ?? 0,
    }))

    return NextResponse.json({ stats })
  } catch (error: unknown) {
    console.error('Error fetching county stats:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch county stats' },
      { status: 500 }
    )
  }
}
