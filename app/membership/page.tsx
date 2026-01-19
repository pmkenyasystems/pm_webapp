'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function MembershipPage() {
  const [ippmsId, setIppmsId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [memberData, setMemberData] = useState<any>(null)

  const handleFetchMember = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const response = await fetch('/api/membership/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ippmsId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch member data')
      }

      setMemberData(data.member)
      setSuccess(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/membership/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ippmsId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create profile')
      }

      setSuccess(true)
      alert('Profile created successfully!')
      window.location.reload()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Membership
        </h1>
        <div className="w-32 h-1 bg-primary-red mx-auto"></div>
        <p className="text-lg text-gray-600 mt-6">
          Join People&apos;s Renaissance Movement and be part of the change
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-primary-blue mb-6">
          Create Your Member Profile
        </h2>
        <p className="text-gray-700 mb-6">
          If you&apos;ve already registered with IPPMS (Integrated Political Party Management System), 
          enter your IPPMS ID below to fetch your details and create your profile on our platform.
        </p>

        {!success ? (
          <form onSubmit={handleFetchMember} className="space-y-4">
            <div>
              <label htmlFor="ippmsId" className="block text-sm font-medium text-gray-700 mb-2">
                IPPMS ID
              </label>
              <input
                type="text"
                id="ippmsId"
                value={ippmsId}
                onChange={(e) => setIppmsId(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                placeholder="Enter your IPPMS ID"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-blue text-white px-6 py-3 rounded-md font-semibold hover:bg-[#002244] transition disabled:opacity-50"
            >
              {loading ? 'Fetching...' : 'Fetch Member Details'}
            </button>
          </form>
        ) : memberData ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
              Member details fetched successfully!
            </div>
            <div className="bg-gray-50 p-6 rounded-md">
              <h3 className="font-semibold mb-4">Member Information:</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Name:</strong> {memberData.firstName} {memberData.lastName}</p>
                <p><strong>Email:</strong> {memberData.email || 'N/A'}</p>
                <p><strong>Phone:</strong> {memberData.phone}</p>
                <p><strong>ID Number:</strong> {memberData.idNumber}</p>
              </div>
            </div>
            <form onSubmit={handleCreateProfile}>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-red text-white px-6 py-3 rounded-md font-semibold hover:bg-[#9A162D] transition disabled:opacity-50"
              >
                {loading ? 'Creating Profile...' : 'Create Profile'}
              </button>
            </form>
          </div>
        ) : null}
      </div>

      <div className="bg-primary-light rounded-lg p-8">
        <h2 className="text-2xl font-bold text-primary-blue mb-4">
          Not Registered with IPPMS?
        </h2>
        <p className="text-gray-700 mb-6">
          To become a member of People&apos;s Renaissance Movement, you need to first register 
          through the Integrated Political Party Management System (IPPMS). Here&apos;s how:
        </p>
        <ol className="list-decimal list-inside space-y-3 text-gray-700 mb-6">
          <li>Visit the official IPPMS portal at <a href="https://ippms.ke" target="_blank" rel="noopener noreferrer" className="text-primary-blue hover:underline">ippms.ke</a></li>
          <li>Create an account or log in if you already have one</li>
          <li>Complete the membership registration form</li>
          <li>Submit your registration and wait for approval</li>
          <li>Once approved, you&apos;ll receive your IPPMS ID</li>
          <li>Return here and enter your IPPMS ID to create your profile</li>
        </ol>
        <div className="bg-white p-4 rounded-md">
          <p className="text-sm text-gray-600">
            <strong>Note:</strong> IPPMS registration is mandatory for all political party members 
            in Kenya as per the Political Parties Act. This ensures transparency and proper 
            management of party membership.
          </p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/volunteer"
          className="text-primary-blue hover:underline"
        >
          Not ready to become a member? Consider volunteering instead →
        </Link>
      </div>
    </div>
  )
}

