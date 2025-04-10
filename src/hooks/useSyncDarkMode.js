import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectTheme } from "../redux/themeSlice";

export const useSyncDarkMode = () => {
  const theme = useSelector(selectTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme.isDarkTheme) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme.isDarkTheme]);
};
