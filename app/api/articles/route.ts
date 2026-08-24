import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = Math.min(parseInt(searchParams.get('limit') || '10', 10) || 10, 50)

    const articles = await prisma.article.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        publishedAt: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ articles })
  } catch (error: any) {
    console.error('Error fetching articles:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch articles' },
      { status: 500 }
    )
  }
}
