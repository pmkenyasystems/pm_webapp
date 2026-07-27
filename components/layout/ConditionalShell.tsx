'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'
import NDCBanner from '@/components/home/NDCBanner'

export default function ConditionalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  if (isAdmin) return <>{children}</>

  return (
    <>
      <NDCBanner />
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  )
}
