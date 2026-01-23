'use client'

import { signOut } from 'next-auth/react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface AdminHeaderProps {
  title: string
  children?: React.ReactNode
}

export default function AdminHeader({ title, children }: AdminHeaderProps) {
  const { data: session } = useSession()
  const router = useRouter()

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/admin/login')
  }

  return (
    <div className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {session?.user?.email && (
              <p className="text-sm text-gray-600 mt-1">
                Logged in as: {session.user.email}
              </p>
            )}
          </div>
          <div className="flex items-center gap-4">
            {children}
            <Link
              href="/admin/dashboard"
              className="text-gray-700 hover:text-primary-blue transition"
            >
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="bg-primary-red text-white px-4 py-2 rounded-md hover:bg-[#9A162D] transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

