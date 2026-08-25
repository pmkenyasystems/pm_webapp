import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'
import DashboardStats from '@/components/admin/DashboardStats'
import AdminHeader from '@/components/admin/AdminHeader'
import MembershipCountyDistribution from '@/components/admin/MembershipCountyDistribution'

async function getDashboardData() {
  const [members, volunteers, donations, articles, aspirants, counties, membersByCounty] = await Promise.all([
    prisma.member.count(),
    prisma.volunteer.count(),
    prisma.donation.aggregate({
      _sum: { amount: true },
      _count: true,
    }),
    prisma.article.count(),
    prisma.aspirant.count(),
    prisma.county.findMany({ orderBy: { countyCode: 'asc' }, select: { countyCode: true, countyName: true } }),
    prisma.member.groupBy({
      by: ['countyCode'],
      where: { countyCode: { not: null } },
      _count: true,
    }),
  ])

  const totalDonations = donations._sum.amount || 0
  const donationCount = donations._count

  const countByCountyCode = new Map(membersByCounty.map((m) => [m.countyCode, m._count]))
  const byCounty = counties.map((c) => ({
    countyCode: c.countyCode,
    county: c.countyName,
    count: countByCountyCode.get(c.countyCode) ?? 0,
  }))

  return {
    stats: {
      members,
      volunteers,
      totalDonations,
      donationCount,
      articles,
      aspirants,
    },
    byCounty,
  }
}

export default async function AdminDashboard() {
  const session = await getSession()

  if (!session) {
    redirect('/admin/login')
  }

  const { stats, byCounty } = await getDashboardData()

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader title="Dashboard" />
      <div className="p-4 sm:p-6 space-y-5">
        <DashboardStats stats={stats} />
        <MembershipCountyDistribution byCounty={byCounty} />
      </div>
    </div>
  )
}
