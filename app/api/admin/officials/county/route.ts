import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { hasModuleAccess } from '@/lib/permissions'

export const dynamic = 'force-dynamic'

const COUNTY_OFFICIAL_ROLES = [
  'Chairperson',
  'Secretary',
  'Treasurer',
  'Youth Representative',
  'Women Representative',
  'PWD Representative',
] as const

export async function GET() {
  try {
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const hasAccess = await hasModuleAccess('positions')
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have access to the Officials module' },
        { status: 403 }
      )
    }

    const [counties, officials] = await Promise.all([
      prisma.county.findMany({
        orderBy: { countyName: 'asc' },
        select: { countyCode: true, countyName: true },
      }),
      prisma.countyOfficial.findMany({
        include: {
          member: {
            select: { id: true, surname: true, otherNames: true, email: true, phone: true },
          },
        },
        orderBy: [{ countyCode: 'asc' }, { role: 'asc' }],
      }),
    ])

    const officialsByCounty: Record<number, Array<{
      id: string
      role: string
      name: string | null
      email: string | null
      phone: string | null
      memberId: number | null
    }>> = {}
    counties.forEach((c) => { officialsByCounty[c.countyCode] = [] })
    officials.forEach((o) => {
      const name = o.member
        ? `${o.member.surname} ${o.member.otherNames}`.trim()
        : o.name
      if (!officialsByCounty[o.countyCode]) officialsByCounty[o.countyCode] = []
      officialsByCounty[o.countyCode].push({
        id: o.id,
        role: o.role,
        name: name || null,
        email: o.member?.email ?? o.email ?? null,
        phone: o.member?.phone ?? o.phone ?? null,
        memberId: o.memberId,
      })
    })

    return NextResponse.json({
      counties: counties.map((c) => ({
        countyCode: c.countyCode,
        countyName: c.countyName,
        officials: officialsByCounty[c.countyCode] ?? [],
      })),
      roles: [...COUNTY_OFFICIAL_ROLES],
    })
  } catch (error: unknown) {
    console.error('Error fetching county officials:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch county officials' },
      { status: 500 }
    )
  }
}
