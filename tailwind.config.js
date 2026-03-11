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
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-poppins)', 'var(--font-inter)', 'sans-serif'],
        display: ['var(--font-montserrat)', 'var(--font-inter)', 'sans-serif'],
      },
      colors: {
        primary: {
          blue: '#003366', // Dark blue from logo
          red: '#C41E3A', // Red from logo
          light: '#E6F2FF', // Light blue tint
        },
      },
    },
  },
  plugins: [],
}

