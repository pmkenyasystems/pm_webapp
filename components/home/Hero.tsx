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

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length)
    }, SLIDE_INTERVAL_MS)
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [])

  return (
    <section className="relative flex-1 min-h-0 flex flex-col mb-0">
      {/* Background slider */}
      <div className="absolute inset-0">
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
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Whitish to clear gradient: light left for text, image shows through on the right */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to right, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.6) 35%, rgba(255,255,255,0.15) 65%, transparent 100%)',
              }}
            />
          </div>
        ))}
      </div>

      {/* Hero content - always left-aligned, fade-in */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl text-left animate-fade-in">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-primary-blue">Kenya Needs</span>{' '}
              <span className="text-primary-red text-4xl md:text-5xl lg:text-[3.5rem] xl:text-6xl">A Renaissance.</span>
            </h1>
            <p className="mt-4 text-base md:text-lg font-semibold text-gray-900 max-w-xl drop-shadow">
              Welcome to the Movement.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/membership"
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-bold text-white bg-primary-red hover:bg-primary-red/90 shadow-md shadow-red-900/30 border-2 border-white/20 transition-all duration-200 hover:scale-105"
              >
                Become a Member
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/volunteer"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-bold text-gray-900 bg-white hover:bg-gray-100 shadow-md border-2 border-gray-300 transition-all duration-200 hover:scale-105"
              >
                Volunteer
              </Link>
              <Link
                href="/donate"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-bold text-white bg-primary-blue hover:bg-primary-blue/90 shadow-md shadow-blue-900/30 border-2 border-white/20 transition-all duration-200 hover:scale-105"
              >
                Donate
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
