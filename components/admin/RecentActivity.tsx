import { prisma } from '@/lib/prisma'

async function getRecentActivity() {
  const [recentDonations, recentVolunteers, recentMembers] = await Promise.all([
    prisma.donation.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.volunteer.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.member.findMany({
      orderBy: { profileCreatedAt: 'desc' },
      take: 5,
    }),
  ])

  return { recentDonations, recentVolunteers, recentMembers }
}

export default async function RecentActivity() {
  const { recentDonations, recentVolunteers, recentMembers } = await getRecentActivity()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Donations</h3>
        <div className="space-y-3">
          {recentDonations.length > 0 ? (
            recentDonations.map((donation) => (
              <div key={donation.id} className="flex justify-between items-center text-sm">
                <div>
                  <p className="font-medium text-gray-900">KES {donation.amount.toLocaleString()}</p>
                  <p className="text-gray-500">{donation.paymentMethod}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  donation.status === 'completed' ? 'bg-green-100 text-green-800' :
                  donation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {donation.status}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No recent donations</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Volunteers</h3>
        <div className="space-y-3">
          {recentVolunteers.length > 0 ? (
            recentVolunteers.map((volunteer) => (
              <div key={volunteer.id} className="text-sm">
                <p className="font-medium text-gray-900">
                  {volunteer.firstName} {volunteer.lastName}
                </p>
                <p className="text-gray-500">{volunteer.email}</p>
                <span className={`inline-block mt-1 px-2 py-1 rounded text-xs ${
                  volunteer.status === 'approved' ? 'bg-green-100 text-green-800' :
                  volunteer.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {volunteer.status}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No recent volunteers</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Members</h3>
        <div className="space-y-3">
          {recentMembers.length > 0 ? (
            recentMembers.map((member) => (
              <div key={member.id} className="text-sm">
                <p className="font-medium text-gray-900">
                  {member.firstName} {member.lastName}
                </p>
                <p className="text-gray-500">{member.county || 'N/A'}</p>
                <span className={`inline-block mt-1 px-2 py-1 rounded text-xs ${
                  member.status === 'active' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {member.status}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No recent members</p>
          )}
        </div>
      </div>
    </div>
  )
}

