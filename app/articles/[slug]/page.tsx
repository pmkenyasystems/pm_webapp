import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

async function getArticle(slug: string) {
  try {
    return await prisma.article.findUnique({
      where: { slug },
      include: { author: { select: { name: true } } }
    })
  } catch (error) {
    return null
  }
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug)

  if (!article || !article.published) {
    notFound()
  }

  // Update view count
  await prisma.article.update({
    where: { id: article.id },
    data: { views: { increment: 1 } }
  })

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/articles" className="text-primary-blue hover:underline mb-6 inline-block">
        ← Back to Articles
      </Link>

      <article>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {article.title}
        </h1>
        
        <div className="flex items-center gap-4 text-gray-600 mb-8">
          <span>By {article.author.name || 'Admin'}</span>
          <span>•</span>
          <span>{new Date(article.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</span>
          <span>•</span>
          <span>{article.views} views</span>
        </div>

        {article.imageUrl && (
          <div className="mb-8">
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        )}

        {article.excerpt && (
          <p className="text-xl text-gray-700 mb-8 italic">
            {article.excerpt}
          </p>
        )}

        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </article>
    </div>
  )
}

