import { createSlice } from "@reduxjs/toolkit";

const loadThemeFromStorage = () => {
  const storedTheme = localStorage.getItem("theme");
  return storedTheme ? JSON.parse(storedTheme) : { isDarkTheme: false };
};

const themeSlice = createSlice({
  name: "theme",
  initialState: loadThemeFromStorage(),
  reducers: {
    toggleTheme: (state) => {
      state.isDarkTheme = !state.isDarkTheme;
      localStorage.setItem("theme", JSON.stringify(state));
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export const selectTheme = (state) => state.theme;

export default themeSlice.reducer;
