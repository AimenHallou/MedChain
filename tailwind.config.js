const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ["./src/**/*.{html,ts,tsx}"],
  theme: {
    extend: {
      backgroundColor: {
        'blue-background': '#F1EFEF',
        'blue-header': '#6499E9',
        'blue-button': '#9EDDFF',
        'blue-hover-button': '#468faf',
        'module-background': '#6499E9',
      },
      fontFamily: {
        'sans': ['Lato', ...defaultTheme.fontFamily.sans]
      }
    },
  },
  plugins: [],
}
