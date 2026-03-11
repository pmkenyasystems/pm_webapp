import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getCommitteeBySlug, committees, sortMembersByRole } from '@/lib/committees'

export function generateStaticParams() {
  return committees.map((c) => ({ slug: c.id }))
}

export default async function CommitteePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const committee = getCommitteeBySlug(slug)

  if (!committee) {
    notFound()
  }

  const sortedMembers = committee.members?.length
    ? sortMembersByRole(committee.members)
    : []

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/#about"
          className="inline-flex items-center gap-1 text-primary-blue font-medium hover:underline mb-8"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Standing Committees
        </Link>

        <article className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="aspect-[21/9] bg-gradient-to-br from-primary-blue to-primary-blue/80 flex items-center justify-center">
            <span className="text-white/90 text-6xl md:text-7xl font-bold">
              {committee.title.charAt(0)}
            </span>
          </div>
          <div className="p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {committee.title}
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              {committee.description}
            </p>
            <p className="text-gray-600 text-base leading-relaxed mb-8">
              Each standing committee has a maximum of <strong>9 members</strong>. Volunteers are also welcome to assist the committee in running its activities and programmes. If you would like to contribute your time and skills, please get in touch via the volunteer form.
            </p>
            <Link
              href="/volunteer"
              className="inline-flex items-center gap-2 bg-primary-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#9A162D] transition"
            >
              Volunteer with this committee
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </article>

        {/* Committee members */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Committee Members</h2>
          {sortedMembers.length > 0 ? (
            <div className="space-y-8">
              {sortedMembers.map((member) => (
                <div
                  key={`${member.name}-${member.role}`}
                  className="bg-white rounded-xl shadow-md border border-gray-100 p-6 flex flex-col sm:flex-row gap-6"
                >
                  <div className="flex-shrink-0">
                    {member.profileImage ? (
                      <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-gray-200">
                        <Image
                          src={member.profileImage}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="128px"
                        />
                      </div>
                    ) : (
                      <div className="w-32 h-32 rounded-lg bg-primary-blue/10 flex items-center justify-center">
                        <span className="text-4xl font-bold text-primary-blue">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-primary-blue font-medium text-sm mt-0.5">{member.role}</p>
                    <p className="text-gray-600 text-sm leading-relaxed mt-3">
                      {member.bio}
                    </p>
                    <div className="flex items-center gap-4 mt-4">
                      {member.email ? (
                        <a
                          href={`mailto:${member.email}`}
                          className="inline-flex items-center gap-1.5 text-gray-600 hover:text-primary-blue transition"
                          aria-label={`Email ${member.name}`}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm">Email</span>
                        </a>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-gray-400" aria-hidden>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm">Email</span>
                        </span>
                      )}
                      {member.linkedinUrl ? (
                        <a
                          href={member.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-gray-600 hover:text-[#0A66C2] transition"
                          aria-label={`${member.name} on LinkedIn`}
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                          <span className="text-sm">LinkedIn</span>
                        </a>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-gray-400" aria-hidden>
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                          <span className="text-sm">LinkedIn</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-500">
              <p>Committee members will be listed here once appointed.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
