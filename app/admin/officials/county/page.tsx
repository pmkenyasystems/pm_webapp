'use client'

import { useState, useEffect } from 'react'
import AdminHeader from '@/components/admin/AdminHeader'

const ROLES = [
  'Chairperson',
  'Secretary',
  'Treasurer',
  'Youth Representative',
  'Women Representative',
  'PWD Representative',
] as const

interface CountyOfficial {
  id: string
  role: string
  name: string | null
  email: string | null
  phone: string | null
  memberId: number | null
}

interface CountyWithOfficials {
  countyCode: number
  countyName: string
  officials: CountyOfficial[]
}

export default function AdminOfficialsCountyPage() {
  const [counties, setCounties] = useState<CountyWithOfficials[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expanded, setExpanded] = useState<Set<number>>(new Set())

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await fetch('/api/admin/officials/county')
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to fetch county officials')
      setCounties(data.counties || [])
      if ((data.counties?.length ?? 0) > 0) {
        setExpanded(new Set([data.counties[0].countyCode]))
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load data')
      setCounties([])
    } finally {
      setLoading(false)
    }
  }

  const toggleCounty = (countyCode: number) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(countyCode)) next.delete(countyCode)
      else next.add(countyCode)
      return next
    })
  }

  const getOfficialForRole = (officials: CountyOfficial[], role: string): CountyOfficial | null =>
    officials.find((o) => o.role === role) ?? null

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader title="Officials – County" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="p-8 text-center text-gray-600">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader title="Officials – County" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <p className="text-sm text-gray-600 mb-6">
          Each county has six official positions: Chairperson, Secretary, Treasurer, Youth Representative, Women Representative, PWD Representative.
        </p>

        {counties.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">No counties found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {counties.map((county) => {
              const isExpanded = expanded.has(county.countyCode)
              return (
                <div key={county.countyCode} className="bg-white rounded-lg shadow overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleCounty(county.countyCode)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition"
                  >
                    <h2 className="text-lg font-semibold text-gray-900">{county.countyName}</h2>
                    <svg
                      className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isExpanded && (
                    <div className="border-t border-gray-200 overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Position
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Contact
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {ROLES.map((role) => {
                            const official = getOfficialForRole(county.officials, role)
                            return (
                              <tr key={role}>
                                <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {role}
                                </td>
                                <td className="px-6 py-3 text-sm text-gray-900">
                                  {official?.name ?? '—'}
                                </td>
                                <td className="px-6 py-3 text-sm text-gray-500">
                                  {official?.email || official?.phone
                                    ? [official?.email, official?.phone].filter(Boolean).join(' · ')
                                    : '—'}
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
