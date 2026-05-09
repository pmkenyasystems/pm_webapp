'use client'

import { useState, useEffect } from 'react'
import type { NationalLeader } from '@/lib/national-leadership'

type County = { countyCode: number; countyName: string }
type Official = { id: string; role: string; name: string | null; countyName: string }

const ROLE_ICONS: Record<string, string> = {
  'Chairperson': '👑',
  'Secretary': '📋',
  'Treasurer': '💰',
  'Youth Representative': '🌱',
  'Women Representative': '🌸',
  'PWD Representative': '♿',
}


function NationalLeaderCard({ leader }: { leader: NationalLeader }) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col items-center text-center">
      {leader.profileImage ? (
        <img
          src={leader.profileImage}
          alt={leader.position}
          className="w-24 h-24 rounded-full object-cover mb-4 ring-4 ring-primary-blue/10"
        />
      ) : (
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-blue/20 to-primary-blue/5 flex items-center justify-center mb-4 ring-4 ring-primary-blue/10">
          <svg className="w-10 h-10 text-primary-blue/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      )}
      <p className="text-sm font-semibold text-primary-blue mt-1">{leader.position}</p>
    </div>
  )
}

function OfficialCard({ official }: { official: Official }) {
  const icon = ROLE_ICONS[official.role] ?? '👤'
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col items-center text-center">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-blue/20 to-primary-blue/5 flex items-center justify-center mb-4 ring-4 ring-primary-blue/10">
        {official.name ? (
          <span className="text-2xl font-bold text-primary-blue">{official.name.charAt(0)}</span>
        ) : (
          <span className="text-2xl">{icon}</span>
        )}
      </div>
      <h3 className="text-base font-bold text-gray-900">{official.name ?? 'Vacant'}</h3>
      <div className="flex items-center gap-1.5 mt-1">
        <span className="text-base">{icon}</span>
        <p className="text-sm text-primary-blue font-medium">{official.role}</p>
      </div>
    </div>
  )
}

export default function LeadershipTabs({
  nationalLeaders,
  counties,
}: {
  nationalLeaders: NationalLeader[]
  counties: County[]
}) {
  const [tab, setTab] = useState<'national' | 'county'>('national')
  const [selectedCounty, setSelectedCounty] = useState<number | null>(null)
  const [officials, setOfficials] = useState<Official[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (tab !== 'county' || !selectedCounty) return
    setLoading(true)
    fetch(`/api/locations/county-officials?countyCode=${selectedCounty}`)
      .then((r) => r.json())
      .then((data) => setOfficials(data.officials ?? []))
      .finally(() => setLoading(false))
  }, [selectedCounty, tab])

  return (
    <div>
      {/* Tab switcher */}
      <div className="flex gap-2 mb-8 bg-gray-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setTab('national')}
          className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
            tab === 'national'
              ? 'bg-white text-primary-blue shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
            </svg>
            National Leadership
          </span>
        </button>
        <button
          onClick={() => setTab('county')}
          className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
            tab === 'county'
              ? 'bg-white text-primary-blue shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            County Leadership
          </span>
        </button>
      </div>

      {/* National Leadership */}
      {tab === 'national' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {nationalLeaders.map((leader) => (
            <NationalLeaderCard key={leader.position} leader={leader} />
          ))}
        </div>
      )}

      {/* County Leadership */}
      {tab === 'county' && (
        <div>
          {/* County selector */}
          <div className="mb-8 max-w-sm">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select County
            </label>
            <select
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              value={selectedCounty ?? ''}
              onChange={(e) => {
                setOfficials([])
                setSelectedCounty(e.target.value ? parseInt(e.target.value) : null)
              }}
            >
              <option value="">— Choose a county —</option>
              {counties.map((c) => (
                <option key={c.countyCode} value={c.countyCode}>
                  {c.countyName}
                </option>
              ))}
            </select>
          </div>

          {/* Officials grid */}
          {!selectedCounty && (
            <div className="text-center py-16 text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-sm">Select a county above to view its leadership</p>
            </div>
          )}

          {selectedCounty && loading && (
            <div className="text-center py-16 text-gray-400">
              <svg className="w-8 h-8 mx-auto animate-spin mb-3 text-primary-blue" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              <p className="text-sm">Loading leaders…</p>
            </div>
          )}

          {selectedCounty && !loading && officials.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-sm">No county leaders have been appointed yet for this county.</p>
            </div>
          )}

          {selectedCounty && !loading && officials.length > 0 && (
            <>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                {officials[0]?.countyName} County — Party Leadership
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {officials.map((o) => (
                  <OfficialCard key={o.id} official={o} />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
