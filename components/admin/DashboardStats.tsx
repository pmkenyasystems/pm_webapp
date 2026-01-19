import Link from 'next/link'

interface Stats {
  members: number
  volunteers: number
  totalDonations: number
  donationCount: number
  articles: number
  events: number
}

export default function DashboardStats({ stats }: { stats: Stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Total Members</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.members}</p>
          </div>
          <div className="bg-primary-blue bg-opacity-10 p-3 rounded-full">
            <svg className="w-8 h-8 text-primary-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
        <Link href="/admin/members" className="text-primary-blue text-sm mt-4 inline-block hover:underline">
          View all →
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Volunteers</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.volunteers}</p>
          </div>
          <div className="bg-primary-red bg-opacity-10 p-3 rounded-full">
            <svg className="w-8 h-8 text-primary-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
        <Link href="/admin/volunteers" className="text-primary-blue text-sm mt-4 inline-block hover:underline">
          View all →
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Total Donations</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              KES {stats.totalDonations.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-1">{stats.donationCount} donations</p>
          </div>
          <div className="bg-green-500 bg-opacity-10 p-3 rounded-full">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <Link href="/admin/donations" className="text-primary-blue text-sm mt-4 inline-block hover:underline">
          View reports →
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Articles</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.articles}</p>
          </div>
          <div className="bg-purple-500 bg-opacity-10 p-3 rounded-full">
            <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
        </div>
        <Link href="/admin/articles" className="text-primary-blue text-sm mt-4 inline-block hover:underline">
          Manage →
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Events</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.events}</p>
          </div>
          <div className="bg-orange-500 bg-opacity-10 p-3 rounded-full">
            <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <Link href="/admin/events" className="text-primary-blue text-sm mt-4 inline-block hover:underline">
          Manage →
        </Link>
      </div>
    </div>
  )
}

