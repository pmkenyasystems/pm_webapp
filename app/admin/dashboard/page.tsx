import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { isSuperAdmin, hasModuleAccess } from '@/lib/permissions'
import DashboardStats from '@/components/admin/DashboardStats'
import RecentActivity from '@/components/admin/RecentActivity'
import AdminHeader from '@/components/admin/AdminHeader'
import Link from 'next/link'

async function getDashboardData() {
  const [members, volunteers, donations, articles, events, aspirants] = await Promise.all([
    prisma.member.count(),
    prisma.volunteer.count(),
    prisma.donation.aggregate({
      _sum: { amount: true },
      _count: true,
    }),
    prisma.article.count(),
    prisma.event.count(),
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
    events,
    aspirants,
  }
}

export default async function AdminDashboard() {
  const session = await getSession()
  
  if (!session) {
    redirect('/admin/login')
  }

  const stats = await getDashboardData()
  const superAdmin = await isSuperAdmin()
  
  // Check module access
  const [hasNewsAccess, hasEventsAccess, hasElectionsAccess, hasPositionsAccess] = await Promise.all([
    hasModuleAccess('news'),
    hasModuleAccess('events'),
    hasModuleAccess('elections'),
    hasModuleAccess('positions'),
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader title="Admin Dashboard">
        <div className="flex gap-4 flex-wrap">
          {hasNewsAccess && (
            <Link
              href="/admin/articles/new"
              className="bg-primary-blue text-white px-4 py-2 rounded-md hover:bg-[#002244] transition"
            >
              New Article
            </Link>
          )}
          {hasEventsAccess && (
            <Link
              href="/admin/events/new"
              className="bg-primary-red text-white px-4 py-2 rounded-md hover:bg-[#9A162D] transition"
            >
              New Event
            </Link>
          )}
          {hasElectionsAccess && (
            <Link
              href="/admin/elections"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
            >
              Manage Elections
            </Link>
          )}
          {hasPositionsAccess && (
            <Link
              href="/admin/positions"
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition"
            >
              Manage Positions
            </Link>
          )}
          {superAdmin && (
            <Link
              href="/admin/users"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
            >
              Manage Admins
            </Link>
          )}
          <Link
            href="/admin/settings"
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
          >
            Settings
          </Link>
        </div>
      </AdminHeader>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardStats stats={stats} />
        <RecentActivity />
      </div>
    </div>
  )
}

