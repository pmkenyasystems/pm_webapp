import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import SocialShare from '@/components/sharing/SocialShare'

async function getEvents() {
  try {
    return await prisma.event.findMany({
      where: { isPublic: true },
      orderBy: { startDate: 'asc' }
    }).catch(() => [])
  } catch (error) {
    return []
  }
}

export default async function EventsPage() {
  const events = await getEvents()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Upcoming Events
        </h1>
        <div className="w-32 h-1 bg-primary-red mx-auto"></div>
        <p className="text-lg text-gray-600 mt-6">
          Join us at our events and be part of the movement
        </p>
      </div>

      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <Link href={`/events/${event.id}`}>
                {event.imageUrl && (
                  <div className="h-48 bg-gray-200"></div>
                )}
                <div className="p-6">
                  <div className="text-primary-red text-sm font-semibold mb-2">
                    {format(new Date(event.startDate), 'MMM dd, yyyy')}
                    {event.endDate && ` - ${format(new Date(event.endDate), 'MMM dd, yyyy')}`}
                  </div>
                  <h2 className="text-xl font-semibold mb-2 text-gray-900">
                    {event.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {event.description}
                  </p>
                  <div className="text-sm text-gray-500">
                    📍 {event.location}
                  </div>
                  {event.maxAttendees && (
                    <div className="text-sm text-gray-500 mt-1">
                      Capacity: {event.maxAttendees} attendees
                    </div>
                  )}
                </div>
              </Link>
              <div className="px-6 pb-4">
                <SocialShare
                  url={`/events/${event.id}`}
                  title={event.title}
                  description={event.description}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No upcoming events. Check back soon!</p>
        </div>
      )}
    </div>
  )
}

