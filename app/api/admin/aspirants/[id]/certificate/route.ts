import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { hasModuleAccess } from '@/lib/permissions'
import { sendNominationCertificateEmail } from '@/lib/mailer'

export const dynamic = 'force-dynamic'

async function requireAccess() {
  const session = await getSession()
  if (!session?.user) return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  const hasAccess = await hasModuleAccess('aspirants')
  if (!hasAccess) {
    return { error: NextResponse.json({ error: 'Forbidden: You do not have access to the Aspirants module' }, { status: 403 }) }
  }
  return { session }
}

// POST issue a nomination certificate for an approved aspirant — this is what makes them a candidate
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error, session } = await requireAccess()
  if (error) return error

  try {
    const aspirant = await prisma.aspirant.findUnique({
      where: { id: params.id },
      include: { election: true, position: true },
    })

    if (!aspirant) {
      return NextResponse.json({ error: 'Aspirant not found' }, { status: 404 })
    }
    if (aspirant.status !== 1) {
      return NextResponse.json(
        { error: 'Only approved aspirants can be issued a nomination certificate' },
        { status: 400 }
      )
    }
    if (aspirant.certificateNumber) {
      return NextResponse.json({ aspirant })
    }

    const issuedCount = await prisma.aspirant.count({
      where: { certificateNumber: { not: null } },
    })
    const year = new Date(aspirant.election.electionDate).getFullYear() || new Date().getFullYear()
    const certificateNumber = `PM/NOM/${year}/${String(issuedCount + 1).padStart(5, '0')}`

    const updated = await prisma.aspirant.update({
      where: { id: params.id },
      data: {
        certificateNumber,
        certificateIssuedAt: new Date(),
        certificateIssuedBy: session!.user.id,
      },
      include: {
        election: true,
        position: true,
        county: true,
        constituency: true,
        ward: true,
      },
    })

    if (updated.email) {
      sendNominationCertificateEmail({
        name: updated.fullName || updated.idNumber,
        email: updated.email,
        certificateNumber,
        electionTitle: updated.election.title,
        positionTitle: updated.position.positionTitle,
      }).catch((err) => console.error('Failed to send nomination certificate email:', err))
    }

    return NextResponse.json({ aspirant: updated })
  } catch (err: any) {
    console.error('Error issuing nomination certificate:', err)
    return NextResponse.json({ error: err.message || 'Failed to issue certificate' }, { status: 500 })
  }
}
