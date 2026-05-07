'use client'

import { useEffect, useState } from 'react'

const EXPIRY = new Date('2026-05-09T23:59:59+03:00')

export default function HQLaunchNotice() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (new Date() >= EXPIRY) return
    const dismissed = sessionStorage.getItem('hq_launch_notice_dismissed')
    if (!dismissed) setVisible(true)
  }, [])

  function close() {
    sessionStorage.setItem('hq_launch_notice_dismissed', '1')
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
        className="relative max-w-lg w-full rounded-xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          aria-label="Close notice"
          className="absolute top-3 right-3 z-10 bg-black/60 hover:bg-black/80 text-white rounded-full w-9 h-9 flex items-center justify-center text-xl leading-none transition"
        >
          &times;
        </button>
        <img
          src="/images/notices/notice_hq.jpeg"
          alt="PM Party Headquarters Launch — 9th May 2026"
          className="w-full h-auto block"
        />
      </div>
    </div>
  )
}
