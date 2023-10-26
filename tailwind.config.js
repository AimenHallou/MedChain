const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{html,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-animate': 'linear-gradient(to right, #001f40, #002855, #003366, #002855, #001f40)',
      },
      animation: {
        'gradient-shift': 'gradientShift 15s infinite linear',
      },
      keyframes: {
        gradientShift: {
          '0%': {
            'background-position': '100% 0',
          },
          '100%': {
            'background-position': '0 0',
          },
        },
      },
      backgroundSize: {
        '200%': '100%',
      },
      backgroundColor: {
        "page-background": "#002855",
        "page-header-dark": "#001230",
        "page-button": "#A2ACBD",
        "page-hover-button": "#468faf",
        "module-background": "#001F52",
      },
      borderColor: {
        "module-accent": "#000000",
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
