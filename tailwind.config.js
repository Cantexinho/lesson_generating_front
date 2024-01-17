module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      backgroundImage: (theme) => ({
        futuristic_background:
          "url('./assets/images/minimalistic_3.png')",
      }),
      width: {
        116: "29rem",
      },
      colors: {
        login_color_blue: "#0D3D69",
        cl_color_dark_blue: "#00182E",
        cl_color_light_blue: "#0D406E",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
