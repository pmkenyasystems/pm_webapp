import { prisma } from '@/lib/prisma'

async function getRecentActivity() {
  const [recentDonations, recentVolunteers, recentMembers] = await Promise.all([
    prisma.donation.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.volunteer.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.member.findMany({
      orderBy: { profileCreatedAt: 'desc' },
      take: 5,
      include: { county: true },
    }),
  ])
  return { recentDonations, recentVolunteers, recentMembers }
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    completed: 'bg-green-50 text-green-700',
    approved:  'bg-green-50 text-green-700',
    active:    'bg-green-50 text-green-700',
    pending:   'bg-amber-50 text-amber-700',
    failed:    'bg-red-50 text-red-700',
    rejected:  'bg-red-50 text-red-700',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold capitalize ${map[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  )
}

export default async function RecentActivity() {
  const { recentDonations, recentVolunteers, recentMembers } = await getRecentActivity()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Recent Donations */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50">
          <h3 className="text-sm font-semibold text-gray-900">Recent Donations</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {recentDonations.length > 0 ? recentDonations.map((d) => (
            <div key={d.id} className="flex items-center justify-between px-5 py-3 gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900">KES {d.amount.toLocaleString()}</p>
                <p className="text-xs text-gray-400 capitalize">{d.paymentMethod}</p>
              </div>
              <StatusBadge status={d.status} />
            </div>
          )) : (
            <p className="px-5 py-4 text-xs text-gray-400">No recent donations</p>
          )}
        </div>
      </div>

      {/* Recent Volunteers */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50">
          <h3 className="text-sm font-semibold text-gray-900">Recent Volunteers</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {recentVolunteers.length > 0 ? recentVolunteers.map((v) => (
            <div key={v.id} className="flex items-center justify-between px-5 py-3 gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{v.firstName} {v.lastName}</p>
                <p className="text-xs text-gray-400 truncate">{v.email}</p>
              </div>
              <StatusBadge status={v.status} />
            </div>
          )) : (
            <p className="px-5 py-4 text-xs text-gray-400">No recent volunteers</p>
          )}
        </div>
      </div>

      {/* Recent Members */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50">
          <h3 className="text-sm font-semibold text-gray-900">Recent Members</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {recentMembers.length > 0 ? recentMembers.map((m) => (
            <div key={m.id} className="flex items-center justify-between px-5 py-3 gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{m.surname} {m.otherNames}</p>
                <p className="text-xs text-gray-400 truncate">{m.county?.countyName || 'N/A'}</p>
              </div>
              <StatusBadge status={m.status} />
            </div>
          )) : (
            <p className="px-5 py-4 text-xs text-gray-400">No recent members</p>
          )}
        </div>
      </div>
    </div>
  )
}
