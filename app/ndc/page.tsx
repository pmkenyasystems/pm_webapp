'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

const EVENT_START = new Date('2026-08-11T10:00:00+03:00')
const EVENT_END = new Date('2026-08-11T13:00:00+03:00')

const SOCIAL_LINKS = [
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@_pmkenya?_r=1&_t=ZS-93GELwh7pNo',
    path: 'M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/_pmkenya?igsh=MXc2cHQxc3RqbW1kcQ==',
    path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/share/14WjwU4SeEV/',
    path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  },
  {
    label: 'X (Twitter)',
    href: 'https://x.com/_pmkenya',
    path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  },
]

const INFO_ITEMS = [
  {
    label: 'DATE',
    value: 'Tue, 11th Aug 2026',
    color: 'red' as const,
    icon: (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </>
    ),
  },
  {
    label: 'TIME',
    value: '10:00 AM – 1:00 PM',
    color: 'blue' as const,
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 3" />
      </>
    ),
  },
  {
    label: 'VENUE',
    value: 'The A.S.K Dome, Jamhuri Park',
    color: 'red' as const,
    icon: (
      <>
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </>
    ),
  },
]

function IconBadge({ color, children }: { color: 'red' | 'blue'; children: React.ReactNode }) {
  return (
    <div
      className={`flex items-center justify-center w-11 h-11 md:w-[3.6vh] md:h-[3.6vh] rounded-full text-white shadow-sm shrink-0 ${
        color === 'red' ? 'bg-primary-red' : 'bg-primary-blue'
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5 md:w-[1.8vh] md:h-[1.8vh]"
      >
        {children}
      </svg>
    </div>
  )
}

function Eyebrow({
  children,
  dark = false,
  textClassName,
}: {
  children: React.ReactNode
  dark?: boolean
  textClassName?: string
}) {
  return (
    <div className="flex items-center justify-center gap-3 md:gap-[0.8vh]">
      <span className={`h-px w-6 sm:w-8 md:w-[2.2vh] ${dark ? 'bg-white/30' : 'bg-primary-red/40'}`} />
      <span
        className={
          textClassName ||
          `uppercase tracking-[0.25em] font-semibold text-[11px] sm:text-xs md:text-[clamp(0.6rem,1.2vh,0.75rem)] ${
            dark ? 'text-white/80' : 'text-gray-400'
          }`
        }
      >
        {children}
      </span>
      <span className={`h-px w-6 sm:w-8 md:w-[2.2vh] ${dark ? 'bg-white/30' : 'bg-primary-red/40'}`} />
    </div>
  )
}

/** Diagonal flag-style ribbon accents in a section corner; flip with `mirror` for the opposite side. */
function CornerRibbons({ mirror = false }: { mirror?: boolean }) {
  return (
    <div
      className={`pointer-events-none absolute top-0 ${mirror ? 'right-0 scale-x-[-1]' : 'left-0'} w-[55vw] max-w-[520px] h-full overflow-hidden -z-10`}
    >
      <div className="absolute -top-[8%] -left-[25%] w-[170%] h-16 sm:h-20 md:h-[9vh] bg-primary-blue rotate-[-32deg] origin-top-left shadow-lg" />
      <div className="absolute top-[18%] -left-[30%] w-[170%] h-8 sm:h-10 md:h-[4.5vh] bg-primary-red rotate-[-32deg] origin-top-left shadow-lg overflow-hidden">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)',
            backgroundSize: '10px 10px',
          }}
        />
      </div>
    </div>
  )
}

function WaveDivider() {
  return (
    <svg
      className="block w-full h-8 sm:h-10 md:h-[3.5vh] shrink-0 -mb-px"
      viewBox="0 0 1440 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path d="M0,40 C240,90 480,0 720,30 C960,60 1200,10 1440,50 L1440,100 L0,100 Z" fill="#003366" />
    </svg>
  )
}

function getTimeLeft() {
  const diff = EVENT_START.getTime() - Date.now()
  if (diff <= 0) return null
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function Countdown() {
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeLeft>>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setTimeLeft(getTimeLeft())
    const interval = setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => clearInterval(interval)
  }, [])

  if (!mounted) {
    return <div className="h-[4.6rem] sm:h-[5rem] md:h-[7vh]" aria-hidden />
  }

  if (!timeLeft) {
    const isLive = Date.now() < EVENT_END.getTime()
    return (
      <div className="inline-flex items-center gap-2 rounded-full bg-primary-light border border-primary-blue/10 px-5 py-2.5 md:py-[0.8vh]">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-red opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary-red" />
        </span>
        <span className="font-black text-primary-blue uppercase tracking-wide text-sm md:text-[clamp(0.85rem,2vh,1.1rem)]">
          {isLive ? "We're Live Now!" : 'See You Next Time!'}
        </span>
      </div>
    )
  }

  const units: { label: string; value: number }[] = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hrs', value: timeLeft.hours },
    { label: 'Min', value: timeLeft.minutes },
    { label: 'Sec', value: timeLeft.seconds },
  ]

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 md:gap-[0.5vh]">
      {units.map((u, i) => (
        <div key={u.label} className="flex items-center gap-1.5 sm:gap-2 md:gap-[0.5vh]">
          <div className="flex flex-col items-center justify-center bg-white rounded-xl md:rounded-[0.9vh] min-w-[3.8rem] sm:min-w-[4.4rem] md:min-w-[3.8rem] px-2 py-2.5 md:py-[0.7vh] shadow-[0_6px_20px_rgba(0,51,102,0.12)] border border-gray-100">
            <span className="font-black leading-none tabular-nums text-2xl sm:text-3xl md:text-[clamp(1.1rem,3.2vh,1.85rem)] text-primary-red">
              {String(u.value).padStart(2, '0')}
            </span>
            <span className="uppercase tracking-wide text-primary-blue leading-none text-[10px] sm:text-xs md:text-[clamp(0.5rem,1vh,0.65rem)] mt-1 md:mt-[0.3vh] font-bold">
              {u.label}
            </span>
          </div>
          {i < units.length - 1 && (
            <span className="flex flex-col gap-1 md:gap-[0.3vh] shrink-0" aria-hidden>
              <span className="w-1 h-1 md:w-[0.35vh] md:h-[0.35vh] rounded-full bg-primary-blue/30" />
              <span className="w-1 h-1 md:w-[0.35vh] md:h-[0.35vh] rounded-full bg-primary-blue/30" />
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

function FormField({
  icon,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { icon: React.ReactNode }) {
  return (
    <div className="relative flex-1 min-w-0">
      <span className="absolute left-3.5 md:left-[1vh] top-1/2 -translate-y-1/2 text-primary-blue/50 pointer-events-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 md:w-[1.7vh] md:h-[1.7vh]"
        >
          {icon}
        </svg>
      </span>
      <input
        {...props}
        className="w-full rounded-xl md:rounded-[0.7vh] border-0 bg-white pl-10 md:pl-[3vh] pr-3 py-3.5 md:py-[1vh] text-base md:text-[clamp(0.75rem,1.6vh,0.9rem)] text-primary-blue placeholder:text-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-white/70 transition-shadow"
      />
    </div>
  )
}

function RegistrationForm() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setError('')
    try {
      const res = await fetch('/api/ndc/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Registration failed')
      setStatus('success')
    } catch (err: any) {
      setStatus('error')
      setError(err.message || 'Something went wrong')
    }
  }

  if (status === 'success') {
    return (
      <div className="w-full max-w-3xl flex items-center gap-3 rounded-xl md:rounded-[0.7vh] bg-white px-4 py-3.5 md:py-[1vh] shadow-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6 md:w-[2.2vh] md:h-[2.2vh] text-green-600 shrink-0"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <path d="m22 4-10 10.01-3-3" />
        </svg>
        <p className="font-semibold text-primary-blue text-sm md:text-[clamp(0.75rem,1.7vh,0.95rem)] text-left">
          Thank you, {name.split(' ')[0]}! Your registration is confirmed &mdash; see you at the NDC.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-full max-w-3xl flex flex-col md:flex-row items-stretch gap-3 md:gap-2.5"
    >
      <FormField
        type="text"
        required
        placeholder="Full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        icon={
          <>
            <path d="M20 21a8 8 0 0 0-16 0" />
            <circle cx="12" cy="7" r="4" />
          </>
        }
      />
      <FormField
        type="tel"
        required
        placeholder="Phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        icon={
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
        }
      />
      <FormField
        type="email"
        required
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        icon={
          <>
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 6-10 7L2 6" />
          </>
        }
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="inline-flex items-center justify-center gap-2 bg-primary-red text-white font-bold uppercase tracking-wide rounded-xl md:rounded-[0.7vh] px-6 md:px-5 py-3.5 md:py-[1vh] text-base md:text-[clamp(0.75rem,1.6vh,0.9rem)] shadow-lg shadow-black/20 hover:bg-primary-red/90 active:scale-[0.98] transition-all disabled:opacity-60 shrink-0"
      >
        {status === 'loading' ? 'Registering...' : 'Register Now'}
        {status !== 'loading' && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 md:w-[1.6vh] md:h-[1.6vh]"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        )}
      </button>
      {status === 'error' && (
        <p className="text-red-300 text-xs font-medium md:absolute md:left-0 md:-bottom-5">{error}</p>
      )}
    </form>
  )
}

export default function NDCPage() {
  return (
    <div className="relative flex flex-col md:h-screen md:overflow-hidden overflow-x-hidden bg-white isolate">
      {/* ── Top: white section with corner ribbons ────────────── */}
      <div className="relative overflow-hidden shrink-0">
        <CornerRibbons />
        <CornerRibbons mirror />

        <div className="relative flex flex-col items-center text-center gap-3 sm:gap-4 md:gap-[0.9vh] px-6 md:px-[4vw] pt-10 sm:pt-12 md:pt-[2vh] pb-6 sm:pb-8 md:pb-[1vh]">
          <div className="relative h-16 sm:h-20 md:h-[12vh] w-auto aspect-[943/693]">
            <Image
              src="/logo_full.png"
              alt="People's Renaissance Movement"
              fill
              className="object-contain"
              priority
            />
          </div>

          <Eyebrow>Welcome to the</Eyebrow>

          <h1 className="font-black uppercase leading-[1.08] text-3xl sm:text-4xl md:text-[clamp(1.3rem,4.2vh,2.5rem)] [text-wrap:balance]">
            <span className="text-primary-blue">National </span>
            <span className="text-primary-red">Delegates</span>
            <br />
            <span className="text-primary-blue">Convention (NDC) 2026</span>
          </h1>

          <Countdown />

          {/* Date / Time / Venue */}
          <div className="w-full max-w-3xl flex flex-col sm:flex-row flex-wrap items-stretch justify-center gap-3 md:gap-3 mt-2 md:mt-[0.6vh] relative z-10">
            {INFO_ITEMS.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 md:gap-[1vh] bg-white rounded-2xl md:rounded-[1vh] shadow-[0_8px_24px_rgba(0,51,102,0.12)] border border-gray-100 px-4 md:px-[1.4vh] py-3 md:py-[1vh] sm:flex-1"
              >
                <IconBadge color={item.color}>{item.icon}</IconBadge>
                <div className="flex flex-col items-start text-left min-w-0">
                  <span className="text-primary-red font-bold tracking-widest text-[10px] md:text-[clamp(0.55rem,1.2vh,0.7rem)]">
                    {item.label}
                  </span>
                  <span className="text-primary-blue font-bold leading-snug text-sm md:text-[clamp(0.7rem,1.6vh,0.95rem)]">
                    {item.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <WaveDivider />

      {/* ── Bottom: dark blue band ─────────────────────────────── */}
      <div className="relative flex-1 flex flex-col items-center justify-center gap-5 sm:gap-6 md:gap-[1.4vh] bg-primary-blue px-6 md:px-[4vw] py-8 sm:py-10 md:py-[1.6vh] md:overflow-hidden">
        <Eyebrow
          dark
          textClassName="text-white font-semibold text-sm sm:text-base md:text-[clamp(0.8rem,1.8vh,1rem)]"
        >
          Reserve your spot &mdash; it&apos;s free
        </Eyebrow>

        <RegistrationForm />

        <div className="flex flex-col items-center gap-3 sm:gap-3 md:gap-[0.6vh]">
          <div className="flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-5 gap-y-2 text-white/90 font-medium text-sm md:text-[clamp(0.7rem,1.5vh,0.9rem)]">
            <a href="mailto:info@pmparty.ke" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-4 h-4 md:w-[1.9vh] md:h-[1.9vh] shrink-0"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 6-10 7L2 6" />
              </svg>
              info@pmparty.ke
            </a>
            <span className="text-white/25 hidden sm:inline">|</span>
            <a href="tel:+254119916587" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-4 h-4 md:w-[1.9vh] md:h-[1.9vh] shrink-0"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              +254 119 916 587
            </a>
            <span className="text-white/25 hidden sm:inline">|</span>
            <div className="flex items-center gap-2.5">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex items-center justify-center w-8 h-8 md:w-[2.6vh] md:h-[2.6vh] rounded-full bg-white text-primary-blue hover:bg-primary-red hover:text-white transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-3.5 h-3.5 md:w-[1.2vh] md:h-[1.2vh]"
                  >
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <p className="text-primary-red font-bold text-xs md:text-[clamp(0.6rem,1.3vh,0.8rem)]">
            Mabadiliko Ni Sasa &nbsp;&middot;&nbsp; #PMPartyNDC
          </p>
        </div>
      </div>
    </div>
  )
}
