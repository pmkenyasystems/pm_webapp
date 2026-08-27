import { prisma } from './prisma'
import { sendAspirantNotification, sendAspirantConfirmation } from './mailer'

export class AspirantApplicationError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export interface AspirantApplicationInput {
  idNumber: string
  fullName?: string | null
  phone?: string | null
  email?: string | null
  electionId: string
  positionId: number
  country?: string | null
  countyCode?: number | null
  constituencyCode?: number | null
  wardCode?: number | null
  pollingStation?: string | null
}

/**
 * Creates an aspirant application, used by both the public self-service flow and admin
 * registration. Membership is not required — non-members can apply, but NEB can only approve
 * their application once they register as a Life Member. Notifies the elections board (NEB)
 * and, when an email is available, confirms the registration to the aspirant themselves.
 */
export async function createAspirantApplication(input: AspirantApplicationInput) {
  const { idNumber, electionId, positionId } = input
  if (!idNumber || !electionId || !positionId) {
    throw new AspirantApplicationError('ID Number, Election, and Position are required', 400)
  }

  // Membership is not required to apply — non-members can register as aspirants, but their
  // application can only be approved by NEB once they become a registered Life Member.
  const member = await prisma.member.findUnique({ where: { idNumber } })
  const isRegisteredMember = !!member

  const election = await prisma.election.findUnique({ where: { id: electionId } })
  if (!election) {
    throw new AspirantApplicationError('Election not found', 404)
  }
  if (!election.isActive) {
    throw new AspirantApplicationError('This election is not currently accepting applications', 400)
  }

  const position = await prisma.position.findUnique({ where: { id: positionId } })
  if (!position) {
    throw new AspirantApplicationError('Position not found', 404)
  }

  const existingApplication = await prisma.aspirant.findUnique({
    where: {
      idNumber_electionId_positionId: { idNumber, electionId, positionId },
    },
  })
  if (existingApplication) {
    throw new AspirantApplicationError(
      'This member has already applied for this position in this election',
      400
    )
  }

  const aspirant = await prisma.aspirant.create({
    data: {
      idNumber,
      fullName: input.fullName?.trim() || null,
      phone: input.phone?.trim() || null,
      email: input.email?.trim() || null,
      electionId,
      positionId,
      country: input.country || 'Kenya',
      countyCode: input.countyCode || null,
      constituencyCode: input.constituencyCode || null,
      wardCode: input.wardCode || null,
      pollingStation: input.pollingStation?.trim() || null,
    },
    include: {
      election: true,
      position: true,
      county: true,
      constituency: true,
      ward: true,
    },
  })

  // Notify the elections board (non-blocking)
  sendAspirantNotification({
    fullName: input.fullName ?? null,
    idNumber,
    phone: input.phone ?? null,
    email: input.email ?? null,
    electionTitle: aspirant.election.title,
    positionTitle: aspirant.position.positionTitle,
    positionLevel: aspirant.position.positionLevel,
    county: aspirant.county?.countyName ?? null,
    constituency: aspirant.constituency?.constituencyName ?? null,
    ward: aspirant.ward?.wardName ?? null,
    pollingStation: input.pollingStation ?? null,
  }).catch((err) => console.error('Failed to send NEB email:', err))

  // Confirm to the aspirant themselves, with next steps
  const recipientEmail = (input.email?.trim() || member?.email || '').trim()
  const recipientName =
    input.fullName?.trim() || (member ? `${member.surname} ${member.otherNames}`.trim() : '') || 'Aspirant'
  const area =
    [aspirant.ward?.wardName, aspirant.constituency?.constituencyName, aspirant.county?.countyName]
      .filter(Boolean)
      .join(', ') || 'Not specified'

  let confirmationSent = false
  if (recipientEmail) {
    try {
      await sendAspirantConfirmation({
        name: recipientName,
        email: recipientEmail,
        electionTitle: aspirant.election.title,
        positionTitle: aspirant.position.positionTitle,
        area,
        isRegisteredMember,
      })
      confirmationSent = true
    } catch (err) {
      console.error('Failed to send aspirant confirmation email:', err)
    }
  }

  return { aspirant, confirmationSent, confirmationEmail: recipientEmail || null, isRegisteredMember }
}
