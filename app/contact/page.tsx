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

          <div className="mt-8">
            <h3 className="font-semibold text-gray-900 mb-4">Follow Us</h3>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://www.tiktok.com/@_pmkenya?_r=1&_t=ZS-93GELwh7pNo"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-primary-blue hover:text-primary-red transition"
                aria-label="TikTok"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
                <span>TikTok</span>
              </a>
              <a
                href="https://www.instagram.com/_pmkenya?igsh=MXc2cHQxc3RqbW1kcQ=="
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-primary-blue hover:text-primary-red transition"
                aria-label="Instagram"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>Instagram</span>
              </a>
              <a
                href="https://www.facebook.com/share/14WjwU4SeEV/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-primary-blue hover:text-primary-red transition"
                aria-label="Facebook"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
              </a>
              <a
                href="https://x.com/_pmkenya"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-primary-blue hover:text-primary-red transition"
                aria-label="X (Twitter)"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span>X (Twitter)</span>
              </a>
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

