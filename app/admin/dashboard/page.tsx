import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import DashboardStats from '@/components/admin/DashboardStats'
import RecentActivity from '@/components/admin/RecentActivity'
import Link from 'next/link'

async function getDashboardData() {
  const [members, volunteers, donations, articles, events] = await Promise.all([
    prisma.member.count(),
    prisma.volunteer.count(),
    prisma.donation.aggregate({
      _sum: { amount: true },
      _count: true,
    }),
    prisma.article.count(),
    prisma.event.count(),
  ])

  const totalDonations = donations._sum.amount || 0
  const donationCount = donations._count

  return {
    members,
    volunteers,
    totalDonations,
    donationCount,
    articles,
    events,
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
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="flex gap-4">
              <Link
                href="/admin/articles/new"
                className="bg-primary-blue text-white px-4 py-2 rounded-md hover:bg-[#002244] transition"
              >
                New Article
              </Link>
              <Link
                href="/admin/events/new"
                className="bg-primary-red text-white px-4 py-2 rounded-md hover:bg-[#9A162D] transition"
              >
                New Event
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardStats stats={stats} />
        <RecentActivity />
      </div>
    </div>
  )
}

