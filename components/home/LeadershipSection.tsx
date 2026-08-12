import Link from 'next/link'

const ORG_LEVELS = [
  { num: '1', name: 'National', desc: 'NEC & Secretariat' },
  { num: '2', name: 'County', desc: '47 County Chapters' },
  { num: '3', name: 'Constituency', desc: '290 Chapters' },
  { num: '4', name: 'Ward', desc: '1,450 Wards' },
  { num: '5', name: 'Polling Station', desc: 'Grassroots Agents' },
]

export default function LeadershipSection() {
  return (
    <section id="leadership" className="px-5 py-12 md:px-12 md:py-[88px] bg-white scroll-mt-20">
      <div className="text-center mb-11">
        <span className="font-heading font-bold tracking-[2px] text-[13px] uppercase text-primary-red">
          Party Structure
        </span>
        <h2 className="font-heading font-black text-2xl md:text-4xl uppercase mt-3.5 text-primary-blue">
          From National To The Polling Station
        </h2>
      </div>

      <div className="flex flex-col md:flex-row gap-3.5 md:gap-0 items-stretch max-w-[1200px] mx-auto">
        {ORG_LEVELS.map((lvl, i) => (
          <div
            key={lvl.num}
            className="flex-1 relative p-7 px-4 text-center bg-white border-[1.5px] border-gray-200 rounded-[14px] mx-0 md:mx-[3px] transition-transform duration-200 hover:-translate-y-1.5"
          >
            <div
              className={`w-9 h-9 rounded-full ${i % 2 === 0 ? 'bg-primary-blue' : 'bg-primary-red'} text-white font-heading font-extrabold text-[15px] flex items-center justify-center mx-auto mb-3.5`}
            >
              {lvl.num}
            </div>
            <div className="font-heading font-extrabold text-[15px] uppercase tracking-wide text-primary-blue">
              {lvl.name}
            </div>
            <div className="text-[13px] text-gray-600 mt-2">{lvl.desc}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-4 mt-10">
        <Link
          href="/about/leadership-structure"
          className="font-extrabold text-[15px] px-[26px] py-3 rounded-full border-2 border-primary-blue text-primary-blue hover:bg-primary-blue hover:text-white transition"
        >
          Explore Structure
        </Link>
        <Link
          href="/about/leadership"
          className="font-extrabold text-[15px] px-[26px] py-3 rounded-full bg-primary-blue text-white hover:bg-primary-red transition"
        >
          Meet the Leaders
        </Link>
      </div>
    </section>
  )
}
