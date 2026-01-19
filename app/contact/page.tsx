export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Contact Us
        </h1>
        <div className="w-32 h-1 bg-primary-red mx-auto"></div>
        <p className="text-lg text-gray-600 mt-6">
          Get in touch with People&apos;s Renaissance Movement
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold text-primary-blue mb-6">Get in Touch</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
              <a href="mailto:info@pmkenya.ke" className="text-primary-blue hover:underline">
                info@pmkenya.ke
              </a>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Phone</h3>
              <a href="tel:+254XXXXXXXXX" className="text-primary-blue hover:underline">
                +254 XXX XXX XXX
              </a>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Address</h3>
              <p className="text-gray-700">
                People&apos;s Renaissance Movement<br />
                Nairobi, Kenya
              </p>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-semibold text-gray-900 mb-4">Office Hours</h3>
            <div className="space-y-2 text-gray-700">
              <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
              <p>Saturday: 10:00 AM - 2:00 PM</p>
              <p>Sunday: Closed</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-primary-blue mb-6">Location</h2>
          <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
            <p className="text-gray-500">Map will be embedded here</p>
            {/* Replace with actual Google Maps embed */}
          </div>
          <p className="text-sm text-gray-600 mt-4">
            Visit our office or reach out to us through any of the contact methods above.
          </p>
        </div>
      </div>

      <div className="mt-12 bg-primary-light rounded-lg p-8">
        <h2 className="text-2xl font-bold text-primary-blue mb-4">Send Us a Message</h2>
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              id="message"
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="bg-primary-red text-white px-6 py-3 rounded-md font-semibold hover:bg-[#9A162D] transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  )
}

