module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      transitionProperty: {
        transform: "transform",
      },
      transitionDuration: {
        default: "250ms",
      },
      transitionTimingFunction: {
        default: "ease-in-out",
      },
      height: {
        128: "32rem",
        144: "36rem",
      },
      // boxShadow: {
      //   text: "2px 2px 8px rgba(0,0,0,0.7)",
      // },
      colors: {
        primary: "#ffffff",
        "primary-dark": "#0c0c0e",
        secondary: "#e2e2e2",
        "secondary-dark": "#1b1b20",
        "transparent-light": "#ffffff80",
        "transparent-dark": "#0c0c0e80",
        main: "#5E8677",
        "main-dark": "#BC6F25",
      },
      fontFamily: {
        custom: ['"Roboto"', "sans-serif"],
      },
    },
  },
  safelist: ["grid-cols-1", "grid-cols-2", "grid-cols-3", "grid-cols-4"],
  variants: {
    extend: {},
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".text-shadow-dark": {
          "text-shadow": "2px 2px 8px rgba(0,0,0,0.7)",
        },
        ".text-shadow-light": {
          "text-shadow": "2px 2px 8px rgba(255,255,255,0.7)",
        },
      });
    },
  ],
};
