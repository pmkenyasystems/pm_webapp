'use client'

import { useState, useEffect } from 'react'
import AdminHeader from '@/components/admin/AdminHeader'

interface AspirantItem {
  id: string
  idNumber: string
  memberName: string | null
  election: { id: string; title: string; electionDate: string }
  position: { id: number; positionTitle: string; positionLevel: string }
  county: string | null
  constituency: string | null
  ward: string | null
  status: number
  country: string
  createdAt: string
  updatedAt: string
}

const ASPIRANT_STATUS: Record<number, { label: string; className: string }> = {
  0: { label: 'Pending',  className: 'bg-amber-100 text-amber-800' },
  1: { label: 'Approved', className: 'bg-green-100 text-green-800' },
  2: { label: 'Rejected', className: 'bg-red-100 text-red-800' },
}

interface ElectionOption {
  id: string
  title: string
}

interface PositionOption {
  id: number
  positionTitle: string
  positionLevel: string
}

const POSITION_LEVEL_LABELS: Record<string, string> = {
  '1': 'National',
  '2': 'County',
  '3': 'Constituency',
  '4': 'Ward',
}
const positionLevelLabel = (level: string) => POSITION_LEVEL_LABELS[level] ?? level

export default function AdminAspirantsPage() {
  const [aspirants, setAspirants] = useState<AspirantItem[]>([])
  const [elections, setElections] = useState<ElectionOption[]>([])
  const [positions, setPositions] = useState<PositionOption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    status: '',
    electionId: '',
    positionId: '',
  })

  useEffect(() => {
    fetchAspirants()
  }, [filters])

  const fetchAspirants = async () => {
    try {
      setLoading(true)
      setError('')
      const params = new URLSearchParams()
      if (filters.status) params.append('status', filters.status)
      if (filters.electionId) params.append('electionId', filters.electionId)
      if (filters.positionId) params.append('positionId', filters.positionId)
      const response = await fetch(`/api/admin/aspirants?${params.toString()}`)
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to fetch aspirants')
      setAspirants(data.aspirants || [])
      setElections(data.elections || [])
      setPositions(data.positions || [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load aspirants')
      setAspirants([])
      setElections([])
      setPositions([])
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  if (loading && aspirants.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader title="Aspirant Applications" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="p-8 text-center text-gray-600">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader title="Aspirant Applications" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              >
                <option value="">All</option>
                <option value="0">Pending</option>
                <option value="1">Approved</option>
                <option value="2">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Election</label>
              <select
                value={filters.electionId}
                onChange={(e) => handleFilterChange('electionId', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              >
                <option value="">All elections</option>
                {elections.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
              <select
                value={filters.positionId}
                onChange={(e) => handleFilterChange('positionId', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              >
                <option value="">All positions</option>
                {positions.map((p) => (
                  <option key={p.id} value={String(p.id)}>
                    {p.positionTitle} ({positionLevelLabel(p.positionLevel)})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => setFilters({ status: '', electionId: '', positionId: '' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
              >
                Clear filters
              </button>
            </div>
          </div>
        </div>

        {aspirants.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">No aspirant applications found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <p className="text-sm text-gray-600">
                Total: {aspirants.length} application{aspirants.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applicant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Election
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Area
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applied
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {aspirants.map((a) => (
                    <tr key={a.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {a.memberName || a.idNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {a.idNumber}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{a.election.title}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(a.election.electionDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{a.position.positionTitle}</div>
                        <div className="text-xs text-gray-500">{positionLevelLabel(a.position.positionLevel)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {[a.county, a.constituency, a.ward].filter(Boolean).join(' · ') || '—'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            (ASPIRANT_STATUS[a.status] ?? ASPIRANT_STATUS[0]).className
                          }`}
                        >
                          {(ASPIRANT_STATUS[a.status] ?? ASPIRANT_STATUS[0]).label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(a.createdAt).toLocaleDateString()}
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
