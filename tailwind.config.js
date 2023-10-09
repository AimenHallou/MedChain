/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts,tsx}"],
  theme: {
    extend: {
      backgroundColor: {
        'blue-background': '#001845',
        'blue-header': '#001233',
        'blue-button': '#0044cc',
        'blue-hover-button': '#468faf',
        'module-background': '#33415c',
      },
    },
  },
  plugins: [],
}
