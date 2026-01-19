'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Caveat, Playfair_Display } from 'next/font/google'

const caveat = Caveat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-caveat',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair',
})

const sliderImages = [
  '/images/slider/slide1.JPG',
  '/images/slider/slide2.jpeg',
  '/images/slider/slide3.jpeg',
]

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative h-[75vh] overflow-hidden">
      {/* Background Image Slider */}
      <div className="absolute inset-0">
        {sliderImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={image}
              alt={`Slide ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
              quality={90}
            />
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-blue/50 via-[#004080]/50 to-primary-blue/50"></div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center space-y-1.5">
            {/* Welcome Text - Stylish and Elegant */}
            <h1 className={`${playfair.className} text-2xl md:text-3xl lg:text-4xl font-semibold text-white tracking-wide drop-shadow-lg italic`}>
              Welcome to the PM Party.
            </h1>

            {/* Decorative Divider */}
            <div className="flex items-center justify-center gap-2 py-1">
              <div className="h-px w-10 bg-primary-red"></div>
              <div className="w-1 h-1 bg-primary-red rounded-full"></div>
              <div className="h-px w-10 bg-primary-red"></div>
            </div>

            {/* Mission Statement - Prominent */}
            <p className="text-xs md:text-sm lg:text-base text-[#E6F2FF] leading-tight max-w-2xl mx-auto font-normal drop-shadow-md px-4">
              Join us in building a better Kenya through progressive policies, transparent governance, and people-centered development
            </p>

            {/* Tagline - Bold and Memorable */}
            <p className="text-base md:text-lg lg:text-xl font-semibold tracking-tight drop-shadow-md">
              <span className={`${caveat.className} text-white font-semibold text-lg md:text-xl lg:text-2xl`}>The Change We Need,</span> <span className={`text-primary-red ${caveat.className} font-semibold text-lg md:text-xl lg:text-2xl`}>Mabadiliko Ni Sasa!</span>
            </p>

            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link
                href="/membership"
                className="bg-primary-red hover:bg-[#9A162D] text-white px-8 py-3 rounded-md font-semibold transition shadow-lg transform hover:scale-105"
              >
                Become a Member
              </Link>
              <Link
                href="/volunteer"
                className="bg-white text-primary-blue hover:bg-gray-100 px-8 py-3 rounded-md font-semibold transition shadow-lg transform hover:scale-105"
              >
                Volunteer With Us
              </Link>
              <Link
                href="/donate"
                className="border-2 border-white text-white hover:bg-white hover:text-primary-blue px-8 py-3 rounded-md font-semibold transition shadow-lg transform hover:scale-105"
              >
                Make a Donation
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Slider Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
        {sliderImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide
                ? 'bg-primary-red w-8'
                : 'bg-white/50 w-2 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

