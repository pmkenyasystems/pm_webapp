import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

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

    // Map IPPMS API response to our format
    const ippmsData = response.data
    const member = {
      lastName: ippmsData.Surname || ippmsData.surname || '',
      firstName: ippmsData.OtherNames || ippmsData.otherNames || '',
      idNumber: ippmsData.ID_Passport_No || ippmsData.id_Passport_No || ippmsData.idNumber || nationalId,
      membershipNo: ippmsData.Membership_No || ippmsData.membership_No || ippmsData.membershipNo || null,
      dateOfBirth: ippmsData.DOB || ippmsData.dob || ippmsData.dateOfBirth || null,
      gender: ippmsData.Gender || ippmsData.gender || null,
      religion: ippmsData.Religion || ippmsData.religion || null,
      ethnicity: ippmsData.Ethnicity || ippmsData.ethnicity || null,
      county: ippmsData.County || ippmsData.county || null,
      constituency: ippmsData.Constituency || ippmsData.constituency || null,
      ward: ippmsData.Ward || ippmsData.ward || null,
      youth: ippmsData.Youth === 'yes' || ippmsData.Youth === true || ippmsData.youth === 'yes' || ippmsData.youth === true || false,
      pwd: ippmsData.PWD === 'yes' || ippmsData.PWD === true || ippmsData.pwd === 'yes' || ippmsData.pwd === true || false,
      // Include original IPPMS ID if available
      ippmsId: ippmsData.ippmsId || ippmsData.Membership_No || ippmsData.membership_No || ippmsData.membershipNo || null,
    }

    return NextResponse.json({ member })
  } catch (error: any) {
    console.error('Error fetching member from IPPMS:', error)
    return NextResponse.json(
      { error: error.response?.data?.message || 'Failed to fetch member data from IPPMS' },
      { status: error.response?.status || 500 }
    )
  }
}

