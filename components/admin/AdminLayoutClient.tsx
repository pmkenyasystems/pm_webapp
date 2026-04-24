'use client'

import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import AdminSidebar from './AdminSidebar'

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'

  // Show only children on login page or when session is loading
  if (isLoginPage || status === 'loading') {
    return <>{children}</>
  }

  // Not logged in and not on login page – still just render children (redirect happens in pages)
  if (!session) {
    return <>{children}</>
  }

  // Logged in: sidebar on the left, main content on the right
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 min-w-0 overflow-auto">
        {children}
      </main>
    </div>
  )
}
