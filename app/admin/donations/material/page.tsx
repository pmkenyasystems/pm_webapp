'use client'

import { useState, useEffect } from 'react'
import AdminHeader from '@/components/admin/AdminHeader'

interface MaterialDonationItem {
  id: string
  donorName: string
  donorEmail: string | null
  donorPhone: string | null
  description: string
  quantity: string | null
  status: string
  notes: string | null
  createdAt: string
  updatedAt: string
}

export default function AdminMaterialDonationsPage() {
  const [donations, setDonations] = useState<MaterialDonationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    fetchDonations()
  }, [statusFilter])

  const fetchDonations = async () => {
    try {
      setLoading(true)
      setError('')
      const params = new URLSearchParams()
      if (statusFilter) params.append('status', statusFilter)
      const response = await fetch(`/api/admin/donations/material?${params.toString()}`)
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to fetch material donations')
      setDonations(data.donations || [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load material donations')
      setDonations([])
    } finally {
      setLoading(false)
    }
  }

  if (loading && donations.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader title="Material Donations" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="p-8 text-center text-gray-600">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader title="Material Donations" />

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
                <option value="received">Received</option>
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

        {donations.length === 0 ? (
          <div className="bg-white rounded-[10px] border border-gray-200 p-8 text-center">
            <p className="text-gray-500">No material donations found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-[10px] border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <p className="text-sm text-gray-600">
                Total: {donations.length} donation{donations.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Donor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {donations.map((d) => (
                    <tr key={d.id}>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{d.donorName}</div>
                        {d.donorEmail && (
                          <div className="text-sm text-gray-500">{d.donorEmail}</div>
                        )}
                        {d.donorPhone && (
                          <div className="text-sm text-gray-500">{d.donorPhone}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{d.description}</div>
                        {d.notes && (
                          <div className="text-xs text-gray-500 mt-1">{d.notes}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {d.quantity || '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            d.status === 'received'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {d.status.charAt(0).toUpperCase() + d.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(d.createdAt).toLocaleString()}
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
