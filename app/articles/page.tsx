import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import SocialShare from '@/components/sharing/SocialShare'

async function getArticles() {
  try {
    return await prisma.article.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { name: true } } }
    }).catch(() => [])
  } catch (error) {
    return []
  }
}

export default async function ArticlesPage() {
  const articles = await getArticles()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Articles & News
        </h1>
        <div className="w-32 h-1 bg-primary-red mx-auto"></div>
        <p className="text-lg text-gray-600 mt-6">
          Stay informed about our activities, policies, and vision
        </p>
      </div>

      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <Link href={`/articles/${article.slug}`}>
                {article.imageUrl && (
                  <div className="h-48 bg-gray-200"></div>
                )}
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2 text-gray-900 line-clamp-2">
                    {article.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {article.excerpt || article.content.substring(0, 150)}...
                  </p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{article.author.name || 'Admin'}</span>
                    <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
              <div className="px-6 pb-4">
                <SocialShare
                  url={`/articles/${article.slug}`}
                  title={article.title}
                  description={article.excerpt || article.content.substring(0, 150)}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No articles available yet. Check back soon!</p>
        </div>
      )}
    </div>
  )
}

