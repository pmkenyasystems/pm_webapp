'use client'

import { useState, useEffect, useMemo } from 'react'
import dynamic from 'next/dynamic'
import AdminHeader from '@/components/admin/AdminHeader'

const ComposableMap = dynamic(() => import('react-simple-maps').then((m) => m.ComposableMap), { ssr: false })
const Geographies = dynamic(() => import('react-simple-maps').then((m) => m.Geographies), { ssr: false })
const Geography = dynamic(() => import('react-simple-maps').then((m) => m.Geography), { ssr: false })

interface CountyStat {
  countyCode: number
  countyName: string
  registeredVoters: number
  memberCount: number
}

export default function MembersMapViewPage() {
  const [stats, setStats] = useState<CountyStat[]>([])
  const [geography, setGeography] = useState<{ type: string; features: unknown[] } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [hovered, setHovered] = useState<number | null>(null)
  const [tooltipStat, setTooltipStat] = useState<CountyStat | null>(null)

  const statsByCode = useMemo(() => {
    const m: Record<number, CountyStat> = {}
    stats.forEach((s) => { m[s.countyCode] = s })
    return m
  }, [stats])

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [statsRes, geoRes] = await Promise.all([
          fetch('/api/admin/members/county-stats'),
          fetch('/geojson/kenya-counties.json'),
        ])
        if (cancelled) return
        if (!statsRes.ok) {
          const data = await statsRes.json().catch(() => ({}))
          throw new Error(data.error || 'Failed to load county stats')
        }
        const statsData = await statsRes.json()
        setStats(statsData.stats || [])
        if (geoRes.ok) {
          const geo = await geoRes.json()
          setGeography(geo)
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load data')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader title="Members – Map View" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="p-8 text-center text-gray-600">Loading map...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader title="Members – Map View" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader title="Members – Map View" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-sm text-gray-600 mb-4">
          Hover over a county to see total registered voters (IEBC) and total party members.
        </p>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          {geography ? (
            <div className="relative w-full" style={{ maxWidth: 800, margin: '0 auto' }}>
              <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                  center: [37.9, 0.2],
                  scale: 2200,
                }}
                width={800}
                height={600}
                style={{ width: '100%', height: 'auto', maxHeight: 600 }}
              >
                <Geographies geography={geography}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const code = geo.properties?.countyCode as number | undefined
                      const stat = code != null ? statsByCode[code] : null
                      const isHovered = hovered === code
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={isHovered ? '#1e3a5f' : '#2563eb'}
                          stroke="#fff"
                          strokeWidth={0.5}
                          style={{
                            default: { outline: 'none' },
                            hover: { outline: 'none', cursor: 'pointer' },
                            pressed: { outline: 'none' },
                          }}
                          onMouseEnter={() => {
                            setHovered(code ?? null)
                            if (stat) setTooltipStat(stat)
                          }}
                          onMouseLeave={() => {
                            setHovered(null)
                            setTooltipStat(null)
                          }}
                        />
                      )
                    })
                  }
                </Geographies>
              </ComposableMap>
              {tooltipStat && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 px-4 py-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg">
                  <div className="font-semibold">{tooltipStat.countyName}</div>
                  <div>Registered voters (IEBC): {tooltipStat.registeredVoters.toLocaleString()}</div>
                  <div>Party members: {tooltipStat.memberCount.toLocaleString()}</div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              GeoJSON not found. Ensure public/geojson/kenya-counties.json exists.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
