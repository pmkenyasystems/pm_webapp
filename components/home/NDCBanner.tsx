'use client'

import { useEffect, useState } from 'react'

const EXPIRY = new Date('2026-08-11T23:59:59+03:00')

export default function NDCBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (new Date() < EXPIRY) setVisible(true)
  }, [])

  if (!visible) return null

  return (
    <div className="relative bg-[#003366] text-white text-sm">
      <div className="max-w-7xl mx-auto px-4 py-2 pr-10 flex flex-col sm:flex-row sm:items-center sm:justify-center gap-1 sm:gap-3 text-center">
        <span className="font-semibold text-[#ff6b7a]">National Delegates Convention (NDC)</span>
        <span className="hidden sm:inline text-white/50">|</span>
        <span>
          Tue, 11th Aug 2026 &middot; 10:00 AM&ndash;1:00 PM &middot; The A.S.K Dome, Jamhuri Park, Nairobi
        </span>
        <span className="hidden sm:inline text-white/50">|</span>
        <span className="text-white/90">
          RSVP by 5th Aug:{' '}
          <a href="mailto:info@pmparty.ke" className="underline underline-offset-2 hover:text-white">
            info@pmparty.ke
          </a>
        </span>
      </div>
      <button
        onClick={() => setVisible(false)}
        aria-label="Dismiss notice"
        className="absolute top-1/2 right-2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10 text-lg leading-none"
      >
        &times;
      </button>
    </div>
  )
}
