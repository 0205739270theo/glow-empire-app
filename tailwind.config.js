/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'glow-gold': '#D4AF37',
        'glow-cream': '#FDFCFB',
      },
    },
  },
  plugins: [],
}