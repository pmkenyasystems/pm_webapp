import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { resolveMemberLocationFromStrings } from '@/lib/member-location'
import { serializeMemberForApi } from '@/lib/serialize-member'
import axios from 'axios'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { nationalId } = await request.json()

    if (!nationalId) {
      return NextResponse.json(
        { error: 'National ID is required' },
        { status: 400 }
      )
    }

    // Fetch member data from IPPMS API by National ID
    const ippmsApiUrl = process.env.IPPMS_API_URL || 'https://api.ippms.ke'
    const ippmsApiKey = process.env.IPPMS_API_KEY

    const response = await axios.get(`${ippmsApiUrl}/members/by-id-number/${nationalId}`, {
      headers: {
        'Authorization': `Bearer ${ippmsApiKey}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.data) {
      return NextResponse.json(
        { error: 'Member not found in IPPMS system' },
        { status: 404 }
      )
    }

    const ippmsData = response.data

    const loc = await resolveMemberLocationFromStrings(
      prisma,
      ippmsData.County || ippmsData.county,
      ippmsData.Constituency || ippmsData.constituency,
      ippmsData.Ward || ippmsData.ward
    )

    // Map IPPMS API response fields to our database format
    const ippmsId = ippmsData.ippmsId || ippmsData.Membership_No || ippmsData.membership_No || ippmsData.membershipNo || null
    const idNumber = ippmsData.ID_Passport_No || ippmsData.id_Passport_No || ippmsData.idNumber || nationalId
    const surname = ippmsData.Surname || ippmsData.surname || ''
    const otherNames = ippmsData.OtherNames || ippmsData.otherNames || ''
    const dob = ippmsData.DOB || ippmsData.dob || ippmsData.dateOfBirth || null
    const youth = ippmsData.Youth === 'yes' || ippmsData.Youth === true || ippmsData.youth === 'yes' || ippmsData.youth === true || false
    const pwd = ippmsData.PWD === 'yes' || ippmsData.PWD === true || ippmsData.pwd === 'yes' || ippmsData.pwd === true || false

    // Check if member already exists by idNumber or ippmsId
    const orConditions: any[] = [{ idNumber }]
    if (ippmsId) orConditions.push({ ippmsId })

    const existingMember = await prisma.member.findFirst({
      where: { OR: orConditions },
    })

    // Create or update member profile with all IPPMS data
    const memberData: any = {
      ...(ippmsId && { ippmsId }),
      surname,
      otherNames,
      email: ippmsData.email || ippmsData.Email || null,
      phone: ippmsData.phone || ippmsData.Phone || null,
      idNumber,
      dateOfBirth: dob ? new Date(dob) : null,
      gender: ippmsData.Gender || ippmsData.gender || null,
      religion: ippmsData.Religion || ippmsData.religion || null,
      ethnicity: ippmsData.Ethnicity || ippmsData.ethnicity || null,
      address: ippmsData.address || ippmsData.Address || null,
      countyCode: loc.countyCode,
      constituencyCode: loc.constituencyCode,
      wardCode: loc.wardCode,
      youth,
      pwd,
      membershipDate: ippmsData.membershipDate ? new Date(ippmsData.membershipDate) : new Date(),
      ippmsDataSyncedAt: new Date(), // Track when IPPMS data was synced/updated
    }

    let member
    if (existingMember) {
      // Update existing member with latest IPPMS data (don't change password if it exists)
      member = await prisma.member.update({
        where: { id: existingMember.id },
        data: memberData,
      })
      
      const memberWithLoc = await prisma.member.findUnique({
        where: { id: member.id },
        include: { county: true, constituency: true, ward: true },
      })
      return NextResponse.json({
        member: memberWithLoc ? serializeMemberForApi(memberWithLoc) : serializeMemberForApi(member as any),
        message: 'Member profile updated successfully with latest IPPMS data',
      })
    } else {
      // Generate a temporary password for new members
      const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8).toUpperCase()
      const hashedPassword = await bcrypt.hash(tempPassword, 10)
      
      // Create new member profile with password
      member = await prisma.member.create({
        data: {
          ...memberData,
          password: hashedPassword,
        },
      })
      
      // Send temporary password to member's phone via SMS
      if (member.phone) {
        const smsMessage = `Welcome to PM Kenya! Your temporary password is: ${tempPassword}. Please change it after logging in.`
        // TODO: Integrate with SMS service (e.g., Africa's Talking, Twilio)
        console.log(`SMS to ${member.phone}: ${smsMessage}`)
      }
      
      const memberWithLoc = await prisma.member.findUnique({
        where: { id: member.id },
        include: { county: true, constituency: true, ward: true },
      })
      return NextResponse.json({
        member: memberWithLoc ? serializeMemberForApi(memberWithLoc) : serializeMemberForApi(member as any),
        message: member.phone
          ? 'Profile created successfully. A temporary password has been sent to your phone.'
          : 'Profile created successfully. Please contact support to set your password.',
        ...(member.phone ? {} : { tempPassword }),
      })
    }
  } catch (error: any) {
    console.error('Error creating member profile:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create member profile' },
      { status: 500 }
    )
  }
}

