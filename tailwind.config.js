/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
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

