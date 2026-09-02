import Image from 'next/image'
import { getAllEventsSorted } from '@/lib/events'
import AddToCalendarButton from '@/components/AddToCalendarButton'

export const metadata = {
  title: 'Events — People’s Renaissance Movement',
}

export default function EventsPage() {
  const events = getAllEventsSorted()

  return (
    <div className="bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <span className="font-heading font-bold tracking-[2px] text-[13px] uppercase text-primary-red">
            Get Involved
          </span>
          <h1 className="font-heading font-black text-3xl md:text-5xl my-3 text-primary-blue">Events</h1>
          <div className="w-24 h-1 bg-primary-red mx-auto" />
        </div>

        {events.length === 0 ? (
          <p className="text-center text-gray-500 py-16">No events scheduled at the moment. Check back soon!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {events.map((event) => (
              <article
                key={event.slug}
                className="rounded-2xl overflow-hidden border border-gray-200 shadow-[0_4px_16px_-8px_rgba(0,0,0,0.15)]"
              >
                <div className="relative w-full aspect-[2/3] bg-gray-100">
                  <Image
                    src={event.poster}
                    alt={`${event.title} — ${event.subtitle}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="inline-block text-[12.5px] font-extrabold text-white bg-primary-red px-3 py-1 rounded-full mb-3">
                    {event.dateLabel}
                  </div>
                  <h2 className="font-heading font-extrabold text-xl text-primary-blue mb-1">{event.title}</h2>
                  <p className="text-sm font-semibold text-gray-500 mb-3">{event.subtitle}</p>
                  <p className="text-[15px] text-gray-700 leading-relaxed mb-4">{event.description}</p>

                  <AddToCalendarButton event={event} className="inline-flex items-center gap-2 font-bold text-[13.5px] px-4 py-2.5 rounded-full border-[1.5px] border-primary-blue text-primary-blue hover:bg-primary-blue hover:text-white transition mb-4" />

                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Tour Stops</div>
                  <ul className="space-y-1.5 mb-4">
                    {event.stops.map((stop, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <svg className="w-4 h-4 text-primary-red mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>
                          {stop.date && <span className="font-semibold text-gray-900">{stop.date}: </span>}
                          {stop.label}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {event.speakers && event.speakers.length > 0 && (
                    <>
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Speakers</div>
                      <ul className="space-y-1 mb-2">
                        {event.speakers.map((speaker) => (
                          <li key={speaker} className="text-sm text-gray-700">{speaker}</li>
                        ))}
                      </ul>
                    </>
                  )}

                  <p className="text-xs text-gray-400 mt-3">{event.location}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
