'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

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

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-3">
      <span className="h-px w-8 sm:w-10 bg-primary-red/50" />
      <span className="uppercase tracking-[0.3em] font-semibold text-[11px] sm:text-xs text-white/70">
        {children}
      </span>
      <span className="h-px w-8 sm:w-10 bg-primary-red/50" />
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
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#001a30] via-primary-blue to-[#001a30] flex flex-col items-center justify-center px-6 py-16 isolate">
      {/* Ambient glow accents */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary-red/20 blur-[100px] -z-10" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 w-[28rem] h-[28rem] rounded-full bg-white/10 blur-[110px] -z-10" />

      {/* Faint dot-grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07] -z-10"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
        }}
        aria-hidden
      />

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

        <h1 className="font-black uppercase leading-[1.05] text-4xl sm:text-5xl md:text-6xl text-white [text-wrap:balance]">
          PM Countdown <span className="text-primary-red">to 2027</span>
        </h1>

        <p className="text-sm sm:text-base text-white/60 -mt-1">
          Kenya decides &mdash; Tuesday, 10th August 2027
        </p>

        <div className="mt-4 sm:mt-6 w-full">
          {mounted && !timeLeft ? (
            <div className="inline-flex items-center gap-2.5 rounded-full bg-white/10 backdrop-blur border border-white/15 px-6 py-3.5 shadow-lg">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-red opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary-red" />
              </span>
              <span className="font-black text-white uppercase tracking-wide text-sm sm:text-base">
                Kenya Decides Today!
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2.5 sm:gap-4">
              {units.map((u, i) => (
                <div key={u.label} className="flex items-center gap-2.5 sm:gap-4">
                  <div className="flex flex-col items-center justify-center bg-white/[0.06] backdrop-blur-sm rounded-2xl min-w-[4.2rem] sm:min-w-[5.8rem] md:min-w-[7rem] px-2 py-4 sm:py-6 border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
                    <span className="font-black leading-none tabular-nums text-3xl sm:text-5xl md:text-6xl text-white">
                      {mounted ? String(u.value).padStart(2, '0') : '--'}
                    </span>
                    <span className="uppercase tracking-wide text-primary-red leading-none text-[10px] sm:text-xs mt-2.5 font-bold">
                      {u.label}
                    </span>
                  </div>
                  {i < units.length - 1 && (
                    <span className="text-xl sm:text-3xl font-black text-white/20" aria-hidden>
                      :
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 sm:mt-10 flex items-center gap-3 text-white/40 text-xs sm:text-sm uppercase tracking-[0.2em] font-semibold">
          <span>People&apos;s Renaissance Movement</span>
          <span className="h-1 w-1 rounded-full bg-white/30" />
          <span>Mabadiliko Ni Sasa</span>
        </div>
      </div>
    </div>
  )
}
