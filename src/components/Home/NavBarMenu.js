import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { selectTheme } from "../../redux/themeSlice";
import ThemeButton from "../Global/ThemeButton";

const NavBarMenu = ({ label, showArrow, subpages }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const theme = useSelector(selectTheme);

  const handleButtonClick = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <li
      ref={dropdownRef}
      className={`absolute flex items-center justify-center rounded-full right-8 w-28 mx-2 mt-4 text-md border border-gray-400 lg:hidden ${
        theme.isDarkTheme
          ? "dark-second-bg text-white border-white hover:bg-gray-800"
          : "light-second-bg text-black border-gray-600 hover:bg-gray-300"
      }`}
      onClick={handleButtonClick}
    >
      {label}
      {showArrow && (
        <FontAwesomeIcon icon={faArrowDown} className="ml-2" size="xs" />
      )}
      {isDropdownOpen && showArrow && (
        <ul
          className={`absolute top-full bg-white border border-gray-400 rounded mt-1 ${
            theme.isDarkTheme ? "dark-second-bg" : "light-second-bg"
          }`}
        >
          {subpages.map((subpage) => (
            <li
              className={`flex items-center justify-center text-base w-32 h-10 ${
                theme.isDarkTheme
                  ? "dark-second-bg text-white hover:bg-gray-900"
                  : "light-second-bg text-black hover:bg-gray-300"
              }`}
            >
              <a href={subpage}>{subpage}</a>
            </li>
          ))}
          <ThemeButton passed_props={"my-3 ml-4"} />
        </ul>
      )}
    </li>
  );
};

export default NavBarMenu;
