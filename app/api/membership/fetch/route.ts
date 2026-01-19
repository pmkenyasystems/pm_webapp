import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(request: NextRequest) {
  try {
    const { ippmsId } = await request.json()

    if (!ippmsId) {
      return NextResponse.json(
        { error: 'IPPMS ID is required' },
        { status: 400 }
      )
    }

    // Fetch member data from IPPMS API
    const ippmsApiUrl = process.env.IPPMS_API_URL || 'https://api.ippms.ke'
    const ippmsApiKey = process.env.IPPMS_API_KEY

    const response = await axios.get(`${ippmsApiUrl}/members/${ippmsId}`, {
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

    return NextResponse.json({ member: response.data })
  } catch (error: any) {
    console.error('Error fetching member from IPPMS:', error)
    return NextResponse.json(
      { error: error.response?.data?.message || 'Failed to fetch member data from IPPMS' },
      { status: error.response?.status || 500 }
    )
  }
}

