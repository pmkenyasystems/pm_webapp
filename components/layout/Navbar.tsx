'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [getInvolvedOpen, setGetInvolvedOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(path)
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 md:w-14 md:h-14 relative flex-shrink-0 rounded-full overflow-hidden border-2 border-primary-blue/20">
              <Image
                src="/logo.png"
                alt="People's Renaissance Movement Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div>
              <div className="text-primary-blue font-bold text-xs md:text-base uppercase tracking-tight leading-tight">
                People&apos;s Renaissance Movement
              </div>
              <div className="text-primary-red text-[10px] md:text-xs uppercase font-medium">
                The Change We Need
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`transition ${
                isActive('/') ? 'text-primary-blue font-semibold border-b-2 border-primary-blue pb-1' : 'text-gray-700 hover:text-primary-blue'
              }`}
            >
              Home
            </Link>
            <Link
              href="/#about"
              className="text-gray-700 hover:text-primary-blue transition"
            >
              About Us
            </Link>
            <div
              className="relative"
              onMouseEnter={() => setGetInvolvedOpen(true)}
              onMouseLeave={() => setGetInvolvedOpen(false)}
            >
              <button
                type="button"
                className={`transition flex items-center gap-1 py-1 ${
                  pathname === '/membership' || pathname === '/volunteer' || pathname === '/donate' || pathname.startsWith('/aspirants')
                    ? 'text-primary-blue font-semibold border-b-2 border-primary-blue pb-1' : 'text-gray-700 hover:text-primary-blue'
                }`}
                aria-expanded={getInvolvedOpen}
                aria-haspopup="true"
              >
                Get Involved
                <svg className={`w-4 h-4 transition-transform ${getInvolvedOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {getInvolvedOpen && (
                <div className="absolute left-0 top-full pt-1 min-w-[200px]">
                  <div className="bg-white rounded-lg shadow-lg border border-gray-100 py-2">
                    <Link href="/membership" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-blue transition" onClick={() => setGetInvolvedOpen(false)}>Become a Member</Link>
                    <Link href="/volunteer" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-blue transition" onClick={() => setGetInvolvedOpen(false)}>Volunteer</Link>
                    <Link href="/donate" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-blue transition" onClick={() => setGetInvolvedOpen(false)}>Donate</Link>
                    <Link href="/aspirants/apply" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-blue transition" onClick={() => setGetInvolvedOpen(false)}>Apply as Aspirant</Link>
                  </div>
                </div>
              )}
            </div>
            <Link
              href="/#contacts"
              className="text-gray-700 hover:text-primary-blue transition"
            >
              Contacts
            </Link>
          </div>

          {/* Mobile menu button - red square with white lines */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-primary-red text-white p-2.5 rounded focus:outline-none hover:bg-[#9A162D] transition"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-1">
            <Link href="/" className={`block px-3 py-2.5 rounded ${isActive('/') ? 'bg-primary-blue text-white font-semibold' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => setIsOpen(false)}>Home</Link>
            <Link href="/#about" className="block px-3 py-2.5 rounded text-gray-700 hover:bg-gray-100" onClick={() => setIsOpen(false)}>About Us</Link>
            <div className="pt-2 pb-1">
              <p className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">Get Involved</p>
              <Link href="/membership" className={`block px-3 py-2.5 rounded text-sm ${isActive('/membership') ? 'bg-primary-blue text-white font-semibold' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => setIsOpen(false)}>Become a Member</Link>
              <Link href="/volunteer" className={`block px-3 py-2.5 rounded text-sm ${isActive('/volunteer') ? 'bg-primary-blue text-white font-semibold' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => setIsOpen(false)}>Volunteer</Link>
              <Link href="/donate" className="block px-3 py-2.5 rounded text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsOpen(false)}>Donate</Link>
              <Link href="/aspirants/apply" className={`block px-3 py-2.5 rounded text-sm ${pathname.startsWith('/aspirants') ? 'bg-primary-blue text-white font-semibold' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => setIsOpen(false)}>Apply as Aspirant</Link>
            </div>
            <Link href="/articles" className="block px-3 py-2.5 rounded text-gray-700 hover:bg-gray-100" onClick={() => setIsOpen(false)}>Updates</Link>
            <Link href="/#contacts" className="block px-3 py-2.5 rounded text-gray-700 hover:bg-gray-100" onClick={() => setIsOpen(false)}>Contacts</Link>
          </div>
        </div>
      )}
    </nav>
  )
}

