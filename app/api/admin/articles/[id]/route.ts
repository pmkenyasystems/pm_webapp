import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { hasModuleAccess } from '@/lib/permissions'

export const dynamic = 'force-dynamic'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const hasAccess = await hasModuleAccess('news')
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have access to the News module' },
        { status: 403 }
      )
    }

    const data = await request.json()
    const { title, slug, content, excerpt, imageUrl, published } = data

    const article = await prisma.article.update({
      where: { id: params.id },
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || null,
        imageUrl: imageUrl || null,
        published: published || false,
        publishedAt: published ? new Date() : null,
      },
    })

    return NextResponse.json({ article })
  } catch (error: any) {
    console.error('Error updating article:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update article' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const hasAccess = await hasModuleAccess('news')
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have access to the News module' },
        { status: 403 }
      )
    }

    await prisma.article.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Article deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting article:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete article' },
      { status: 500 }
    )
  }
}

