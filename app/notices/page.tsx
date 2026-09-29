import { STATUTORY_NOTICES } from '@/lib/notices'

export const metadata = {
  title: 'Statutory Notices — People’s Renaissance Movement',
}

export default function NoticesPage() {
  return (
    <div className="bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-4">
          <span className="font-heading font-bold tracking-[2px] text-[12px] uppercase text-primary-red">
            Compliance &amp; Transparency
          </span>
        </div>
        <h1 className="font-heading font-black text-center leading-[1.05] text-3xl md:text-5xl mb-3 text-primary-blue">
          Statutory Notices
        </h1>
        <div className="w-24 h-1 bg-primary-red mx-auto mb-6" />
        <p className="text-gray-700 text-base leading-relaxed text-center max-w-2xl mx-auto mb-4">
          In compliance with the Political Parties Act, 2011, the People&apos;s Renaissance Movement (PM Party)
          publishes the following notices filed with, and stamped as received by, the Office of the Registrar
          of Political Parties (ORPP).
        </p>
        <p className="text-xs text-gray-400 text-center max-w-2xl mx-auto mb-12">
          National ID and phone numbers appearing on the original filings have been redacted from the published
          PDFs below to protect the individuals named; all other content, including signatures and the
          Registrar&apos;s receipt stamps, is reproduced as filed.
        </p>

        <div className="space-y-4">
          {STATUTORY_NOTICES.map((notice) => (
            <div
              key={notice.slug}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200 shadow-[0_4px_16px_-8px_rgba(0,0,0,0.15)] p-6"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-[12.5px] font-extrabold text-white bg-primary-blue px-3 py-1 rounded-full">
                    {notice.form}
                  </span>
                  <span className="text-xs text-gray-400">{notice.rule}</span>
                </div>
                <h2 className="font-heading font-extrabold text-lg md:text-xl text-primary-blue mb-1">
                  {notice.title}
                </h2>
                <p className="text-xs text-gray-500">Dated {notice.dated}</p>
              </div>

              <a
                href={notice.pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-bold text-[13.5px] px-5 py-2.5 rounded-full border-[1.5px] border-primary-blue text-primary-blue hover:bg-primary-blue hover:text-white transition flex-shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H8a2 2 0 01-2-2V5a2 2 0 012-2h6l6 6v11a2 2 0 01-2 2z" />
                </svg>
                View / Download
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
