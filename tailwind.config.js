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
      // boxShadow: {
      //   text: "2px 2px 8px rgba(0,0,0,0.7)",
      // },
      colors: {
        login_color_blue: "#0D3D69",
        color_dark_blue: "#00182E",
        color_light_blue: "#0D406E",
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
        ".text-shadow-light": {
          "text-shadow": "2px 2px 8px rgba(0,0,0,0.7)",
        },
        ".text-shadow-dark": {
          "text-shadow": "2px 2px 8px rgba(255,255,255,0.7)",
        },
      });
    },
  ],
};
