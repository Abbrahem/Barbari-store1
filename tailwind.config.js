/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'cairo': ['Cairo', 'sans-serif'],
      },
      colors: {
        'dark': '#1a1a1a',
        'light-gray': '#f5f5f5',
      }
    },
  },
  plugins: [],
}
