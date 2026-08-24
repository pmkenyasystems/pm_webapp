/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-barlow)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-barlow-semi-condensed)', 'sans-serif'],
        display: ['var(--font-barlow-semi-condensed)', 'sans-serif'],
      },
      colors: {
        primary: {
          blue: '#003491', // Dark blue sampled from logo
          red: '#F0181E', // Red sampled from logo
          light: '#E6F2FF', // Light blue tint
        },
      },
    },
  },
  plugins: [],
}

