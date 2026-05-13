import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const ROLE_ORDER = [
  'Chairperson',
  'Secretary',
  'Treasurer',
  'Youth Representative',
  'Women Representative',
  'PWD Representative',
]

export async function GET(request: NextRequest) {
  try {
    const countyCode = request.nextUrl.searchParams.get('countyCode')

    const where = countyCode ? { countyCode: parseInt(countyCode) } : {}

    const officials = await prisma.countyOfficial.findMany({
      where,
      include: {
        county: { select: { countyName: true } },
        member: { select: { surname: true, otherNames: true } },
      },
      orderBy: { countyCode: 'asc' },
    })

    const sorted = officials.sort(
      (a, b) => ROLE_ORDER.indexOf(a.role) - ROLE_ORDER.indexOf(b.role)
    )

    const result = sorted.map((o) => ({
      id: o.id,
      role: o.role,
      name: o.member
        ? `${o.member.surname} ${o.member.otherNames}`.trim()
        : o.name,
      countyCode: o.countyCode,
      countyName: o.county.countyName,
    }))

    return NextResponse.json({ officials: result })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch officials' }, { status: 500 })
  }
}
