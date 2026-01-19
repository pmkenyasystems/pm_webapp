export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          About People&apos;s Renaissance Movement
        </h1>
        <div className="w-32 h-1 bg-primary-red mx-auto"></div>
      </div>

      <div className="prose prose-lg max-w-4xl mx-auto">
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary-blue mb-4">Our Vision</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            People&apos;s Renaissance Movement envisions a Kenya where every citizen has equal 
            opportunities, where governance is transparent and accountable, and where the 
            nation&apos;s resources serve the common good. We believe in a Kenya that works 
            for everyone, not just a select few.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary-blue mb-4">Our Mission</h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            Our mission is to transform Kenya through:
          </p>
          <ul className="list-disc list-inside text-gray-700 text-lg space-y-2 ml-4">
            <li>Progressive policies that address the real needs of Kenyans</li>
            <li>Transparent and accountable governance at all levels</li>
            <li>Economic empowerment for all citizens</li>
            <li>Social justice and equality</li>
            <li>Environmental sustainability</li>
            <li>National unity and cohesion</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary-blue mb-4">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-primary-light p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-primary-blue mb-2">Integrity</h3>
              <p className="text-gray-700">
                We conduct ourselves with honesty, transparency, and ethical behavior in all our actions.
              </p>
            </div>
            <div className="bg-primary-light p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-primary-blue mb-2">Service</h3>
              <p className="text-gray-700">
                We are committed to serving the people of Kenya with dedication and selflessness.
              </p>
            </div>
            <div className="bg-primary-light p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-primary-blue mb-2">Unity</h3>
              <p className="text-gray-700">
                We believe in bringing Kenyans together regardless of background, tribe, or creed.
              </p>
            </div>
            <div className="bg-primary-light p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-primary-blue mb-2">Progress</h3>
              <p className="text-gray-700">
                We are forward-thinking and committed to continuous improvement and development.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary-blue mb-4">Why We Exist</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Kenya needs a new kind of leadership—one that puts people first, values integrity 
            over personal gain, and works tirelessly to create opportunities for all. People&apos;s 
            Renaissance Movement was founded to be that voice, that movement, and that change.
          </p>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-bold text-primary-blue mb-4">Join Us</h2>
          <p className="text-gray-700 text-lg mb-6">
            Be part of the change. Together, we can build the Kenya we all deserve.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/membership"
              className="bg-primary-red text-white px-8 py-3 rounded-md font-semibold hover:bg-[#9A162D] transition"
            >
              Become a Member
            </a>
            <a
              href="/volunteer"
              className="bg-primary-blue text-white px-8 py-3 rounded-md font-semibold hover:bg-[#002244] transition"
            >
              Volunteer
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}

