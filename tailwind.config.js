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
        sans: ['var(--font-lato)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-lato)', 'sans-serif'],
        display: ['var(--font-lato)', 'sans-serif'],
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

