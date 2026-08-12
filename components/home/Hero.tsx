'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'

const heroImages = [
  '/images/hero/hero-1.jpg',
  '/images/hero/hero-2.jpg',
  '/images/hero/hero-3.jpg',
]

const SLIDE_INTERVAL_MS = 4000

export default function Hero() {
  const [slide, setSlide] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSlide((prev) => (prev + 1) % heroImages.length)
    }, SLIDE_INTERVAL_MS)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  return (
    <section className="relative flex flex-col md:flex-row-reverse items-center overflow-hidden bg-white min-h-0 md:min-h-[680px] gap-0 md:gap-6">
      <div className="hidden md:block absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-primary-blue to-primary-red" />

      <div className="relative w-full md:w-[48%] aspect-video md:aspect-[4/3] overflow-hidden md:rounded-[20px] border-0 md:border-[6px] md:border-white md:outline md:outline-2 md:outline-gray-200 flex-shrink-0">
        {heroImages.map((src, i) => (
          <img
            key={src}
            src={src}
            alt="PM Party rally"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
            style={{ opacity: i === slide ? 1 : 0 }}
          />
        ))}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {heroImages.map((src, i) => (
            <span
              key={src}
              className={`w-[9px] h-[9px] rounded-full shadow-[0_0_0_2px_#fff] ${i === slide ? 'bg-primary-red' : 'bg-gray-300'}`}
            />
          ))}
        </div>
      </div>

      <div className="relative max-w-[640px] px-5 py-12 md:px-12 md:py-0 text-gray-900">
        <h1 className="font-heading font-black leading-[0.95] text-[40px] md:text-[72px] mb-[22px] uppercase text-primary-blue">
          Kenya Needs
          <br />
          <span className="text-primary-red">A Renaissance</span>
        </h1>
        <p className="text-base md:text-[19px] leading-[1.5] text-gray-600 mb-[30px] max-w-[520px] font-semibold">
          Welcome to the People&apos;s Movement. Get Involved.
        </p>
        <div className="flex gap-2.5 flex-nowrap overflow-x-auto">
          <Link
            href="/membership"
            className="font-bold text-[13.5px] px-[18px] py-2.5 rounded-full bg-primary-red text-white whitespace-nowrap flex-shrink-0 hover:bg-primary-blue transition"
          >
            Become a Member
          </Link>
          <Link
            href="/donate"
            className="font-bold text-[13.5px] px-[18px] py-2.5 rounded-full bg-primary-blue text-white whitespace-nowrap flex-shrink-0 hover:bg-primary-red transition"
          >
            Donate
          </Link>
          <Link
            href="/volunteer"
            className="font-bold text-[13.5px] px-[18px] py-2.5 rounded-full border-[1.5px] border-primary-blue text-primary-blue whitespace-nowrap flex-shrink-0 hover:bg-primary-blue hover:text-white transition"
          >
            Volunteer
          </Link>
        </div>
        <div className="mt-4 flex gap-5 flex-wrap">
          <Link
            href="/aspirants/apply"
            className="font-bold text-[13.5px] py-2.5 text-primary-blue border-b-2 border-primary-red"
          >
            Apply as Aspirant &rarr;
          </Link>
          <Link
            href="/membership/login"
            className="font-bold text-[13.5px] py-2.5 text-primary-blue border-b-2 border-primary-red"
          >
            Member Login &rarr;
          </Link>
        </div>
      </div>
    </section>
  )
}
