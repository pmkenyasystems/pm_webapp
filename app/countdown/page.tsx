'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

const ELECTION_DATE = new Date('2027-08-10T00:00:00+03:00')

// Sampled directly from /public/logo_full.png
const BRIGHT_RED = '#F0181E'
const DEEP_BLUE = '#003491'

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

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-3">
      <span className="h-px w-8 sm:w-10" style={{ backgroundColor: `${BRIGHT_RED}80` }} />
      <span
        className="uppercase tracking-[0.3em] font-semibold text-[11px] sm:text-xs"
        style={{ color: BRIGHT_RED }}
      >
        {children}
      </span>
      <span className="h-px w-8 sm:w-10" style={{ backgroundColor: `${BRIGHT_RED}80` }} />
    </div>
  )
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
    <div className="relative min-h-screen w-full overflow-hidden bg-white flex flex-col items-center justify-center px-6 py-16 isolate">
      <div className="relative flex flex-col items-center text-center gap-5 sm:gap-6 max-w-3xl w-full">
        <div className="relative h-14 sm:h-16 w-auto aspect-[943/693]">
          <Image
            src="/logo_full.png"
            alt="People's Renaissance Movement"
            fill
            className="object-contain"
            priority
          />
        </div>

        <Eyebrow>General Elections</Eyebrow>

        <h1
          className="font-black uppercase leading-[1.05] text-4xl sm:text-5xl md:text-6xl [text-wrap:balance]"
          style={{ color: DEEP_BLUE }}
        >
          PM Countdown <span style={{ color: BRIGHT_RED }}>to 2027</span>
        </h1>

        <p className="text-sm sm:text-base -mt-1" style={{ color: `${DEEP_BLUE}99` }}>
          Kenya decides &mdash; Tuesday, 10th August 2027
        </p>

        <div className="mt-4 sm:mt-6 w-full">
          {mounted && !timeLeft ? (
            <div
              className="inline-flex items-center gap-2.5 rounded-full bg-white px-6 py-3.5 shadow-lg border-2"
              style={{ borderColor: BRIGHT_RED }}
            >
              <span className="relative flex h-2.5 w-2.5">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ backgroundColor: BRIGHT_RED }}
                />
                <span
                  className="relative inline-flex rounded-full h-2.5 w-2.5"
                  style={{ backgroundColor: BRIGHT_RED }}
                />
              </span>
              <span
                className="font-black uppercase tracking-wide text-sm sm:text-base"
                style={{ color: DEEP_BLUE }}
              >
                Kenya Decides Today!
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2.5 sm:gap-4">
              {units.map((u, i) => (
                <div key={u.label} className="flex items-center gap-2.5 sm:gap-4">
                  <div
                    className="flex flex-col items-center justify-center bg-white rounded-2xl min-w-[4.2rem] sm:min-w-[5.8rem] md:min-w-[7rem] px-2 py-4 sm:py-6 border-2 shadow-[0_8px_24px_rgba(0,52,145,0.12)]"
                    style={{ borderColor: `${DEEP_BLUE}1A` }}
                  >
                    <span
                      className="font-black leading-none tabular-nums text-3xl sm:text-5xl md:text-6xl"
                      style={{ color: DEEP_BLUE }}
                    >
                      {mounted ? String(u.value).padStart(2, '0') : '--'}
                    </span>
                    <span
                      className="uppercase tracking-wide leading-none text-[10px] sm:text-xs mt-2.5 font-bold"
                      style={{ color: BRIGHT_RED }}
                    >
                      {u.label}
                    </span>
                  </div>
                  {i < units.length - 1 && (
                    <span
                      className="text-xl sm:text-3xl font-black"
                      style={{ color: `${DEEP_BLUE}33` }}
                      aria-hidden
                    >
                      :
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          className="mt-8 sm:mt-10 flex items-center gap-3 text-xs sm:text-sm uppercase tracking-[0.2em] font-semibold"
          style={{ color: `${DEEP_BLUE}99` }}
        >
          <span>PM Party</span>
          <span className="h-1 w-1 rounded-full" style={{ backgroundColor: BRIGHT_RED }} />
          <span>Mabadiliko Ni Sasa</span>
        </div>
      </div>
    </div>
  )
}
