import Link from 'next/link'

interface Stats {
  members: number
  volunteers: number
  totalDonations: number
  donationCount: number
  articles: number
  aspirants: number
}

interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  href: string
  linkLabel: string
  icon: React.ReactNode
  iconBg: string
  iconColor: string
}

function StatCard({ label, value, sub, href, linkLabel, icon, iconBg, iconColor }: StatCardProps) {
  return (
    <div className="bg-white rounded-[10px] border border-gray-200 p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</p>
          <p className="font-heading font-extrabold text-[26px] text-primary-blue leading-none">{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-1.5">{sub}</p>}
        </div>
        <div className={`${iconBg} p-2.5 rounded-xl shrink-0`}>
          <span className={iconColor}>{icon}</span>
        </div>
      </div>
      <Link href={href} className="text-xs font-semibold text-primary-blue hover:text-primary-red transition inline-flex items-center gap-1">
        {linkLabel}
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  )
}

export default function DashboardStats({ stats }: { stats: Stats }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <StatCard
        label="Total Members"
        value={stats.members.toLocaleString()}
        href="/admin/members"
        linkLabel="View all members"
        iconBg="bg-blue-50"
        iconColor="text-primary-blue"
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        }
      />
      <StatCard
        label="Volunteers"
        value={stats.volunteers.toLocaleString()}
        href="/admin/volunteers"
        linkLabel="View volunteers"
        iconBg="bg-red-50"
        iconColor="text-primary-red"
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        }
      />
      <StatCard
        label="Total Donations"
        value={`KES ${stats.totalDonations.toLocaleString()}`}
        sub={`${stats.donationCount} transactions`}
        href="/admin/donations/cash"
        linkLabel="View reports"
        iconBg="bg-green-50"
        iconColor="text-green-600"
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
      <StatCard
        label="Articles"
        value={stats.articles.toLocaleString()}
        href="/admin/articles"
        linkLabel="Manage articles"
        iconBg="bg-purple-50"
        iconColor="text-purple-600"
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        }
      />
      <StatCard
        label="Aspirant Applications"
        value={stats.aspirants.toLocaleString()}
        href="/admin/aspirants"
        linkLabel="View applications"
        iconBg="bg-amber-50"
        iconColor="text-amber-600"
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        }
      />
    </div>
  )
}
