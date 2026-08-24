import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { isSuperAdmin } from '@/lib/permissions'
import { prisma } from '@/lib/prisma'
import { sendAdminWelcomeEmail } from '@/lib/mailer'
import { generateTemporaryPassword } from '@/lib/generate-temp-password'
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
        isActive: true,
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

    const { email, name, role, modules } = await request.json()

    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400 }
      )
    }

    const resolvedRole = role || 'admin'
    const resolvedModules: string[] = Array.isArray(modules) ? modules : []

    if (resolvedRole !== 'super_admin' && resolvedModules.length === 0) {
      return NextResponse.json(
        { error: 'Select at least one module for this admin' },
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

    const temporaryPassword = generateTemporaryPassword()
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10)
    const modulesJson = resolvedModules.length > 0 ? JSON.stringify(resolvedModules) : null

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: resolvedRole,
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

    try {
      await sendAdminWelcomeEmail({
        name: user.name,
        email: user.email,
        temporaryPassword,
        role: user.role,
        modules: resolvedModules,
      })
      return NextResponse.json({ user, emailSent: true }, { status: 201 })
    } catch (emailError: any) {
      console.error('Error sending admin welcome email:', emailError)
      return NextResponse.json(
        {
          user,
          emailSent: false,
          temporaryPassword,
          warning: 'User created, but the welcome email could not be sent. Share this temporary password with them directly.',
        },
        { status: 201 }
      )
    }
  } catch (error: any) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create user' },
      { status: 500 }
    )
  }
}

