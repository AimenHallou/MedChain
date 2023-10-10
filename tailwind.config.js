const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{html,ts,tsx}"],
  theme: {
    extend: {
      backgroundColor: {
        "page-background": "#002855",
        "page-header": "#538FF8",
        "page-button": "#A2ACBD",
        "page-hover-button": "#468faf",
        "module-background": "#1A344B",
        "module-accent": "#3498DB",
      },
      textColor: {
        "main-text": "#E1E8ED",
        "sub-text": "#B3C6D2",
      },
      fontFamily: {
        sans: ["Lato", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
