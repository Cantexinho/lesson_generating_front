import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectTheme } from "features/theme/themeSlice";

export const useSyncDarkMode = () => {
  const theme = useSelector(selectTheme);

  useEffect(() => {
    const root = document.documentElement;

    // Disable transitions during theme change
    root.classList.add("theme-changing");

    if (theme.isDarkTheme) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Re-enable transitions after theme change completes
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        root.classList.remove("theme-changing");
      });
    });
  }, [theme.isDarkTheme]);
};
