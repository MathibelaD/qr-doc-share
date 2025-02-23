/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#047857',  // main green
          100: '#34D399',     // light mint
          dark: '#065F46'     // darker green
        },
        secondary: {
          DEFAULT: '#065F46',
          light: '#059669',
          dark: '#064E3B'
        }
      }
    },
  },
  plugins: [],
}