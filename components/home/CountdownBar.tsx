'use client'

import { useEffect, useState } from 'react'
import { getTimeLeft } from '@/lib/election-countdown'

export default function CountdownBar() {
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeLeft>>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setTimeLeft(getTimeLeft())
    const interval = setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => clearInterval(interval)
  }, [])

  const units = [
    { label: 'Days', value: timeLeft?.days ?? 0 },
    { label: 'Hours', value: timeLeft?.hours ?? 0 },
    { label: 'Mins', value: timeLeft?.minutes ?? 0 },
    { label: 'Secs', value: timeLeft?.seconds ?? 0 },
  ]

  return (
    <section className="py-[18px] md:py-[22px] bg-primary-blue text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row flex-wrap items-center justify-between gap-[18px] text-center md:text-left">
        <div>
          <span className="block font-heading font-bold tracking-[2px] text-[12.5px] uppercase mb-2">
            Countdown To The Polls
          </span>
          <div className="font-heading font-extrabold text-base md:text-[22px] uppercase">
            2027 General Election &middot; 10th August 2027
          </div>
        </div>
        <div className="flex gap-2 md:gap-3.5">
          {units.map((u) => (
            <div
              key={u.label}
              className="text-center bg-white rounded-[10px] px-2 py-2 md:px-4 md:py-3 min-w-[58px] md:min-w-[74px] border-b-[3px] border-primary-red"
            >
              <div className="font-heading font-extrabold text-xl md:text-[28px] text-primary-blue tabular-nums">
                {mounted ? String(u.value).padStart(2, '0') : '--'}
              </div>
              <div className="text-[10.5px] font-semibold tracking-wide uppercase text-primary-red mt-0.5">
                {u.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
