'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminHeader from '@/components/admin/AdminHeader'
import CountyChoroplethMap from '@/components/admin/CountyChoroplethMap'
import PageLoader from '@/components/PageLoader'

interface Analytics {
  totals: { total: number; pending: number; approved: number; rejected: number }
  byStatus: { status: number; label: string; count: number; pct: number }[]
  byCounty: { countyCode: number | null; county: string; count: number }[]
  byPosition: { position: string; level: string; count: number }[]
  byPositionLevel: { level: string; count: number }[]
  byElection: { id: string; title: string; isActive: boolean; count: number }[]
  monthlyTrend: { label: string; count: number }[]
  unpaidAspirants: { total: number; items: { id: string; name: string; election: string; position: string; county: string; status: number }[] }
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

function RankedBarList({
  items,
  emptyLabel,
  maxRows = 25,
}: {
  items: { label: string; count: number; sublabel?: string }[]
  emptyLabel: string
  maxRows?: number
}) {
  if (items.length === 0) {
    return <p className="text-sm text-gray-400 py-3">{emptyLabel}</p>
  }
  const max = Math.max(...items.map((i) => i.count), 1)
  const visible = items.slice(0, maxRows)
  return (
    <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
      {visible.map((item) => (
        <div key={item.label} className="grid grid-cols-[1fr_auto] gap-3 items-center">
          <div>
            <div className="flex justify-between items-baseline gap-2 mb-1">
              <span className="text-[13px] font-semibold text-gray-800 truncate">{item.label}</span>
              {item.sublabel && <span className="text-[11px] text-gray-400 whitespace-nowrap">{item.sublabel}</span>}
            </div>
            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary-blue"
                style={{ width: `${Math.max((item.count / max) * 100, 3)}%` }}
              />
            </div>
          </div>
          <div className="text-sm font-bold text-gray-900 tabular-nums w-8 text-right">{item.count}</div>
        </div>
      ))}
      {items.length > maxRows && (
        <p className="text-xs text-gray-400 pt-1">+ {items.length - maxRows} more</p>
      )}
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

            {/* By election */}
            <div className="bg-white border border-gray-100 rounded-xl p-4">
              <div className="font-bold text-[15px] mb-3.5">By Election</div>
              <RankedBarList
                emptyLabel="No election data yet."
                items={data.byElection.map((e) => ({ label: e.title, sublabel: e.isActive ? 'Active' : 'Closed', count: e.count }))}
                maxRows={8}
              />
            </div>

            {/* Governance flag */}
            {data.unpaidAspirants.total > 0 && (
              <div className="bg-white border border-gray-100 rounded-xl p-4 overflow-x-auto">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                  <div className="font-bold text-[15px]">Aspirants Without an Active Subscription</div>
                  <span className="text-[11.5px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700">
                    {data.unpaidAspirants.total} flagged
                  </span>
                </div>
                <p className="text-[13px] text-gray-500 mb-3.5">
                  Not-yet-rejected aspirants whose membership subscription isn't currently active — worth a check before approval.
                </p>
                <div className="min-w-[480px]">
                  <div className="grid grid-cols-4 text-xs font-bold text-gray-500 uppercase pb-2.5 border-b border-gray-100">
                    <div>Name</div><div>Election</div><div>Position</div><div>County</div>
                  </div>
                  {data.unpaidAspirants.items.map((u) => (
                    <div key={u.id} className="grid grid-cols-4 text-[13.5px] py-2.5 border-b border-gray-50 items-center">
                      <div className="font-semibold">{u.name}</div>
                      <div className="text-gray-500">{u.election}</div>
                      <div>{u.position}</div>
                      <div>{u.county}</div>
                    </div>
                  ))}
                </div>
                {data.unpaidAspirants.total > data.unpaidAspirants.items.length && (
                  <p className="text-xs text-gray-400 mt-3">
                    Showing {data.unpaidAspirants.items.length} of {data.unpaidAspirants.total}.{' '}
                    <Link href="/admin/aspirants" className="text-primary-blue font-semibold">View all in Aspirants →</Link>
                  </p>
                )}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}
