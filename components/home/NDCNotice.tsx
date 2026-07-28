'use client'

import { useEffect, useState } from 'react'

const EXPIRY = new Date('2026-08-11T23:59:59+03:00')

export default function NDCNotice() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (new Date() >= EXPIRY) return
    const dismissed = sessionStorage.getItem('ndc_notice_dismissed')
    if (!dismissed) setVisible(true)
  }, [])

  function close() {
    sessionStorage.setItem('ndc_notice_dismissed', '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.65)' }}
      onClick={close}
    >
      <div
        className="relative max-w-lg w-full rounded-xl overflow-hidden shadow-2xl bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          aria-label="Close notice"
          className="absolute top-3 right-3 z-10 bg-black/40 hover:bg-black/60 text-white rounded-full w-9 h-9 flex items-center justify-center text-xl leading-none transition"
        >
          &times;
        </button>

        <div className="bg-[#003366] text-white text-center py-6 px-6">
          <h2 className="text-xl sm:text-2xl font-bold tracking-wide">NATIONAL DELEGATES CONVENTION</h2>
          <p className="text-[#ff6b7a] font-semibold mt-1">(NDC)</p>
        </div>

        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-3 divide-x divide-gray-200 border border-gray-200 rounded-lg overflow-hidden mb-6">
            <div className="text-center px-2 py-4">
              <p className="text-[#C41E3A] text-xs font-semibold uppercase mb-1">Date</p>
              <p className="text-[#003366] font-medium leading-tight">Tuesday</p>
              <p className="text-[#003366] text-2xl font-bold leading-tight">11th</p>
              <p className="text-[#003366] font-medium leading-tight">August 2026</p>
            </div>
            <div className="text-center px-2 py-4">
              <p className="text-[#C41E3A] text-xs font-semibold uppercase mb-1">Time</p>
              <p className="text-[#003366] font-bold">10:00 AM</p>
              <p className="text-[#003366] text-xs my-0.5">&mdash;</p>
              <p className="text-[#003366] font-bold">1:00 PM</p>
            </div>
            <div className="text-center px-2 py-4">
              <p className="text-[#C41E3A] text-xs font-semibold uppercase mb-1">Venue</p>
              <p className="text-[#003366] font-medium text-sm leading-snug">
                The A.S.K Dome
                <br />
                ASK Showgrounds,
                <br />
                Jamhuri Park &ndash; Nairobi
              </p>
            </div>
          </div>

          <p className="text-center text-[#003366] italic mb-6">Your presence will greatly honour the occasion.</p>

          <div className="bg-[#003366] text-white rounded-lg py-3 px-4 text-center font-semibold mb-4">
            RSVP BY 5TH AUGUST 2026
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-center gap-1 sm:gap-4 text-sm text-gray-700 text-center mb-6">
            <a href="mailto:info@pmparty.ke" className="hover:underline">
              info@pmparty.ke
            </a>
            <span className="hidden sm:inline text-gray-300">|</span>
            <a href="tel:+254119916587" className="hover:underline">
              +254 119 916 587
            </a>
          </div>

          <div className="text-center border-t border-gray-100 pt-4">
            <p className="text-[#003366] font-semibold">The Change We Need</p>
            <p className="text-[#C41E3A] font-bold mt-1">Mabadiliko Ni Sasa</p>
            <p className="text-gray-400 text-xs mt-1">#PMPARTYNDC</p>
          </div>
        </div>
      </div>
    </div>
  )
}
