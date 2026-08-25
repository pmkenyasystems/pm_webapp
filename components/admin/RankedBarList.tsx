interface RankedBarListProps {
  items: { label: string; count: number; sublabel?: string }[]
  emptyLabel: string
  maxRows?: number
}

export default function RankedBarList({ items, emptyLabel, maxRows = 25 }: RankedBarListProps) {
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
