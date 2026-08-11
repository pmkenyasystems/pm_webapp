'use client'

import { useEffect, useState } from 'react'

const ELECTION_DATE = new Date('2027-08-10T00:00:00+03:00')

function getTimeLeft() {
  const diff = ELECTION_DATE.getTime() - Date.now()
  if (diff <= 0) return null
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export default function CountdownPage() {
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
    { label: 'Minutes', value: timeLeft?.minutes ?? 0 },
    { label: 'Seconds', value: timeLeft?.seconds ?? 0 },
  ]

  return (
    <div className="min-h-[70vh] bg-primary-light flex items-center justify-center px-4 py-16">
      <div className="max-w-3xl w-full text-center">
        <h1 className="text-3xl md:text-5xl font-black text-primary-blue mb-3">
          PM Countdown to 2027
        </h1>
        <p className="text-base md:text-lg text-gray-600 mb-10">
          General Elections &mdash; Tuesday, 10th August 2027
        </p>

        {mounted && !timeLeft ? (
          <div className="inline-flex items-center gap-2 rounded-full bg-white border border-primary-blue/10 px-6 py-3 shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-red opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary-red" />
            </span>
            <span className="font-black text-primary-blue uppercase tracking-wide text-sm md:text-base">
              Election Day is Here!
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-6">
            {units.map((u, i) => (
              <div key={u.label} className="flex items-center gap-3 sm:gap-4 md:gap-6">
                <div className="flex flex-col items-center justify-center bg-white rounded-2xl min-w-[4.5rem] sm:min-w-[5.5rem] md:min-w-[7rem] px-3 py-4 md:py-6 shadow-[0_6px_20px_rgba(0,51,102,0.12)] border border-gray-100">
                  <span className="font-black leading-none tabular-nums text-3xl sm:text-4xl md:text-6xl text-primary-red">
                    {mounted ? String(u.value).padStart(2, '0') : '--'}
                  </span>
                  <span className="uppercase tracking-wide text-primary-blue leading-none text-xs sm:text-sm mt-2 font-bold">
                    {u.label}
                  </span>
                </div>
                {i < units.length - 1 && (
                  <span className="text-2xl md:text-4xl font-black text-primary-blue/30" aria-hidden>
                    :
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
