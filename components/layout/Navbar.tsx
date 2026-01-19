'use client'

import Link from 'next/link'
import { useState } from 'react'
import Image from 'next/image'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-16 h-16 relative">
                <Image
                  src="/logo.png"
                  alt="People's Renaissance Movement Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="block">
                <div className="text-primary-blue font-bold text-sm md:text-lg uppercase">
                  People&apos;s Renaissance Movement
                </div>
                <div className="text-primary-red text-[10px] md:text-xs uppercase">
                  The Change We Need
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-primary-blue transition">
              Home
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-primary-blue transition">
              About Us
            </Link>
            <Link href="/membership" className="text-gray-700 hover:text-primary-blue transition">
              Membership
            </Link>
            <Link href="/volunteer" className="text-gray-700 hover:text-primary-blue transition">
              Volunteer
            </Link>
            <Link href="/donate" className="bg-primary-red text-white px-4 py-2 rounded-md hover:bg-[#9A162D] transition">
              Donate
            </Link>
            <Link href="/articles" className="text-gray-700 hover:text-primary-blue transition">
              News
            </Link>
            <Link href="/events" className="text-gray-700 hover:text-primary-blue transition">
              Events
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-primary-blue transition">
              Contact
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary-blue focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
            <Link href="/" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
              Home
            </Link>
            <Link href="/about" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
              About Us
            </Link>
            <Link href="/membership" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
              Membership
            </Link>
            <Link href="/volunteer" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
              Volunteer
            </Link>
            <Link href="/donate" className="block px-3 py-2 bg-primary-red text-white rounded-md">
              Donate
            </Link>
            <Link href="/articles" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
              News
            </Link>
            <Link href="/events" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
              Events
            </Link>
            <Link href="/contact" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

