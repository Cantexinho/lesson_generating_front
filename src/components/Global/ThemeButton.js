import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme, selectTheme } from "../../redux/themeSlice";

const ThemeButton = () => {
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);
  const [isSliding, setIsSliding] = useState(false);

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <button
      className={`flex border mt-5 ${
        theme.isDarkTheme ? "bg-gray" : "bg-blue"
      }`}
      onClick={handleThemeToggle}
    >
      Dark Theme
    </button>
  );
};

export default ThemeButton;
