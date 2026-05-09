import Link from 'next/link'
import StandingCommittees from '@/components/home/StandingCommittees'

export default function HomeAboutSection() {
  return (
    <section
      id="about"
      className="py-10 bg-white bg-cover bg-center bg-no-repeat scroll-mt-20"
      style={{ backgroundImage: 'url(/images/bg/blue_dots.png)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1.5">About Us</h2>
          <div className="w-16 h-0.5 bg-primary-red mx-auto mb-3" />
          <p className="text-gray-600 text-base max-w-2xl mx-auto leading-snug">
            The People&apos;s Renaissance Movement (PM Party) is committed to transforming Kenya through
            people-centred policies, transparent governance, and inclusive development. We stand for
            integrity, service, and progress that benefits every citizen.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Party Leadership Structure */}
          <div className="group relative bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
            <div className="h-2 bg-gradient-to-r from-primary-blue to-primary-blue/60" />
            <div className="p-6 flex flex-col flex-1">
              <div className="w-14 h-14 rounded-xl bg-primary-blue/10 flex items-center justify-center mb-4 group-hover:bg-primary-blue/20 transition-colors">
                <svg className="w-7 h-7 text-primary-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Party Leadership Structure</h3>
              <p className="text-gray-500 text-sm leading-relaxed flex-1">
                Our party is organised from national level down to the grassroots — National, County, Constituency, Ward, and Polling Station — with clear roles at each tier.
              </p>
              <Link
                href="/about/leadership-structure"
                className="mt-5 inline-flex items-center gap-1.5 text-primary-blue font-semibold text-sm hover:gap-2.5 transition-all"
              >
                Explore Structure
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Party Leadership */}
          <div className="group relative bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
            <div className="h-2 bg-gradient-to-r from-primary-red to-primary-red/60" />
            <div className="p-6 flex flex-col flex-1">
              <div className="w-14 h-14 rounded-xl bg-primary-red/10 flex items-center justify-center mb-4 group-hover:bg-primary-red/20 transition-colors">
                <svg className="w-7 h-7 text-primary-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Party Leadership</h3>
              <p className="text-gray-500 text-sm leading-relaxed flex-1">
                Meet the men and women leading the People&apos;s Renaissance Movement at national and regional levels, driving our vision for Kenya.
              </p>
              <Link
                href="/about/leadership"
                className="mt-5 inline-flex items-center gap-1.5 text-primary-red font-semibold text-sm hover:gap-2.5 transition-all"
              >
                Meet the Leaders
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Our Manifesto */}
          <div className="group relative bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
            <div className="h-2 bg-gradient-to-r from-primary-blue via-primary-red to-primary-blue/60" />
            <div className="p-6 flex flex-col flex-1">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-blue/10 to-primary-red/10 flex items-center justify-center mb-4 group-hover:from-primary-blue/20 group-hover:to-primary-red/20 transition-colors">
                <svg className="w-7 h-7 text-primary-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Our Party Manifesto</h3>
              <p className="text-gray-500 text-sm leading-relaxed flex-1">
                Our commitments and plans to transform Kenya — from economy and education to health, youth, and constitutional order.
              </p>
              <Link
                href="/about/manifesto"
                className="mt-5 inline-flex items-center gap-1.5 text-primary-blue font-semibold text-sm hover:gap-2.5 transition-all"
              >
                Read the Manifesto
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

        </div>

        <StandingCommittees embedded />
      </div>
    </section>
  )
}
