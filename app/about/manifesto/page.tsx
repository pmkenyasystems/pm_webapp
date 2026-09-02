import Link from 'next/link'
import Image from 'next/image'

const PILLARS = [
  {
    animal: 'The Leopard',
    title: 'Jobs',
    tagline: '',
    image: '/images/manifesto/leopard.jpg',
    body: [
      "Like the Leopard, known for its precision, agility and patience, our number one pillar is about hunting for opportunities for our young people. We shall do it with the Leopard's focus and purpose.",
      'Every Kenyan deserves the dignity of work. We shall support businesses, create new industries, develop policies that encourage entrepreneurship, and unlock the immense potential of the digital economy.',
    ],
  },
  {
    animal: 'The Elephant',
    title: 'Corruption',
    tagline: 'The Elephant In the Room',
    image: '/images/manifesto/elephant.jpg',
    body: [
      'With the might of the Elephant, we shall trample corruption into the ground. And just as the elephant never forgets, neither shall we.',
      'We shall trace stolen public money and hold accountable those who impoverished our nation by looting public coffers. From SHA, to the fuel scandal, to the fake fertiliser saga, and every injustice committed against the people of Kenya, there shall be accountability. No one will be above the law.',
    ],
  },
  {
    animal: 'The Lion',
    title: 'Constitutionalism, Social Justice and the Rule of Law',
    tagline: '',
    image: '/images/manifesto/lion.jpg',
    body: [
      'To defend Constitutionalism, Social Justice and the Rule of Law, we draw from the courage of the Lion, the King of the Jungle.',
      'Our Constitution is not merely a document. It is our shield, our covenant, and our promise to one another as a people. We shall defend it fearlessly.',
    ],
  },
  {
    animal: 'The Rhino',
    title: 'Public Debt Management, Fiscal Policy and Economic Recovery',
    tagline: '',
    image: '/images/manifesto/rhino.jpg',
    body: [
      'Here, we borrow from the Rhino, a symbol of strength, discipline and singular purpose.',
      'We shall run a government that lives within its means, where taxation is fair, borrowing is responsible, and every public shilling is accounted for. We shall also review past borrowing and ensure that those who abused public resources are held accountable.',
    ],
  },
  {
    animal: 'The Buffalo',
    title: 'Tribalism',
    tagline: '',
    image: '/images/manifesto/buffalo.jpg',
    body: [
      'The fifth pillar is just as important. Kenya must rise above tribalism. For this, we look to the Buffalo.',
      'Buffaloes survive because they move together. In the herd, they protect one another. They understand that together they are stronger. That is the Kenya we believe in.',
      'A Kenya where no tribe is greater than another. A Kenya where opportunity is earned through merit, not surname or ethnicity. A Kenya where an Ogiek, an El Molo, a Borana, a Digo, a Luo, a Kalenjin, a Kikuyu, a Luhya, a Kamba, an Indian, or any other Kenyan child can dream of becoming President, and know that dream is within reach.',
    ],
  },
]

export default function ManifestoPage() {
  return (
    <div className="bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/about" className="inline-flex items-center gap-1 text-primary-blue font-medium hover:underline mb-8 text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to About
        </Link>

        <div className="text-center mb-4">
          <span className="font-heading font-bold tracking-[2px] text-[12px] uppercase text-primary-red">
            People&apos;s Renaissance Movement (PM) Party
          </span>
        </div>
        <h1 className="font-heading font-black text-center leading-[1.05] text-3xl md:text-5xl mb-3 text-primary-blue">
          Our Manifesto
        </h1>
        <div className="w-24 h-1 bg-primary-red mx-auto mb-8" />

        <div className="prose prose-lg max-w-none text-gray-700">
          <p className="text-base leading-relaxed">
            Just as our beautiful Big Five define Kenya to the world, the PM Party has identified five
            defining areas that will shape our country&apos;s future: Jobs; Corruption; Constitutionalism,
            Social Justice and the Rule of Law; Public Debt Management and Fiscal Policy; and Tribalism.
          </p>
          <p className="text-base leading-relaxed">But we will do more than identify these problems.</p>
          <p className="text-base leading-relaxed">
            We will draw inspiration from the Big Five themselves in solving them.
          </p>
        </div>

        {/* Pillars */}
        <div className="mt-12 space-y-10">
          {PILLARS.map((p, i) => (
            <section key={p.animal} className="grid grid-cols-1 md:grid-cols-5 gap-5 md:gap-7 items-start">
              <div className={`md:col-span-2 ${i % 2 === 1 ? 'md:order-2' : ''}`}>
                <div className="relative w-full h-[180px] md:h-[200px] rounded-2xl overflow-hidden border-[1.5px] border-gray-200">
                  <Image src={p.image} alt={p.animal} fill sizes="(max-width: 768px) 100vw, 40vw" className="object-cover" />
                </div>
              </div>
              <div className={`md:col-span-3 ${i % 2 === 1 ? 'md:order-1' : ''}`}>
                <div className="font-heading font-extrabold text-xs tracking-[1.5px] uppercase text-primary-red mb-1.5">
                  {String(i + 1).padStart(2, '0')} &middot; {p.animal}
                </div>
                <h2 className="font-heading font-extrabold text-xl md:text-2xl text-primary-blue mb-1">{p.title}</h2>
                {p.tagline && (
                  <p className="text-sm font-semibold text-gray-500 italic mb-3">{p.tagline}</p>
                )}
                <div className={`space-y-2.5 ${p.tagline ? '' : 'mt-3'}`}>
                  {p.body.map((para, j) => (
                    <p key={j} className="text-[15px] leading-relaxed text-gray-700">
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* Open invitation */}
        <section className="mt-14 border-t border-gray-200 pt-10">
          <div className="space-y-2.5 text-gray-700">
            <p className="text-base leading-relaxed">
              That is why we are opening our doors to every Kenyan. We invite members and aspirants from
              every corner of our republic to seek leadership through the PM Party, from President to
              Governor, Senator, Member of Parliament, Woman Representative, and MCA.
            </p>
            <p className="text-base font-semibold text-primary-blue leading-relaxed">
              This movement belongs to all of us.
            </p>
          </div>
        </section>

        {/* Closing */}
        <section className="mt-10 text-center">
          <p className="text-lg font-semibold text-gray-800 leading-relaxed mb-3">
            Let us begin the journey of building the Kenya we know is possible.
          </p>
          <p className="font-heading font-extrabold tracking-[0.08em] text-primary-red">
            #TukoChama &nbsp; #TukoPM
          </p>
        </section>

        {/* CTA */}
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
              href="/aspirants/apply"
              className="font-bold text-[15px] px-7 py-3.5 rounded-full bg-primary-blue text-white hover:bg-primary-red transition"
            >
              Apply as Aspirant
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
