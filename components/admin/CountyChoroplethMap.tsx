'use client'

import { useMemo, useState } from 'react'
import KenyaCountyMap from './KenyaCountyMap'

interface CountyValue {
  countyCode: number
  county: string
  count: number
}

interface Props {
  data: CountyValue[]
  valueLabel?: string
}

const NO_DATA_FILL = '#e5e7eb'
const RAMP_LIGHT = '#E6F2FF' // primary-light
const RAMP_DARK = '#003491' // primary-blue

function hexToRgb(hex: string) {
  const n = parseInt(hex.replace('#', ''), 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

function lerpColor(hexA: string, hexB: string, t: number) {
  const a = hexToRgb(hexA)
  const b = hexToRgb(hexB)
  const r = Math.round(a.r + (b.r - a.r) * t)
  const g = Math.round(a.g + (b.g - a.g) * t)
  const bl = Math.round(a.b + (b.b - a.b) * t)
  return `#${[r, g, bl].map((v) => v.toString(16).padStart(2, '0')).join('')}`
}

export default function CountyChoroplethMap({ data, valueLabel = 'Aspirants' }: Props) {
  const [hovered, setHovered] = useState<{ code: number; name: string } | null>(null)

  const byCode = useMemo(() => {
    const m: Record<number, CountyValue> = {}
    data.forEach((d) => {
      m[d.countyCode] = d
    })
    return m
  }, [data])

  const max = Math.max(1, ...data.map((d) => d.count))

  const colorFor = (count: number | undefined) => {
    if (!count) return NO_DATA_FILL
    const t = 0.15 + 0.85 * (count / max)
    return lerpColor(RAMP_LIGHT, RAMP_DARK, t)
  }

  const hoveredEntry = hovered ? byCode[hovered.code] : null
  const hoveredCount = hoveredEntry?.count ?? 0
  const hoveredName = hovered?.name ?? hoveredEntry?.county

  return (
    <div>
      <div className="relative w-full" style={{ maxWidth: 720, margin: '0 auto' }}>
        <KenyaCountyMap
          getFill={(code) => colorFor(byCode[code]?.count)}
          onHover={setHovered}
        />

        {hovered && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 px-4 py-2.5 bg-gray-900 text-white text-sm rounded-lg shadow-lg whitespace-nowrap pointer-events-none">
            <div className="font-semibold">{hoveredName}</div>
            <div className="text-gray-200">{hoveredCount} {valueLabel.toLowerCase()}</div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-4 mt-3 text-[11.5px] text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm inline-block" style={{ background: NO_DATA_FILL }} />
          None
        </span>
        <span className="flex items-center gap-2">
          <span>1</span>
          <span
            className="w-24 h-3 rounded-sm inline-block"
            style={{ background: `linear-gradient(to right, ${lerpColor(RAMP_LIGHT, RAMP_DARK, 0.15)}, ${RAMP_DARK})` }}
          />
          <span>{max}</span>
        </span>
      </div>
    </div>
  )
}
