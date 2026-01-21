import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { isSuperAdmin } from '@/lib/permissions'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'

// GET all admin users (only super admin)
export async function GET() {
  try {
    const session = await getSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const superAdmin = await isSuperAdmin()
    if (!superAdmin) {
      return NextResponse.json({ error: 'Forbidden: Super admin access required' }, { status: 403 })
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        modules: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ users })
  } catch (error: any) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

// POST create new admin user (only super admin)
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const superAdmin = await isSuperAdmin()
    if (!superAdmin) {
      return NextResponse.json({ error: 'Forbidden: Super admin access required' }, { status: 403 })
    }

    const { email, password, name, role, modules } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Validate modules if provided
    let modulesJson = null
    if (modules && Array.isArray(modules) && modules.length > 0) {
      modulesJson = JSON.stringify(modules)
    }

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
        role: role || 'admin',
        modules: modulesJson,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        modules: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ user }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create user' },
      { status: 500 }
    )
  }
}

