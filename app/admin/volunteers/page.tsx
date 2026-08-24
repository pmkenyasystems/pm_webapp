'use client'

import { useState, useEffect } from 'react'
import AdminHeader from '@/components/admin/AdminHeader'

interface VolunteerItem {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  idNumber: string | null
  address: string | null
  county: string | null
  skills: string | null
  availability: string | null
  motivation: string | null
  isMember: boolean
  memberId: number | null
  member: { id: number; idNumber: string; name: string } | null
  status: string
  createdAt: string
  updatedAt: string
}

export default function AdminVolunteersPage() {
  const [volunteers, setVolunteers] = useState<VolunteerItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    fetchVolunteers()
  }, [statusFilter])

  const fetchVolunteers = async () => {
    try {
      setLoading(true)
      setError('')
      const params = new URLSearchParams()
      if (statusFilter) params.append('status', statusFilter)
      const response = await fetch(`/api/admin/volunteers?${params.toString()}`)
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to fetch volunteers')
      setVolunteers(data.volunteers || [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load volunteers')
      setVolunteers([])
    } finally {
      setLoading(false)
    }
  }

  if (loading && volunteers.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader title="Volunteers" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="p-8 text-center text-gray-600">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader title="Volunteers" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <div className="bg-white rounded-[10px] border border-gray-200 p-6 mb-6">
          <div className="flex flex-wrap items-end gap-4">
            <div className="w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              >
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            {statusFilter && (
              <button
                type="button"
                onClick={() => setStatusFilter('')}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
              >
                Clear filter
              </button>
            )}
          </div>
        </div>

        {volunteers.length === 0 ? (
          <div className="bg-white rounded-[10px] border border-gray-200 p-8 text-center">
            <p className="text-gray-500">No volunteers found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-[10px] border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <p className="text-sm text-gray-600">
                Total: {volunteers.length} volunteer{volunteers.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      County
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Availability
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Member
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Applied
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {volunteers.map((v) => (
                    <tr key={v.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {v.firstName} {v.lastName}
                        </div>
                        {v.idNumber && (
                          <div className="text-xs text-gray-500">ID: {v.idNumber}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{v.email}</div>
                        <div className="text-sm text-gray-500">{v.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {v.county || '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {v.availability || '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {v.isMember && v.member ? (
                          <span className="text-sm text-gray-900" title={v.member.idNumber}>
                            {v.member.name}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            v.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : v.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {v.status.charAt(0).toUpperCase() + v.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(v.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
