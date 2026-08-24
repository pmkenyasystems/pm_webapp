'use client'

import { useState, useEffect } from 'react'
import AdminHeader from '@/components/admin/AdminHeader'

interface CashDonation {
  id: string
  amount: number
  currency: string
  paymentMethod: string
  transactionId: string | null
  donorName: string | null
  donorEmail: string | null
  donorPhone: string | null
  status: string
  createdAt: string
  updatedAt: string
}

export default function AdminCashDonationsPage() {
  const [donations, setDonations] = useState<CashDonation[]>([])
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
      const response = await fetch(`/api/admin/donations/cash?${params.toString()}`)
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to fetch donations')
      setDonations(data.donations || [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load donations')
      setDonations([])
    } finally {
      setLoading(false)
    }
  }

  if (loading && donations.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader title="Cash Donations" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="p-8 text-center text-gray-600">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader title="Cash Donations" />

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
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
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
            <p className="text-gray-500">No cash donations found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-[10px] border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Total: {donations.length} donation{donations.length !== 1 ? 's' : ''}
              </p>
              <p className="text-sm font-medium text-gray-900">
                Sum (completed): {donations.reduce((s, d) => s + (d.status === 'completed' ? d.amount : 0), 0).toLocaleString()} {donations.length ? donations[0].currency : 'KES'}
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
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Transaction ID
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
                        <div className="text-sm font-medium text-gray-900">
                          {d.donorName || '—'}
                        </div>
                        {d.donorEmail && (
                          <div className="text-sm text-gray-500">{d.donorEmail}</div>
                        )}
                        {d.donorPhone && (
                          <div className="text-sm text-gray-500">{d.donorPhone}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {d.amount.toLocaleString()} {d.currency}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                        {d.paymentMethod}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                        {d.transactionId || '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            d.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : d.status === 'failed'
                              ? 'bg-red-100 text-red-800'
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
