import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getStaticSearchItems, rankItems, SearchItem } from '@/lib/search'

export const dynamic = 'force-dynamic'

async function getArticleItems(query: string): Promise<SearchItem[]> {
  const articles = await prisma.article.findMany({
    where: {
      published: true,
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { excerpt: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
      ],
    },
    select: { title: true, slug: true, excerpt: true },
    take: 10,
    orderBy: { createdAt: 'desc' },
  })

  return articles.map((a) => ({
    title: a.title,
    description: a.excerpt || 'Read the full article.',
    url: `/articles/${a.slug}`,
    type: 'News',
  }))
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')?.trim() ?? ''

  if (query.length < 2) {
    return NextResponse.json({ results: [] })
  }

  try {
    const [articleItems] = await Promise.all([getArticleItems(query).catch(() => [])])
    const staticResults = rankItems(getStaticSearchItems(), query, 15)

    const results = [...articleItems, ...staticResults].slice(0, 20)

    return NextResponse.json({ results })
  } catch (error: any) {
    console.error('Search error:', error)
    return NextResponse.json({ results: [] })
  }
}
