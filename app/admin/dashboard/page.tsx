import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
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
      <AdminHeader title="Admin Dashboard" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardStats stats={stats} />
        <RecentActivity />
      </div>
    </div>
  )
}

