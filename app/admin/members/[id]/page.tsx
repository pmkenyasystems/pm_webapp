'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import AdminHeader from '@/components/admin/AdminHeader'
import Link from 'next/link'

interface Member {
  id: number
  idNumber: string
  ippmsId: string | null
  surname: string
  otherNames: string
  email: string | null
  phone: string | null
  dateOfBirth: string | null
  gender: string | null
  religion: string | null
  ethnicity: string | null
  address: string | null
  county: string | null
  constituency: string | null
  ward: string | null
  youth: boolean | null
  pwd: boolean | null
  membershipDate: string
  status: string
  profileCreatedAt: string
  ippmsDataSyncedAt: string | null
  membershipCategory: {
    id: string
    title: string
    fee: number
    timeline: number
  } | null
}

export default function MemberDetailPage() {
  const router = useRouter()
  const params = useParams()
  const memberId = params.id as string
  const [member, setMember] = useState<Member | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (memberId) {
      fetchMember()
    }
  }, [memberId])

  const fetchMember = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/members/${memberId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch member')
      }

      setMember(data.member)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader title="Member Details" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="p-8">Loading...</div>
        </div>
      </div>
    )
  }

  if (error || !member) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader title="Member Details" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error || 'Member not found'}
          </div>
          <div className="mt-4">
            <Link
              href="/admin/members"
              className="text-primary-blue hover:underline"
            >
              ← Back to Members
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader title="Member Details">
        <Link
          href="/admin/members"
          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
        >
          Back to Members
        </Link>
      </AdminHeader>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-[10px] border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900">
              {member.surname} {member.otherNames}
            </h2>
            <p className="text-sm text-gray-500 mt-1">ID Number: {member.idNumber}</p>
          </div>

          <div className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {member.surname} {member.otherNames}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">ID Number</dt>
                    <dd className="mt-1 text-sm text-gray-900">{member.idNumber}</dd>
                  </div>
                  {member.dateOfBirth && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {new Date(member.dateOfBirth).toLocaleDateString()}
                      </dd>
                    </div>
                  )}
                  {member.gender && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Gender</dt>
                      <dd className="mt-1 text-sm text-gray-900">{member.gender}</dd>
                    </div>
                  )}
                  {member.religion && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Religion</dt>
                      <dd className="mt-1 text-sm text-gray-900">{member.religion}</dd>
                    </div>
                  )}
                  {member.ethnicity && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Ethnicity</dt>
                      <dd className="mt-1 text-sm text-gray-900">{member.ethnicity}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Youth</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {member.youth ? 'Yes' : 'No'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">PWD</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {member.pwd ? 'Yes' : 'No'}
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Contact & Location</h3>
                <dl className="space-y-3">
                  {member.email && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Email</dt>
                      <dd className="mt-1 text-sm text-gray-900">{member.email}</dd>
                    </div>
                  )}
                  {member.phone && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Phone</dt>
                      <dd className="mt-1 text-sm text-gray-900">{member.phone}</dd>
                    </div>
                  )}
                  {member.address && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Address</dt>
                      <dd className="mt-1 text-sm text-gray-900">{member.address}</dd>
                    </div>
                  )}
                  {member.county && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">County</dt>
                      <dd className="mt-1 text-sm text-gray-900">{member.county}</dd>
                    </div>
                  )}
                  {member.constituency && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Constituency</dt>
                      <dd className="mt-1 text-sm text-gray-900">{member.constituency}</dd>
                    </div>
                  )}
                  {member.ward && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Ward</dt>
                      <dd className="mt-1 text-sm text-gray-900">{member.ward}</dd>
                    </div>
                  )}
                </dl>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Membership Information</h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="mt-1">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          member.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : member.status === 'inactive'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Membership Date</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(member.membershipDate).toLocaleDateString()}
                    </dd>
                  </div>
                  {member.membershipCategory && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Membership Category</dt>
                      <dd className="mt-1">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                          {member.membershipCategory.title}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          Fee: KES {member.membershipCategory.fee.toLocaleString()} · {member.membershipCategory.timeline === 0 ? 'One-Off Payment' : `Renewable every ${member.membershipCategory.timeline} years`}
                        </p>
                      </dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Profile Created</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(member.profileCreatedAt).toLocaleDateString()}
                    </dd>
                  </div>
                  {member.ippmsDataSyncedAt && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">IPPMS Last Synced</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {new Date(member.ippmsDataSyncedAt).toLocaleDateString()}
                      </dd>
                    </div>
                  )}
                  {member.ippmsId && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">IPPMS ID</dt>
                      <dd className="mt-1 text-sm text-gray-900">{member.ippmsId}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

