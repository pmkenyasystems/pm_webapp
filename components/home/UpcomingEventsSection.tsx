import Link from 'next/link'
import Image from 'next/image'
import { getUpcomingEvents } from '@/lib/events'

export default function UpcomingEventsSection() {
  const events = getUpcomingEvents().slice(0, 3)

  if (events.length === 0) return null

  return (
    <section id="events" className="py-12 md:py-[88px] bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-baseline mb-8 flex-wrap gap-2.5">
          <h2 className="font-heading font-black text-[26px] md:text-4xl uppercase m-0">
            Upcoming <span className="text-primary-red">Events</span>
          </h2>
          <Link href="/events" className="font-extrabold text-[15px] text-primary-blue hover:text-primary-red transition">
            View More Events &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[26px]">
          {events.map((event) => (
            <Link
              key={event.slug}
              href="/events"
              className="block rounded-2xl overflow-hidden border border-gray-200 text-inherit shadow-[0_4px_16px_-8px_rgba(0,0,0,0.15)] transition-all duration-[250ms] hover:-translate-y-1.5 hover:shadow-[0_16px_32px_-12px_rgba(0,0,0,0.25)]"
            >
              <div className="relative aspect-[2/3] overflow-hidden bg-gray-100">
                <Image
                  src={event.poster}
                  alt={`${event.title} — ${event.subtitle}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-[22px]">
                <div className="inline-block text-[12.5px] font-extrabold text-white bg-primary-red px-3 py-1 rounded-full mb-3">
                  {event.dateLabel}
                </div>
                <div className="font-extrabold text-lg leading-tight mb-1">{event.title}</div>
                <div className="text-sm text-gray-500 leading-snug">{event.subtitle}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
