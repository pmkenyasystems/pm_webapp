'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [memberLoggedIn, setMemberLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if member is logged in via localStorage
    const memberSession = localStorage.getItem('memberSession')
    setMemberLoggedIn(!!memberSession)

    // If admin session is loading, wait
    if (status === 'loading') {
      return
    }

    // If admin is logged in, redirect to dashboard
    if (session) {
      router.push('/admin/dashboard')
      return
    }

    // If not logged in as admin and no member session, redirect to login
    if (!memberSession) {
      router.push('/admin/login')
      return
    }

    setLoading(false)
  }, [session, status, router])

  const handleLogoutMember = () => {
    localStorage.removeItem('memberSession')
    setMemberLoggedIn(false)
    router.push('/admin/login')
  }

  // Show loading state while checking
  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // If admin is logged in, this won't show (redirect happens)
  // If member is logged in, show notification
  if (memberLoggedIn && !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                <svg
                  className="h-6 w-6 text-yellow-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Member Session Active
              </h2>
              <p className="text-gray-600">
                You are currently logged in as a member. Please log out from your member account to access the admin panel.
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> You need to log out as a member first before you can log in as an admin.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleLogoutMember}
                className="w-full bg-primary-red text-white px-4 py-3 rounded-md font-semibold hover:bg-[#9A162D] transition"
              >
                Log Out as Member
              </button>
              <Link
                href="/membership"
                className="block w-full text-center bg-gray-200 text-gray-700 px-4 py-3 rounded-md font-semibold hover:bg-gray-300 transition"
              >
                Go to Membership Page
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Fallback: redirect to login (shouldn't reach here normally)
  return null
}

