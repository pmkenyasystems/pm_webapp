import Link from 'next/link'

function Connector() {
  return (
    <div className="flex justify-center py-2">
      <div className="w-0.5 h-5 bg-primary-blue/50" aria-hidden />
    </div>
  )
}

function GovernanceTier({
  level,
  roles,
  isFirst,
  isLast,
}: {
  level: string
  roles: string[]
  isFirst?: boolean
  isLast?: boolean
}) {
  return (
    <div
      className={`
        border-2 border-primary-blue/30 rounded-lg overflow-hidden
        ${isFirst ? 'bg-primary-blue/10' : 'bg-white'}
        ${isLast ? 'shadow-md' : ''}
      `}
    >
      <div className="bg-primary-blue text-white px-4 py-2 font-semibold text-center">
        {level}
      </div>
      <div className="p-4 flex flex-wrap gap-2 justify-center">
        {roles.map((role) => (
          <span
            key={role}
            className="inline-block px-3 py-1.5 bg-gray-100 text-gray-800 rounded-full text-sm font-medium border border-gray-200"
          >
            {role}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function LeadershipStructurePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/about" className="inline-flex items-center gap-1 text-primary-blue font-medium hover:underline mb-8 text-sm">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to About
      </Link>

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Party Leadership Structure</h1>
      <div className="w-24 h-1 bg-primary-red mb-6" />
      <p className="text-gray-600 mb-10">
        Our party is organised from the national level down to the polling station. The organogram below shows leadership roles at each tier.
      </p>

      <div className="space-y-0">
        <GovernanceTier
          level="National Leadership"
          roles={[
            'Party Leader',
            'Deputy Party Leader',
            'Secretary General',
            'Chairman',
            'Treasurer',
            'Organising Secretary',
            'Executive Director',
            'Deputy Chairman',
            'Deputy Secretary General',
            'Deputy Treasurer',
            'Deputy Organising Secretary',
            'Deputy Executive Director',
          ]}
          isFirst
        />
        <Connector />
        <GovernanceTier
          level="County"
          roles={[
            'Chairman',
            'Secretary General',
            'Treasurer',
            'Organising Secretary',
            'Youth Representative',
            'Women Representative',
            'PWD Representative',
          ]}
        />
        <Connector />
        <GovernanceTier
          level="Constituency"
          roles={[
            'Chairman',
            'Secretary General',
            'Treasurer',
            'Organising Secretary',
            'Youth Representative',
            'Women Representative',
            'PWD Representative',
          ]}
        />
        <Connector />
        <GovernanceTier
          level="Ward"
          roles={[
            'Chairman',
            'Secretary General',
            'Treasurer',
            'Organising Secretary',
            'Youth Representative',
            'Women Representative',
            'PWD Representative',
          ]}
        />
        <Connector />
        <GovernanceTier
          level="Polling Station"
          roles={[
            'Chairman',
            'Secretary General',
            'Treasurer',
            'Organising Secretary',
            'Youth Representative',
            'Women Representative',
            'PWD Representative',
          ]}
          isLast
        />
      </div>
    </div>
  )
}
