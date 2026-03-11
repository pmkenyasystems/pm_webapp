import Link from 'next/link'

export default function LeadershipPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/about" className="inline-flex items-center gap-1 text-primary-blue font-medium hover:underline mb-8 text-sm">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to About
      </Link>

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Party Leadership</h1>
      <div className="w-24 h-1 bg-primary-red mb-6" />
      <p className="text-gray-600 mb-8">
        The People&apos;s Renaissance Movement is led by men and women committed to transparent governance,
        service, and a transformed Kenya. Leadership is organised from national level through to county,
        constituency, ward, and polling station.
      </p>
      <p className="text-gray-500 text-sm">
        Detailed profiles of office holders will be published here as they are confirmed. Check back for updates.
      </p>
    </div>
  )
}
