import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import SocialShare from '@/components/sharing/SocialShare'

async function getFeaturedContent() {
  try {
    const articles = await prisma.article.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: 3,
      include: { author: { select: { name: true } } }
    }).catch(() => [])
    return { articles: articles || [] }
  } catch (error) {
    return { articles: [] }
  }
}

export default async function FeaturedContent() {
  const { articles } = await getFeaturedContent()

  return (
    <section className="pt-6 pb-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gray-50 p-5 md:p-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Updates</h2>
            <Link href="/articles" className="text-primary-blue hover:underline font-medium">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {articles.length > 0 ? (
            articles.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100"
              >
                <Link href={`/articles/${article.slug}`}>
                  <div className="relative h-48 bg-gray-200">
                    {article.imageUrl && (
                      <img src={article.imageUrl} alt="" className="w-full h-full object-cover" />
                    )}
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary-red via-primary-blue to-white" />
                  </div>
                </Link>
                <div className="p-6">
                  <Link href={`/articles/${article.slug}`}>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 hover:text-primary-blue transition">
                      {article.title}
                    </h3>
                  </Link>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {article.excerpt || (article.content || '').replace(/<[^>]*>/g, '').substring(0, 120)}...
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(article.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <Link
                      href={`/articles/${article.slug}`}
                      className="inline-flex items-center gap-1 text-primary-blue font-medium text-sm hover:underline"
                    >
                      Read more
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
                <div className="px-6 pb-4">
                  <SocialShare
                    url={`/articles/${article.slug}`}
                    title={article.title}
                    description={article.excerpt || (article.content || '').substring(0, 100)}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center text-gray-500 py-8">
              No updates yet. Check back soon!
            </div>
          )}
          </div>
        </div>
      </div>
    </section>
  )
}

