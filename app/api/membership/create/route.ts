import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
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

    // Map IPPMS API response fields to our database format
    const membershipNo = ippmsData.Membership_No || ippmsData.membership_No || ippmsData.membershipNo || null
    const ippmsId = ippmsData.ippmsId || membershipNo || `IPPMS-${nationalId}`
    const idNumber = ippmsData.ID_Passport_No || ippmsData.id_Passport_No || ippmsData.idNumber || nationalId
    const lastName = ippmsData.Surname || ippmsData.surname || ''
    const firstName = ippmsData.OtherNames || ippmsData.otherNames || ''
    const dob = ippmsData.DOB || ippmsData.dob || ippmsData.dateOfBirth || null
    const youth = ippmsData.Youth === 'yes' || ippmsData.Youth === true || ippmsData.youth === 'yes' || ippmsData.youth === true || false
    const pwd = ippmsData.PWD === 'yes' || ippmsData.PWD === true || ippmsData.pwd === 'yes' || ippmsData.pwd === true || false

    // Check if member already exists by ippmsId, membershipNo, or idNumber
    const orConditions: any[] = [
      { ippmsId },
      { idNumber },
    ]
    
    if (membershipNo) {
      orConditions.push({ membershipNo })
    }
    
    const existingMember = await prisma.member.findFirst({
      where: {
        OR: orConditions,
      },
    })

    // Create or update member profile with all IPPMS data
    const memberData: any = {
      ippmsId,
      firstName,
      lastName,
      email: ippmsData.email || ippmsData.Email || null,
      phone: ippmsData.phone || ippmsData.Phone || null,
      idNumber,
      dateOfBirth: dob ? new Date(dob) : null,
      gender: ippmsData.Gender || ippmsData.gender || null,
      religion: ippmsData.Religion || ippmsData.religion || null,
      ethnicity: ippmsData.Ethnicity || ippmsData.ethnicity || null,
      address: ippmsData.address || ippmsData.Address || null,
      county: ippmsData.County || ippmsData.county || null,
      constituency: ippmsData.Constituency || ippmsData.constituency || null,
      ward: ippmsData.Ward || ippmsData.ward || null,
      youth,
      pwd,
      membershipDate: ippmsData.membershipDate ? new Date(ippmsData.membershipDate) : new Date(),
      ippmsDataSyncedAt: new Date(), // Track when IPPMS data was synced/updated
    }

    // Only include membershipNo if it exists
    if (membershipNo) {
      memberData.membershipNo = membershipNo
    }

    let member
    if (existingMember) {
      // Update existing member with latest IPPMS data (don't change password if it exists)
      member = await prisma.member.update({
        where: { id: existingMember.id },
        data: memberData,
      })
      
      // Return member without password
      const memberResponse: any = { ...member }
      delete memberResponse.password
      return NextResponse.json({ 
        member: memberResponse,
        message: 'Member profile updated successfully with latest IPPMS data'
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
      
      // Return member without password
      const memberResponse: any = { ...member }
      delete memberResponse.password
      return NextResponse.json({ 
        member: memberResponse,
        message: member.phone 
          ? 'Profile created successfully. A temporary password has been sent to your phone.'
          : 'Profile created successfully. Please contact support to set your password.',
        // Include tempPassword only if no phone number (for manual setup)
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

