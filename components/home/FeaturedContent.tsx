import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import SocialShare from '@/components/sharing/SocialShare'

async function getFeaturedContent() {
  try {
    const [articles, events] = await Promise.all([
      prisma.article.findMany({
        where: { published: true },
        orderBy: { createdAt: 'desc' },
        take: 3,
        include: { author: { select: { name: true } } }
      }).catch(() => []),
      prisma.event.findMany({
        where: { isPublic: true },
        orderBy: { startDate: 'asc' },
        take: 3,
      }).catch(() => [])
    ])
    return { articles: articles || [], events: events || [] }
  } catch (error) {
    return { articles: [], events: [] }
  }
}

export default async function FeaturedContent() {
  const { articles, events } = await getFeaturedContent()

  return (
    <section className="pt-8 pb-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Featured Articles */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold text-gray-900">News Updates</h2>
            <Link href="/articles" className="text-primary-blue hover:underline">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.length > 0 ? (
              articles.map((article) => (
                <div
                  key={article.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                >
                  <Link href={`/articles/${article.slug}`}>
                    {article.imageUrl && (
                      <div className="h-48 bg-gray-200"></div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2 text-gray-900">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        {article.excerpt || article.content.substring(0, 100)}...
                      </p>
                      <div className="text-sm text-gray-500">
                        {new Date(article.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </Link>
                  <div className="px-6 pb-4">
                    <SocialShare
                      url={`/articles/${article.slug}`}
                      title={article.title}
                      description={article.excerpt || article.content.substring(0, 100)}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center text-gray-500 py-8">
                No articles available yet. Check back soon!
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Events */}
        <div>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Upcoming Events</h2>
            <Link href="/events" className="text-primary-blue hover:underline">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.length > 0 ? (
              events.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                >
                  <Link href={`/events/${event.slug}`}>
                    {event.imageUrl && (
                      <div className="h-48 bg-gray-200"></div>
                    )}
                    <div className="p-6">
                      <div className="text-primary-red text-sm font-semibold mb-2">
                        {new Date(event.startDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-900">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        {event.description.substring(0, 100)}...
                      </p>
                      <div className="text-sm text-gray-500">
                        📍 {event.location}
                      </div>
                    </div>
                  </Link>
                  <div className="px-6 pb-4">
                    <SocialShare
                      url={`/events/${event.slug}`}
                      title={event.title}
                      description={event.description.substring(0, 100)}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center text-gray-500 py-8">
                No upcoming events. Check back soon!
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

