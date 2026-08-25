import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendMembershipRegistrationConfirmation } from '@/lib/mailer'

export const dynamic = 'force-dynamic'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const idNumber = String(body.idNumber || '').trim()
    const surname = String(body.surname || '').trim()
    const otherNames = String(body.otherNames || '').trim()
    const dateOfBirth = String(body.dateOfBirth || '').trim()
    const sex = String(body.sex || '').trim()
    const email = String(body.email || '').trim()
    const phone = String(body.phone || '').trim()
    const occupation = body.occupation ? String(body.occupation).trim() : null
    const ethnicity = String(body.ethnicity || '').trim()
    const religion = String(body.religion || '').trim()
    const interestGroups: string[] = Array.isArray(body.interestGroups) ? body.interestGroups : []
    const pwdRegistrationNumber = body.pwdRegistrationNumber ? String(body.pwdRegistrationNumber).trim() : null
    const membershipCategory = body.membershipCategory ? String(body.membershipCategory).trim() : null
    const county = String(body.county || '').trim()
    const constituency = String(body.constituency || '').trim()
    const ward = String(body.ward || '').trim()
    const agreedToPolicies = !!body.agreedToPolicies
    const agreedToTerms = !!body.agreedToTerms

    if (!idNumber || !surname || !otherNames || !dateOfBirth || !sex || !email || !phone) {
      return NextResponse.json({ error: 'Please fill in all required personal information fields' }, { status: 400 })
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }
    if (!ethnicity || !religion) {
      return NextResponse.json({ error: 'Please select your ethnicity and religion' }, { status: 400 })
    }
    if (interestGroups.includes('pwd') && !pwdRegistrationNumber) {
      return NextResponse.json({ error: 'PWD Registration Number is required' }, { status: 400 })
    }
    if (!county || !constituency || !ward) {
      return NextResponse.json({ error: 'Please select your county, constituency and ward' }, { status: 400 })
    }
    if (!agreedToPolicies || !agreedToTerms) {
      return NextResponse.json({ error: 'You must agree to both statements before signing up' }, { status: 400 })
    }

    const registration = await prisma.membershipRegistration.create({
      data: {
        idNumber,
        surname,
        otherNames,
        dateOfBirth: new Date(dateOfBirth),
        sex,
        email,
        phone,
        occupation,
        ethnicity,
        religion,
        interestGroups: interestGroups.length > 0 ? JSON.stringify(interestGroups) : null,
        pwdRegistrationNumber: interestGroups.includes('pwd') ? pwdRegistrationNumber : null,
        membershipCategory,
        county,
        constituency,
        ward,
        agreedToPolicies,
        agreedToTerms,
      },
    })

    sendMembershipRegistrationConfirmation({ name: `${otherNames} ${surname}`, email }).catch((err) =>
      console.error('Failed to send membership registration confirmation email:', err)
    )

    return NextResponse.json({ registration, message: 'Thank you! Your details have been received.' })
  } catch (error: any) {
    console.error('Error creating membership registration:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to submit registration' },
      { status: 500 }
    )
  }
}
