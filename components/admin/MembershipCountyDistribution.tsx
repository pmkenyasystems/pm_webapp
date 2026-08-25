'use client'

import CountyChoroplethMap from './CountyChoroplethMap'
import RankedBarList from './RankedBarList'

interface Props {
  byCounty: { countyCode: number; county: string; count: number }[]
}

export default function MembershipCountyDistribution({ byCounty }: Props) {
  const sortedByCount = [...byCounty].sort((a, b) => b.count - a.count)

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4">
      <div className="font-bold text-[15px] mb-1">Membership Distribution by County</div>
      <p className="text-[13px] text-gray-500 mb-3.5">
        Darker counties have more registered members. Hover a county for the exact count.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5 items-start">
        <CountyChoroplethMap data={byCounty} valueLabel="Members" />
        <div>
          <div className="text-xs font-bold text-gray-500 uppercase mb-2.5">County Breakdown</div>
          <RankedBarList
            emptyLabel="No county data yet."
            items={sortedByCount.map((c) => ({ label: c.county, count: c.count }))}
          />
        </div>
      </div>
    </div>
  )
}
