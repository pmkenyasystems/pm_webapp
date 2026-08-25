'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminHeader from '@/components/admin/AdminHeader'
import CountyChoroplethMap from '@/components/admin/CountyChoroplethMap'
import RankedBarList from '@/components/admin/RankedBarList'
import PageLoader from '@/components/PageLoader'

interface Analytics {
  totals: { total: number; pending: number; approved: number; rejected: number }
  byStatus: { status: number; label: string; count: number; pct: number }[]
  byCounty: { countyCode: number | null; county: string; count: number }[]
  byPosition: { position: string; level: string; count: number }[]
  byPositionLevel: { level: string; count: number }[]
  monthlyTrend: { label: string; count: number }[]
}

const LEVEL_COLORS: Record<string, string> = {
  National: 'bg-primary-blue',
  County: 'bg-violet-500',
  Constituency: 'bg-teal-500',
  Ward: 'bg-fuchsia-500',
}
const levelColor = (level: string) => LEVEL_COLORS[level] ?? 'bg-gray-400'

function StatTile({ label, value, textClass }: { label: string; value: number | string; textClass?: string }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4">
      <div className="text-xs font-semibold text-gray-500">{label}</div>
      <div className={`font-heading font-extrabold text-2xl mt-1.5 ${textClass ?? 'text-primary-blue'}`}>{value}</div>
    </div>
  )
}

export default function ElectionsDashboardPage() {
  const [data, setData] = useState<Analytics | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/aspirants/analytics')
      .then((res) => res.json().then((body) => ({ ok: res.ok, body })))
      .then(({ ok, body }) => {
        if (!ok) throw new Error(body.error || 'Failed to load analytics')
        setData(body)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader title="Elections Board — Dashboard">
        <Link
          href="/admin/aspirants"
          className="text-sm font-semibold text-primary-blue hover:text-primary-red transition"
        >
          View Aspirants →
        </Link>
      </AdminHeader>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-5 text-sm">{error}</div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <PageLoader size="md" />
          </div>
        ) : data ? (
          <div className="space-y-5">
            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
              <StatTile label="Total Aspirants" value={data.totals.total} />
              <StatTile label="Pending Review" value={data.totals.pending} textClass="text-amber-600" />
              <StatTile label="Approved" value={data.totals.approved} textClass="text-green-600" />
              <StatTile label="Rejected" value={data.totals.rejected} textClass="text-red-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Position vying for */}
              <div className="bg-white border border-gray-100 rounded-xl p-4">
                <div className="font-bold text-[15px] mb-3.5">Positions Vying For</div>
                <RankedBarList
                  emptyLabel="No position data yet."
                  items={data.byPosition.map((p) => ({ label: p.position, sublabel: p.level, count: p.count }))}
                />
              </div>

              {/* Position level breakdown */}
              <div className="bg-white border border-gray-100 rounded-xl p-4">
                <div className="font-bold text-[15px] mb-3.5">By Position Level</div>
                {data.byPositionLevel.length === 0 ? (
                  <p className="text-sm text-gray-400 py-3">No data yet.</p>
                ) : (
                  <div className="space-y-3">
                    {data.byPositionLevel.map((l) => {
                      const max = Math.max(...data.byPositionLevel.map((x) => x.count), 1)
                      return (
                        <div key={l.level}>
                          <div className="flex justify-between text-[13px] mb-1">
                            <span className="font-semibold text-gray-800">{l.level}</span>
                            <span className="font-bold text-gray-900">{l.count}</span>
                          </div>
                          <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                            <div className={`h-full rounded-full ${levelColor(l.level)}`} style={{ width: `${Math.max((l.count / max) * 100, 3)}%` }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Distribution by county — map */}
            <div className="bg-white border border-gray-100 rounded-xl p-4">
              <div className="font-bold text-[15px] mb-1">Distribution by County</div>
              <p className="text-[13px] text-gray-500 mb-3.5">Darker counties have more aspirant applications. Hover a county for the exact count.</p>
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5 items-start">
                <CountyChoroplethMap
                  data={data.byCounty.filter((c) => c.countyCode != null).map((c) => ({ countyCode: c.countyCode as number, county: c.county, count: c.count }))}
                  valueLabel="Aspirants"
                />
                <div>
                  <div className="text-xs font-bold text-gray-500 uppercase mb-2.5">County Breakdown</div>
                  <RankedBarList
                    emptyLabel="No county data yet."
                    items={data.byCounty.map((c) => ({ label: c.county, count: c.count }))}
                  />
                </div>
              </div>
            </div>

          </div>
        ) : null}
      </div>
    </div>
  )
}
