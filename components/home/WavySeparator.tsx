import Link from 'next/link'

export default function WavySeparator() {
  return (
    <div className="relative z-10 w-full flex justify-center pt-0 pb-5 md:pb-6 -mt-7 md:-mt-8">
      <div className="flex flex-col sm:flex-row items-center rounded-xl bg-blue-50/95 shadow-md border border-blue-100/80 overflow-hidden backdrop-blur-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <Link
          href="/membership"
          className="flex items-center gap-2 text-gray-700 hover:text-primary-blue font-medium px-6 py-3.5 transition-colors"
        >
          <svg className="w-5 h-5 flex-shrink-0 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Member Login
        </Link>
        <div className="hidden sm:block w-px h-6 bg-gray-200 flex-shrink-0" aria-hidden />
        <Link
          href="/aspirants/apply"
          className="flex items-center gap-2 text-gray-700 hover:text-primary-blue font-medium px-6 py-3.5 transition-colors"
        >
          <svg className="w-5 h-5 flex-shrink-0 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Aspirant Registration
        </Link>
      </div>
    </div>
  )
}
