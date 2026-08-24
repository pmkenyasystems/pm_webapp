import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { hasModuleAccess } from '@/lib/permissions'
import { createAspirantApplication, AspirantApplicationError } from '@/lib/aspirants'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const hasAccess = await hasModuleAccess('aspirants')
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have access to the Aspirants module' },
        { status: 403 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const electionId = searchParams.get('electionId')
    const positionId = searchParams.get('positionId')

    const where: { status?: number; electionId?: string; positionId?: number } = {}
    if (status !== null && status !== '') where.status = parseInt(status, 10)
    if (electionId) where.electionId = electionId
    if (positionId) where.positionId = parseInt(positionId, 10)

    const aspirants = await prisma.aspirant.findMany({
      where: Object.keys(where).length ? where : undefined,
      include: {
        election: { select: { id: true, title: true, electionDate: true } },
        position: { select: { id: true, positionTitle: true, positionLevel: true, applicationFee: true } },
        county: { select: { countyCode: true, countyName: true } },
        constituency: { select: { constituencyCode: true, constituencyName: true } },
        ward: { select: { wardCode: true, wardName: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    const payments = await prisma.aspirantPayment.findMany({
      where: { aspirantId: { in: aspirants.map((a) => a.id) } },
      orderBy: { createdAt: 'desc' },
      select: { aspirantId: true, status: true },
    })
    const feeStatusByAspirantId: Record<string, 'paid' | 'pending' | 'unpaid'> = {}
    aspirants.forEach((a) => {
      const own = payments.filter((p) => p.aspirantId === a.id)
      feeStatusByAspirantId[a.id] = own.some((p) => p.status === 'completed')
        ? 'paid'
        : own.some((p) => p.status === 'pending')
        ? 'pending'
        : 'unpaid'
    })

    const idNumbers = Array.from(new Set(aspirants.map((a) => a.idNumber)))
    const now = new Date()
    const members = await prisma.member.findMany({
      where: { idNumber: { in: idNumbers } },
      select: {
        idNumber: true,
        surname: true,
        otherNames: true,
        membershipCategory: { select: { title: true } },
        subscriptions: {
          where: { status: 'completed', periodEnd: { gte: now } },
          select: { id: true },
          take: 1,
        },
      },
    })
    const memberMap: Record<string, {
      surname: string
      otherNames: string
      categoryTitle: string | null
      subscriptionPaid: boolean
    }> = {}
    members.forEach((m) => {
      memberMap[m.idNumber] = {
        surname: m.surname,
        otherNames: m.otherNames,
        categoryTitle: m.membershipCategory?.title ?? null,
        subscriptionPaid: m.subscriptions.length > 0,
      }
    })

    const list = aspirants.map((a) => {
      const member = memberMap[a.idNumber]
      return {
        id: a.id,
        idNumber: a.idNumber,
        memberName: member ? `${member.surname} ${member.otherNames}`.trim() : null,
        membership: member
          ? { category: member.categoryTitle, paid: member.subscriptionPaid }
          : null,
        election: a.election,
        position: a.position,
        county: a.county?.countyName ?? null,
        constituency: a.constituency?.constituencyName ?? null,
        ward: a.ward?.wardName ?? null,
        status: a.status,
        feeStatus: feeStatusByAspirantId[a.id],
        country: a.country,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
      }
    })

    const elections = Array.from(new Map(aspirants.map((a) => [a.election.id, { id: a.election.id, title: a.election.title }])).values())
    const positions = Array.from(new Map(aspirants.map((a) => [a.position.id, { id: a.position.id, positionTitle: a.position.positionTitle, positionLevel: a.position.positionLevel }])).values())

    return NextResponse.json({ aspirants: list, elections, positions })
  } catch (error: unknown) {
    console.error('Error fetching aspirants:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch aspirants' },
      { status: 500 }
    )
  }
}

// POST register a new aspirant on behalf of a member (admin)
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const hasAccess = await hasModuleAccess('aspirants')
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have access to the Aspirants module' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { idNumber, fullName, phone, email, electionId, positionId, countyCode, constituencyCode, wardCode, pollingStation } = body

    const { aspirant, confirmationSent, confirmationEmail } = await createAspirantApplication({
      idNumber: idNumber?.trim(),
      fullName,
      phone,
      email,
      electionId,
      positionId: positionId != null ? Number(positionId) : positionId,
      countyCode: countyCode != null && countyCode !== '' ? Number(countyCode) : null,
      constituencyCode: constituencyCode != null && constituencyCode !== '' ? Number(constituencyCode) : null,
      wardCode: wardCode != null && wardCode !== '' ? Number(wardCode) : null,
      pollingStation,
    })

    return NextResponse.json({ aspirant, confirmationSent, confirmationEmail }, { status: 201 })
  } catch (error: any) {
    console.error('Error registering aspirant:', error)
    if (error instanceof AspirantApplicationError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'This member has already applied for this position in this election' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: error.message || 'Failed to register aspirant' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, status } = await request.json()
    if (!id) return NextResponse.json({ error: 'Aspirant ID is required' }, { status: 400 })
    if (![0, 1, 2].includes(Number(status))) return NextResponse.json({ error: 'Invalid status value' }, { status: 400 })

    if (Number(status) === 1) {
      const paidPayment = await prisma.aspirantPayment.findFirst({
        where: { aspirantId: id, status: 'completed' },
      })
      if (!paidPayment) {
        return NextResponse.json(
          { error: 'This aspirant cannot be approved until their application fee payment has been verified' },
          { status: 400 }
        )
      }
    }

    const updated = await prisma.aspirant.update({
      where: { id },
      data: { status: Number(status) },
      select: { id: true, status: true },
    })
    return NextResponse.json({ aspirant: updated })
  } catch (error: unknown) {
    console.error('Error updating aspirant status:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update status' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await request.json()
    if (!id) return NextResponse.json({ error: 'Aspirant ID is required' }, { status: 400 })

    await prisma.aspirant.delete({ where: { id } })
    return NextResponse.json({ message: 'Aspirant deleted successfully' })
  } catch (error: unknown) {
    console.error('Error deleting aspirant:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete aspirant' },
      { status: 500 }
    )
  }
}
