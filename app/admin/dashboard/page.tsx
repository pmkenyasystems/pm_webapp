import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'
import DashboardStats from '@/components/admin/DashboardStats'
import RecentActivity from '@/components/admin/RecentActivity'
import AdminHeader from '@/components/admin/AdminHeader'

async function getDashboardData() {
  const [members, volunteers, donations, articles, aspirants] = await Promise.all([
    prisma.member.count(),
    prisma.volunteer.count(),
    prisma.donation.aggregate({
      _sum: { amount: true },
      _count: true,
    }),
    prisma.article.count(),
    prisma.aspirant.count(),
  ])

  const totalDonations = donations._sum.amount || 0
  const donationCount = donations._count

  return {
    members,
    volunteers,
    totalDonations,
    donationCount,
    articles,
    aspirants,
  }
}

export default async function AdminDashboard() {
  const session = await getSession()

  if (!session) {
    redirect('/admin/login')
  }

  const stats = await getDashboardData()

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader title="Dashboard" />
      <div className="p-4 sm:p-6">
        <DashboardStats stats={stats} />
        <RecentActivity />
      </div>
    </div>
  )
}

