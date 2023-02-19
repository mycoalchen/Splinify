/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'spotify-green':'#1cd760',
        'spotify-darkgray': '#181818'
      }
    },
    fontFamily: {
      'sans': ["Gotham"]
    }
  },
  plugins: [],
}
