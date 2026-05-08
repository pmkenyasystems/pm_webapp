'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { allOrganisations as committees } from '@/lib/committees'

const AUTO_ADVANCE_MS = 5000

function useMediaQuery(query: string) {
  // Default to true (desktop) so we show 3 cards until we measure; avoids showing 1 card on desktop
  const [matches, setMatches] = useState(true)
  useEffect(() => {
    const m = window.matchMedia(query)
    setMatches(m.matches)
    const handler = () => setMatches(m.matches)
    m.addEventListener('change', handler)
    return () => m.removeEventListener('change', handler)
  }, [query])
  return matches
}

export default function StandingCommittees({ embedded }: { embedded?: boolean }) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const cardsPerView = isDesktop ? 3 : 1
  const maxIndex = Math.max(0, committees.length - cardsPerView)
  const [currentIndex, setCurrentIndex] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    setCurrentIndex((i) => Math.min(i, maxIndex))
  }, [maxIndex])

  // Auto-advance slider
  useEffect(() => {
    if (maxIndex <= 0) return
    const timeoutId = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
      }, AUTO_ADVANCE_MS)
    }, 100)
    return () => {
      clearTimeout(timeoutId)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [maxIndex])

  const stripWidthPercent = (committees.length / cardsPerView) * 100
  const cardWidthPercentOfStrip = 100 / committees.length
  const translateX = -currentIndex * cardWidthPercentOfStrip
  const cardStyle = { flexBasis: `${cardWidthPercentOfStrip}%`, width: `${cardWidthPercentOfStrip}%`, minWidth: `${cardWidthPercentOfStrip}%` }

  const content = (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Our Committees & Party Organs
          </h2>
          <div className="w-24 h-1 bg-primary-red mx-auto mb-4" />
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join and contribute to the party through your expertise. Explore our committees and find where you can make a difference.
          </p>
        </div>

        <div className="relative w-full">
          {/* Navigation arrows */}
          {committees.length > cardsPerView && (
            <>
              <button
                type="button"
                onClick={() => {
                  setCurrentIndex((i) => Math.max(0, i - 1))
                  if (intervalRef.current) {
                    clearInterval(intervalRef.current)
                    intervalRef.current = setInterval(() => {
                      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
                    }, AUTO_ADVANCE_MS)
                  }
                }}
                disabled={currentIndex === 0}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-4 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-primary-blue hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none transition"
                aria-label="Previous committees"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => {
                  setCurrentIndex((i) => Math.min(maxIndex, i + 1))
                  if (intervalRef.current) {
                    clearInterval(intervalRef.current)
                    intervalRef.current = setInterval(() => {
                      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
                    }, AUTO_ADVANCE_MS)
                  }
                }}
                disabled={currentIndex >= maxIndex}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-4 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-primary-blue hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none transition"
                aria-label="Next committees"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          <div className="overflow-hidden w-full">
            <div
              className="flex transition-transform duration-300 ease-out"
              style={{
                width: `${stripWidthPercent}%`,
                transform: `translateX(${translateX}%)`,
              }}
            >
              {committees.map((committee) => (
                <div
                  key={committee.id}
                  className="flex-shrink-0 flex-grow-0 px-2 box-border"
                  style={cardStyle}
                >
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                    <div className="aspect-[16/10] bg-gradient-to-br from-primary-blue to-primary-blue/80 flex items-center justify-center">
                      <span className="text-white/90 text-5xl font-bold">
                        {committee.title.charAt(0)}
                      </span>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {committee.title}
                      </h3>
                      <p className="text-gray-600 text-sm flex-1 line-clamp-3">
                        {committee.description}
                      </p>
                      <Link
                        href={`/${committee.id}`}
                        className="mt-4 inline-flex items-center text-primary-blue font-semibold text-sm hover:underline"
                      >
                        Read more
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  )

  if (embedded) {
    return <div className="pt-6 md:pt-8">{content}</div>
  }

  return <section className="py-12 bg-gray-50">{content}</section>
}
