import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import NewsCarousel from '@/components/home/NewsCarousel'

async function getFeaturedContent() {
  try {
    const articles = await prisma.article.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
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
        <div className="rounded-2xl bg-gray-50 p-5 md:p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center flex-1">News Updates</h2>
            <div className="flex-1 flex justify-end">
              <Link href="/articles" className="text-primary-blue hover:underline font-medium">
                View All →
              </Link>
            </div>
          </div>

          {articles.length > 0 ? (
            <NewsCarousel articles={articles} />
          ) : (
            <div className="text-center text-gray-500 py-8">
              No updates yet. Check back soon!
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
