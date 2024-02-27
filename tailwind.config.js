/** @type {import('tailwindcss').Config} */
module.exports = {
  content: {
    files: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  },
  darkmode: false,
  theme: {
    extend: {
      colors: {
        "bg-color": "var(--bg-color)",
        "button-color": "var(--button-color)"
      }
    },
  },
  plugins: [],
}

