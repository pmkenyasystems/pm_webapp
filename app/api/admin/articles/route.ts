import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { hasModuleAccess } from '@/lib/permissions'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user has access to news module
    const hasAccess = await hasModuleAccess('news')
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have access to the News module' },
        { status: 403 }
      )
    }

    const data = await request.json()
    const { title, slug, content, excerpt, imageUrl, published } = data

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const article = await prisma.article.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || null,
        imageUrl: imageUrl || null,
        published: published || false,
        publishedAt: published ? new Date() : null,
        authorId: user.id,
      },
    })

    return NextResponse.json({ article })
  } catch (error: any) {
    console.error('Error creating article:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create article' },
      { status: 500 }
    )
  }
}

