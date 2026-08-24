import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { isSuperAdmin } from '@/lib/permissions'

export const dynamic = 'force-dynamic'

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export async function GET() {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const superAdmin = await isSuperAdmin()
    if (!superAdmin) {
      return NextResponse.json(
        { error: 'Forbidden: The ERP overview is restricted to super admins' },
        { status: 403 }
      )
    }

    const now = new Date()
    const yearStart = new Date(now.getFullYear(), 0, 1)
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1)

    const [
      totalMembers,
      distinctCounties,
      totalCounties,
      totalConstituencies,
      totalWards,
      pendingAspirantsCount,
      pendingVolunteersCount,
      pendingAspirants,
      pendingVolunteers,
      recentMembers,
      donationsYtdAgg,
      subscriptionsYtdAgg,
      recentSubscriptions,
      recentDonations,
    ] = await Promise.all([
      prisma.member.count(),
      prisma.member.findMany({ where: { countyCode: { not: null } }, select: { countyCode: true }, distinct: ['countyCode'] }),
      prisma.county.count(),
      prisma.constituency.count(),
      prisma.ward.count(),
      prisma.aspirant.count({ where: { status: 0 } }),
      prisma.volunteer.count({ where: { status: 'pending' } }),
      prisma.aspirant.findMany({
        where: { status: 0 },
        orderBy: { createdAt: 'desc' },
        take: 6,
        select: { idNumber: true, fullName: true, createdAt: true, position: { select: { positionTitle: true } } },
      }),
      prisma.volunteer.findMany({
        where: { status: 'pending' },
        orderBy: { createdAt: 'desc' },
        take: 6,
        select: { firstName: true, lastName: true, createdAt: true },
      }),
      prisma.member.findMany({
        where: { profileCreatedAt: { gte: sixMonthsAgo } },
        select: { profileCreatedAt: true },
      }),
      prisma.donation.aggregate({ where: { status: 'completed', createdAt: { gte: yearStart } }, _sum: { amount: true } }),
      prisma.membershipSubscription.aggregate({ where: { status: 'completed', createdAt: { gte: yearStart } }, _sum: { amount: true } }),
      prisma.membershipSubscription.findMany({ orderBy: { createdAt: 'desc' }, take: 6 }),
      prisma.donation.findMany({ orderBy: { createdAt: 'desc' }, take: 6 }),
    ])

    const idNumbers = Array.from(new Set(pendingAspirants.map((a) => a.idNumber)))
    const aspirantMembers = idNumbers.length
      ? await prisma.member.findMany({ where: { idNumber: { in: idNumbers } }, select: { idNumber: true, surname: true, otherNames: true } })
      : []
    const memberNameByIdNumber = new Map(aspirantMembers.map((m) => [m.idNumber, `${m.surname} ${m.otherNames}`.trim()]))

    const approvals = [
      ...pendingAspirants.map((a) => ({
        name: `Aspirant application — ${a.fullName || memberNameByIdNumber.get(a.idNumber) || a.idNumber} (${a.position.positionTitle})`,
        type: 'Aspirant',
        createdAt: a.createdAt,
      })),
      ...pendingVolunteers.map((v) => ({
        name: `Volunteer application — ${v.firstName} ${v.lastName}`,
        type: 'Volunteer',
        createdAt: v.createdAt,
      })),
    ]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 6)
      .map(({ name, type }) => ({ name, type }))

    const chartBuckets: { label: string; count: number }[] = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      chartBuckets.push({ label: MONTH_LABELS[d.getMonth()], count: 0 })
    }
    for (const m of recentMembers) {
      const d = new Date(m.profileCreatedAt)
      const monthsAgo = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth())
      const idx = 5 - monthsAgo
      if (idx >= 0 && idx < 6) chartBuckets[idx].count++
    }

    const donationsYtd = donationsYtdAgg._sum.amount || 0
    const membershipFeesYtd = subscriptionsYtdAgg._sum.amount || 0

    const transactions = [
      ...recentSubscriptions.map((s) => ({
        date: s.createdAt,
        desc: `Membership subscription (${s.paymentMethod.toUpperCase()})`,
        type: 'Membership',
        amount: s.amount,
        currency: s.currency,
        status: s.status,
      })),
      ...recentDonations.map((d) => ({
        date: d.createdAt,
        desc: `Donation (${d.paymentMethod.toUpperCase()})`,
        type: 'Donation',
        amount: d.amount,
        currency: d.currency,
        status: d.status,
      })),
    ]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 8)

    return NextResponse.json({
      dashboard: {
        totalMembers,
        activeCounties: distinctCounties.length,
        totalCounties,
        donationsYtd,
        pendingApprovals: pendingAspirantsCount + pendingVolunteersCount,
        chart: chartBuckets,
        approvals,
      },
      orgCounts: {
        national: 1,
        county: totalCounties,
        constituency: totalConstituencies,
        ward: totalWards,
      },
      finance: {
        totalRevenueYtd: donationsYtd + membershipFeesYtd,
        membershipFeesYtd,
        donationsYtd,
        transactions,
      },
    })
  } catch (error: any) {
    console.error('Error fetching ERP stats:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch ERP stats' },
      { status: 500 }
    )
  }
}
