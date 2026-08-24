import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { hasModuleAccess } from '@/lib/permissions'

export const dynamic = 'force-dynamic'

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const STATUS_LABELS: Record<number, string> = { 0: 'Pending', 1: 'Approved', 2: 'Rejected' }
// Position.positionLevel is stored as either the word ("National") or a legacy numeric code ("1"-"4") depending on how the row was created.
const POSITION_LEVEL_LABELS: Record<string, string> = { '1': 'National', '2': 'County', '3': 'Constituency', '4': 'Ward' }
const levelLabel = (level: string) => POSITION_LEVEL_LABELS[level] ?? level

export async function GET() {
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

    const now = new Date()
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1)

    const aspirants = await prisma.aspirant.findMany({
      select: {
        id: true,
        idNumber: true,
        fullName: true,
        status: true,
        createdAt: true,
        county: { select: { countyCode: true, countyName: true } },
        position: { select: { id: true, positionTitle: true, positionLevel: true } },
        election: { select: { id: true, title: true, isActive: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    const total = aspirants.length
    const pending = aspirants.filter((a) => a.status === 0).length
    const approved = aspirants.filter((a) => a.status === 1).length
    const rejected = aspirants.filter((a) => a.status === 2).length

    const byStatus = [0, 1, 2].map((status) => {
      const count = aspirants.filter((a) => a.status === status).length
      return { status, label: STATUS_LABELS[status], count, pct: total > 0 ? Math.round((count / total) * 100) : 0 }
    })

    const countyMap = new Map<string, { countyCode: number | null; county: string; count: number }>()
    const positionMap = new Map<string, { title: string; level: string; count: number }>()
    const levelMap = new Map<string, number>()
    const electionMap = new Map<string, { title: string; isActive: boolean; count: number }>()

    for (const a of aspirants) {
      const countyKey = a.county ? String(a.county.countyCode) : 'unspecified'
      const countyEntry = countyMap.get(countyKey) ?? {
        countyCode: a.county?.countyCode ?? null,
        county: a.county?.countyName ?? 'Not specified',
        count: 0,
      }
      countyEntry.count++
      countyMap.set(countyKey, countyEntry)

      const level = levelLabel(a.position.positionLevel)
      const posKey = String(a.position.id)
      const posEntry = positionMap.get(posKey) ?? { title: a.position.positionTitle, level, count: 0 }
      posEntry.count++
      positionMap.set(posKey, posEntry)

      levelMap.set(level, (levelMap.get(level) ?? 0) + 1)

      const elEntry = electionMap.get(a.election.id) ?? { title: a.election.title, isActive: a.election.isActive, count: 0 }
      elEntry.count++
      electionMap.set(a.election.id, elEntry)
    }

    const byCounty = Array.from(countyMap.values()).sort((a, b) => b.count - a.count)

    const byPosition = Array.from(positionMap.values())
      .map((p) => ({ position: p.title, level: p.level, count: p.count }))
      .sort((a, b) => b.count - a.count)

    const LEVEL_ORDER = ['National', 'County', 'Constituency', 'Ward']
    const byPositionLevel = Array.from(levelMap.entries())
      .map(([level, count]) => ({ level, count }))
      .sort((a, b) => {
        const ai = LEVEL_ORDER.indexOf(a.level)
        const bi = LEVEL_ORDER.indexOf(b.level)
        if (ai === -1 && bi === -1) return b.count - a.count
        if (ai === -1) return 1
        if (bi === -1) return -1
        return ai - bi
      })

    const byElection = Array.from(electionMap.entries())
      .map(([id, e]) => ({ id, title: e.title, isActive: e.isActive, count: e.count }))
      .sort((a, b) => b.count - a.count)

    const monthlyBuckets: { label: string; count: number }[] = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      monthlyBuckets.push({ label: MONTH_LABELS[d.getMonth()], count: 0 })
    }
    for (const a of aspirants) {
      const d = new Date(a.createdAt)
      if (d < sixMonthsAgo) continue
      const monthsAgo = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth())
      const idx = 5 - monthsAgo
      if (idx >= 0 && idx < 6) monthlyBuckets[idx].count++
    }

    // Governance flag: non-rejected aspirants whose membership subscription isn't currently active
    const activeIdNumbers = Array.from(new Set(aspirants.filter((a) => a.status !== 2).map((a) => a.idNumber)))
    const members = activeIdNumbers.length
      ? await prisma.member.findMany({
          where: { idNumber: { in: activeIdNumbers } },
          select: {
            idNumber: true,
            surname: true,
            otherNames: true,
            subscriptions: { where: { status: 'completed', periodEnd: { gte: now } }, select: { id: true }, take: 1 },
          },
        })
      : []
    const paidIdNumbers = new Set(members.filter((m) => m.subscriptions.length > 0).map((m) => m.idNumber))
    const memberNameByIdNumber = new Map(members.map((m) => [m.idNumber, `${m.surname} ${m.otherNames}`.trim()]))

    const unpaidItems = aspirants
      .filter((a) => a.status !== 2 && !paidIdNumbers.has(a.idNumber))
      .map((a) => ({
        id: a.id,
        name: a.fullName || memberNameByIdNumber.get(a.idNumber) || a.idNumber,
        election: a.election.title,
        position: a.position.positionTitle,
        county: a.county?.countyName ?? 'Not specified',
        status: a.status,
      }))

    return NextResponse.json({
      totals: { total, pending, approved, rejected },
      byStatus,
      byCounty,
      byPosition,
      byPositionLevel,
      byElection,
      monthlyTrend: monthlyBuckets,
      unpaidAspirants: { total: unpaidItems.length, items: unpaidItems.slice(0, 15) },
    })
  } catch (error: any) {
    console.error('Error fetching aspirant analytics:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch aspirant analytics' },
      { status: 500 }
    )
  }
}
