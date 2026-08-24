'use client'

import { useState } from 'react'
import { KENYA_COUNTY_PATHS, KENYA_MAP_VIEWBOX } from '@/lib/geo/kenya-county-paths'

interface KenyaCountyMapProps {
  /** Fill color for a county, keyed by its IEBC county code (1–47). Defaults to a neutral gray. */
  getFill?: (code: number, name: string) => string
  /** Stroke color for county borders. Defaults to white. */
  stroke?: string
  /** Currently selected county code, if any — rendered with a bolder outline. */
  selected?: number | null
  /** Called on hover with the county's code/name, or null on mouse-leave. */
  onHover?: (county: { code: number; name: string } | null) => void
  /** Called on click with the county's code/name. */
  onSelect?: (county: { code: number; name: string }) => void
  className?: string
}

const DEFAULT_FILL = '#e5e7eb'

/**
 * Interactive Kenya county map: one <path> per county (IEBC codes 1–47), each independently
 * styleable, hoverable, and clickable — for choropleths (population, votes, revenue, etc.) or
 * plain county selection.
 */
export default function KenyaCountyMap({
  getFill,
  stroke = '#ffffff',
  selected = null,
  onHover,
  onSelect,
  className,
}: KenyaCountyMapProps) {
  const [hoveredCode, setHoveredCode] = useState<number | null>(null)

  return (
    <svg
      viewBox={KENYA_MAP_VIEWBOX}
      role="img"
      aria-label="Map of Kenya by county"
      className={className}
      style={{ width: '100%', height: 'auto', display: 'block' }}
    >
      {KENYA_COUNTY_PATHS.map((county) => {
        const isHovered = hoveredCode === county.code
        const isSelected = selected === county.code
        const fill = getFill ? getFill(county.code, county.name) : DEFAULT_FILL
        return (
          <path
            key={county.code}
            id={`county-${county.code}`}
            data-county-code={county.code}
            data-county-name={county.name}
            d={county.d}
            fill={fill}
            stroke={isSelected ? '#111827' : stroke}
            strokeWidth={isSelected ? 1.6 : 0.6}
            opacity={isHovered ? 0.85 : 1}
            style={{ cursor: onSelect ? 'pointer' : 'default', transition: 'opacity 120ms ease' }}
            onMouseEnter={() => {
              setHoveredCode(county.code)
              onHover?.({ code: county.code, name: county.name })
            }}
            onMouseLeave={() => {
              setHoveredCode(null)
              onHover?.(null)
            }}
            onClick={() => onSelect?.({ code: county.code, name: county.name })}
          >
            <title>{county.name}</title>
          </path>
        )
      })}
    </svg>
  )
}
