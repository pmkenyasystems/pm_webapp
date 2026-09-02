import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-4">
          <span className="font-heading font-bold tracking-[2px] text-[12px] uppercase text-primary-red">
            The Change We Need
          </span>
        </div>
        <h1 className="font-heading font-black text-center leading-[1.05] text-3xl md:text-5xl mb-3 text-primary-blue">
          About People&apos;s Renaissance Movement
        </h1>
        <div className="w-24 h-1 bg-primary-red mx-auto mb-12" />

        <section className="mb-10">
          <h2 className="font-heading font-extrabold text-2xl text-primary-red mb-3">Vision</h2>
          <p className="text-gray-700 text-base leading-relaxed">
            A new Kenya where citizens are self-reliant, empowered and united, living in a society
            anchored in justice, dignity and equal opportunities for all.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-heading font-extrabold text-2xl text-primary-red mb-3">Mission</h2>
          <p className="text-gray-700 text-base leading-relaxed">
            To lead a national renaissance that will transform Kenya&apos;s economy, through inclusive
            governance, promotion of political and social justice; to cultivate a new culture of hard
            work, innovation, self-reliance and civic responsibility and build a nation where every
            citizen irrespective of their background has the freedom and opportunity to realise their
            full potential.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="font-heading font-extrabold text-2xl text-primary-red mb-3">Ideology</h2>
          <div className="space-y-4">
            <p className="text-gray-700 text-base leading-relaxed">
              The People&apos;s Renaissance Movement (PM Party) is founded on the ideology of Liberal
              Democracy &mdash; a belief in the primacy of the individual&apos;s rights and freedoms,
              safeguarded by constitutionally established institutions, and grounded in the rule of law,
              justice, and accountable governance.
            </p>
            <p className="text-gray-700 text-base leading-relaxed">
              The Party promotes a society where citizens are empowered to be self-reliant socially,
              economically, and politically, taking active responsibility for shaping their own destinies
              and contributing meaningfully to national development.
            </p>
            <p className="text-gray-700 text-base leading-relaxed">
              While the government plays a crucial enabling and regulatory role, citizens are not to be
              passive recipients of state support, but active agents of change, innovation, and community
              leadership.
            </p>
          </div>
        </section>

        <section className="mt-14 border-t border-gray-200 pt-10">
          <h2 className="font-heading font-extrabold text-2xl text-primary-blue mb-5 text-center">Learn More</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { href: '/about/leadership', label: 'Party Leadership', description: 'Meet the people leading the movement.' },
              { href: '/about/manifesto', label: 'Our Manifesto', description: 'Our Big Five Agenda for Kenya.' },
              { href: '/about/leadership-structure', label: 'Leadership Structure', description: 'How the party is organised, county to ward.' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group p-5 rounded-2xl border-[1.5px] border-gray-200 hover:border-primary-red transition"
              >
                <div className="font-heading font-extrabold text-primary-blue mb-1.5 flex items-center justify-between">
                  {item.label}
                  <svg className="w-4 h-4 text-primary-red opacity-0 group-hover:opacity-100 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">{item.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="text-center mt-14 border-t border-gray-200 pt-10">
          <h2 className="font-heading font-extrabold text-2xl text-primary-blue mb-2">Join the Movement</h2>
          <p className="text-gray-700 text-base mb-5">
            Be part of the change. Together, we can build the Kenya we all deserve.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/membership/register"
              className="font-bold text-[15px] px-7 py-3.5 rounded-full bg-primary-red text-white shadow-[0_8px_20px_-6px_rgba(240,24,30,0.5)] hover:bg-primary-blue transition"
            >
              Become a Member
            </Link>
            <Link
              href="/volunteer"
              className="font-bold text-[15px] px-7 py-3.5 rounded-full bg-primary-blue text-white hover:bg-primary-red transition"
            >
              Volunteer
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
