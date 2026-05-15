'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'

const sliderImages = [
  '/images/slider/renaisance.png',
  '/images/slider/presser.png',
  '/images/slider/roadshow.jpeg',
  '/images/slider/streets.png',
]

const SLIDE_INTERVAL_MS = 5000

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const goTo = (index: number) => {
    setCurrentSlide(index)
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length)
    }, SLIDE_INTERVAL_MS)
  }

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length)
    }, SLIDE_INTERVAL_MS)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  return (
    <section className="relative w-full" style={{ height: 'clamp(420px, 72vh, 800px)' }}>
      {/* Slide images */}
      {sliderImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={image}
            alt=""
            loading="eager"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </div>
      ))}

      {/* Dark overlay */}
      <div
        className="absolute inset-0 z-10"
        style={{ background: 'linear-gradient(to bottom, rgba(0,15,40,0.55) 0%, rgba(0,15,40,0.72) 60%, rgba(0,15,40,0.88) 100%)' }}
      />

      {/* Content */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-5 sm:px-8 text-center">
        <h1
          className="text-white font-black uppercase tracking-tight"
          style={{ fontSize: 'clamp(1.75rem, 7vw, 4rem)', lineHeight: 1 }}
        >
          <span className="block">Kenya Needs</span>
          <span className="block text-primary-red">A Renaissance</span>
        </h1>

        <p className="mt-3 sm:mt-5 text-white/75 text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase">
          Welcome to the Movement.
        </p>

        {/* CTA buttons — stack on small phones, side-by-side from sm up */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-sm sm:max-w-none">
          <Link
            href="/membership"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-primary-red text-white font-black text-xs sm:text-sm uppercase tracking-wider hover:bg-red-700 transition-all duration-200 active:scale-95 shadow-lg shadow-red-900/40"
          >
            Become a Member
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <Link
            href="/donate"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-3.5 rounded-full border-2 border-white/60 text-white font-black text-xs sm:text-sm uppercase tracking-wider hover:bg-white/10 transition-all duration-200 active:scale-95"
          >
            Donate
          </Link>
        </div>

        <Link
          href="/volunteer"
          className="mt-4 text-white/45 text-[11px] uppercase tracking-widest hover:text-white/75 transition-colors duration-200 underline underline-offset-4"
        >
          Or volunteer with us
        </Link>
      </div>

      {/* Slide dots */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        {sliderImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? 'w-6 h-2 bg-white'
                : 'w-2 h-2 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
