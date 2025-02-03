module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
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
      backgroundImage: (theme) => ({
        futuristic_background: "url('./assets/images/minimalistic_3.png')",
        random_city: "url('./assets/images/random_city_1.png')",
      }),
      width: {
        116: "29rem",
      },
      colors: {
        login_color_blue: "#0D3D69",
        color_dark_blue: "#00182E",
        color_light_blue: "#0D406E",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
