/** @type {import('tailwindcss').Config} */
export default {
  content: ['./public/index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Supermercado One"', '"cursive"'],
        serif: ['"Secular One"', '"serif"'],
      },
    },
  },
  plugins: [],
}
