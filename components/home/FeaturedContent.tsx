import Link from 'next/link'
import { prisma } from '@/lib/prisma'

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

const PILL_COLORS = ['bg-primary-red', 'bg-primary-blue', 'bg-primary-red']

export default async function FeaturedContent() {
  const { articles } = await getFeaturedContent()

  return (
    <section id="news" className="py-12 md:py-[88px] bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-baseline mb-8 flex-wrap gap-2.5">
        <h2 className="font-heading font-black text-[26px] md:text-4xl uppercase m-0">
          News <span className="text-primary-red">&amp; Updates</span>
        </h2>
        <Link href="/articles" className="font-extrabold text-[15px] text-primary-blue hover:text-primary-red transition">
          View All &rarr;
        </Link>
      </div>

      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[26px]">
          {articles.map((article, i) => (
            <Link
              key={article.id}
              href={`/articles/${article.slug}`}
              className="block rounded-2xl overflow-hidden border border-gray-200 text-inherit shadow-[0_4px_16px_-8px_rgba(0,0,0,0.15)] transition-all duration-[250ms] hover:-translate-y-1.5 hover:shadow-[0_16px_32px_-12px_rgba(0,0,0,0.25)]"
            >
              <div className="aspect-video overflow-hidden bg-gray-100">
                {article.imageUrl ? (
                  <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-blue to-primary-red" />
                )}
              </div>
              <div className="p-[22px]">
                <div className={`inline-block text-[12.5px] font-extrabold text-white ${PILL_COLORS[i % PILL_COLORS.length]} px-3 py-1 rounded-full mb-3`}>
                  {new Date(article.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
                <div className="font-extrabold text-lg leading-tight mb-2">{article.title}</div>
                <div className="text-sm text-gray-500 leading-snug line-clamp-2">{article.excerpt}</div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8">
          No updates yet. Check back soon!
        </div>
      )}
      </div>
    </section>
  )
}
