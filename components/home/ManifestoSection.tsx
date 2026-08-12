import Link from 'next/link'

const PILLARS = [
  {
    animal: 'Leopard',
    title: 'Jobs',
    bg: 'bg-primary-blue',
    description: 'Hunting for opportunity with precision and patience — dignified work for every Kenyan through enterprise, industry, and the digital economy.',
    icon: (
      <svg width="30" height="30" viewBox="0 0 64 64" fill="none">
        <path d="M18 40c2-10 8-16 14-16s12 6 14 16" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
        <circle cx="24" cy="26" r="2.8" fill="#fff" />
        <circle cx="30" cy="23" r="2.8" fill="#fff" />
        <circle cx="36" cy="23" r="2.8" fill="#fff" />
        <circle cx="42" cy="26" r="2.8" fill="#fff" />
        <path d="M20 42l24 0" stroke="#F0181E" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    animal: 'Elephant',
    title: 'Corruption',
    bg: 'bg-primary-red',
    description: "Trampling corruption with the Elephant's might, and never forgetting — tracing stolen public funds and holding the looters accountable.",
    icon: (
      <svg width="30" height="30" viewBox="0 0 64 64" fill="none">
        <ellipse cx="30" cy="34" rx="14" ry="10" fill="#fff" />
        <path d="M42 28c4-4 8-2 8 4s-4 8-8 6" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="20" cy="28" r="9" fill="#fff" />
        <path d="M14 30c-2 4-2 8 1 12" stroke="#003491" strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    animal: 'Lion',
    title: 'Constitutionalism & Rule of Law',
    bg: 'bg-primary-blue',
    description: "Defending our Constitution with the Lion's courage — our shield, our covenant, our promise to one another.",
    icon: (
      <svg width="30" height="30" viewBox="0 0 64 64" fill="none">
        <circle cx="30" cy="30" r="9" fill="#fff" />
        <path d="M14 22c2-4 6-2 6 2M18 16c3-3 6 0 5 4M44 22c-2-4-6-2-6 2M40 16c-3-3-6 0-5 4M14 40c2 4 6 2 6-2M44 40c-2 4-6 2-6-2" stroke="#F0181E" strokeWidth="3" strokeLinecap="round" fill="none" />
      </svg>
    ),
  },
  {
    animal: 'Rhino',
    title: 'Public Debt & Fiscal Policy',
    bg: 'bg-primary-red',
    description: 'Discipline and singular purpose — a government that lives within its means, taxes fairly, and borrows responsibly.',
    icon: (
      <svg width="30" height="30" viewBox="0 0 64 64" fill="none">
        <ellipse cx="28" cy="36" rx="15" ry="9" fill="#fff" />
        <path d="M42 30l10-4" stroke="#003491" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M40 26l8-6" stroke="#003491" strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    animal: 'Buffalo',
    title: 'Tribalism',
    bg: 'bg-primary-blue',
    description: 'Rising above tribalism as the Buffalo moves in the herd — a Kenya where opportunity is earned through merit, not surname or ethnicity.',
    icon: (
      <svg width="30" height="30" viewBox="0 0 64 64" fill="none">
        <ellipse cx="32" cy="36" rx="16" ry="9" fill="#fff" />
        <path d="M20 28c-3-4-2-8 2-9M24 26c-1-4 1-7 4-7M40 26c1-4-1-7-4-7M44 28c3-4 2-8-2-9" stroke="#F0181E" strokeWidth="3" strokeLinecap="round" fill="none" />
      </svg>
    ),
  },
]

export default function ManifestoSection() {
  return (
    <section id="manifesto" className="px-5 py-12 md:px-12 md:py-[88px] bg-white text-gray-900 scroll-mt-20">
      <div className="text-center mb-11">
        <span className="font-heading font-bold tracking-[2px] text-[13px] uppercase text-primary-red">
          Our Manifesto
        </span>
        <h2 className="font-heading font-black text-2xl md:text-4xl uppercase my-3.5 mb-1.5 text-primary-blue">
          The Big Five Agenda
        </h2>
        <p className="text-[14.5px] text-gray-600 max-w-[560px] mx-auto">
          Just as the Big Five define Kenya to the world, five defining challenges will shape her
          future — and we draw on their spirit to solve them.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-[18px]">
        {PILLARS.map((p) => (
          <div
            key={p.animal}
            className="p-[26px] px-5 rounded-[14px] bg-white border-[1.5px] border-gray-200 transition-transform duration-[250ms] hover:-translate-y-2"
          >
            <div className={`w-[52px] h-[52px] rounded-[14px] ${p.bg} flex items-center justify-center mb-4`}>
              {p.icon}
            </div>
            <div className="font-heading font-extrabold text-xs tracking-[1.5px] uppercase text-primary-red mb-1.5">
              {p.animal}
            </div>
            <div className="font-heading font-extrabold text-lg mb-2.5 text-primary-blue">{p.title}</div>
            <div className="text-sm leading-relaxed text-gray-600">{p.description}</div>
          </div>
        ))}
      </div>

      <div className="text-center mt-9">
        <Link
          href="/about/manifesto"
          className="inline-block font-extrabold text-[15px] px-7 py-3.5 rounded-full bg-primary-red text-white shadow-[0_8px_20px_-6px_rgba(240,24,30,0.5)] hover:bg-primary-blue transition"
        >
          Read the Full Manifesto
        </Link>
      </div>
    </section>
  )
}
