'use client'

import { PartyEvent } from '@/lib/events'
import { buildIcsContent } from '@/lib/ics'

export default function AddToCalendarButton({ event, className }: { event: PartyEvent; className?: string }) {
  const handleClick = () => {
    const blob = new Blob([buildIcsContent(event)], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${event.slug}.ics`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={
        className ??
        'inline-flex items-center gap-2 font-bold text-[13.5px] px-4 py-2.5 rounded-full border-[1.5px] border-primary-blue text-primary-blue hover:bg-primary-blue hover:text-white transition'
      }
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      Add to Calendar
    </button>
  )
}
