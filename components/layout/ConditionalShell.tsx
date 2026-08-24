'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'
import NDCBanner from '@/components/home/NDCBanner'

export default function ConditionalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')
  const isBare =
    pathname.startsWith('/ndc') ||
    pathname.startsWith('/countdown') ||
    pathname === '/membership/login' ||
    pathname === '/membership/register' ||
    pathname === '/membership/profile'

  if (isAdmin || isBare) return <>{children}</>

  return (
    <>
      <NDCBanner />
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  )
}
