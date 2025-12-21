/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'bayut-green': '#00423a',
        'bayut-hover': '#005a4e',
        'bayut-bg': '#f9f9f9',
      },
      fontFamily: {
        'sans': ['Lato', 'sans-serif'],
      }
    },
  },
  plugins: [],
}