import Link from 'next/link'
import Image from 'next/image'

const PILLARS = [
  {
    animal: 'Leopard',
    title: 'Jobs',
    image: '/images/manifesto/leopard.jpg',
    description: 'Hunting for opportunity with precision and patience — dignified work for every Kenyan through enterprise, industry, and the digital economy.',
  },
  {
    animal: 'Elephant',
    title: 'Corruption',
    image: '/images/manifesto/elephant.jpg',
    description: "Trampling corruption with the Elephant's might, and never forgetting — tracing stolen public funds and holding the looters accountable.",
  },
  {
    animal: 'Lion',
    title: 'Constitutionalism & Rule of Law',
    image: '/images/manifesto/lion.jpg',
    description: "Defending our Constitution with the Lion's courage — our shield, our covenant, our promise to one another.",
  },
  {
    animal: 'Rhino',
    title: 'Public Debt & Fiscal Policy',
    image: '/images/manifesto/rhino.jpg',
    description: 'Discipline and singular purpose — a government that lives within its means, taxes fairly, and borrows responsibly.',
  },
  {
    animal: 'Buffalo',
    title: 'Tribalism',
    image: '/images/manifesto/buffalo.jpg',
    description: 'Rising above tribalism as the Buffalo moves in the herd — a Kenya where opportunity is earned through merit, not surname or ethnicity.',
  },
]

export default function ManifestoSection() {
  return (
    <section id="manifesto" className="py-12 md:py-[88px] bg-white text-gray-900 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <div className="relative w-full h-[140px] rounded-[14px] overflow-hidden mb-4">
              <Image
                src={p.image}
                alt={`${p.animal} — ${p.title}`}
                fill
                sizes="(max-width: 768px) 100vw, 20vw"
                className="object-cover"
              />
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
      </div>
    </section>
  )
}
