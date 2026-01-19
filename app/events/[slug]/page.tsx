import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import Link from 'next/link'

async function getEvent(slug: string) {
  try {
    return await prisma.event.findUnique({
      where: { slug }
    })
  } catch (error) {
    return null
  }
}

export default async function EventPage({ params }: { params: { slug: string } }) {
  const event = await getEvent(params.slug)

  if (!event || !event.isPublic) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/events" className="text-primary-blue hover:underline mb-6 inline-block">
        ← Back to Events
      </Link>

      <article>
        {event.imageUrl && (
          <div className="mb-8">
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        )}

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {event.title}
        </h1>

        <div className="bg-primary-light rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600 mb-1">Date</div>
              <div className="font-semibold text-primary-blue">
                {format(new Date(event.startDate), 'EEEE, MMMM dd, yyyy')}
                {event.endDate && ` - ${format(new Date(event.endDate), 'MMMM dd, yyyy')}`}
              </div>
              {event.endDate && (
                <div className="text-sm text-gray-600 mt-1">
                  {format(new Date(event.startDate), 'h:mm a')} - {format(new Date(event.endDate), 'h:mm a')}
                </div>
              )}
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Location</div>
              <div className="font-semibold text-primary-blue">
                {event.location}
              </div>
            </div>
          </div>
          {event.maxAttendees && (
            <div className="mt-4">
              <div className="text-sm text-gray-600 mb-1">Capacity</div>
              <div className="font-semibold text-primary-blue">
                {event.maxAttendees} attendees
              </div>
            </div>
          )}
        </div>

        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
            {event.description}
          </p>
        </div>
      </article>
    </div>
  )
}

