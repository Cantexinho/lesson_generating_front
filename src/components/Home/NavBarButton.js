import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { selectTheme } from "../../redux/themeSlice";

const NavBarButton = ({ label, showArrow, subpages }) => {
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
      className={`relative flex items-center justify-center p-2 h-10 text-md rounded-lg ${
        theme.isDarkTheme
          ? "text-white hover:bg-gray-800"
          : "text-black hover:bg-gray-300"
      }`}
      onClick={handleButtonClick}
    >
      {label}
      {showArrow && (
        <FontAwesomeIcon icon={faArrowDown} className="ml-2" size="xs" />
      )}
      {isDropdownOpen && showArrow && (
        <ul
          className={`absolute top-full border border-gray-300 rounded mt-1 ${
            theme.isDarkTheme ? "border-gray-600" : "border-gray-300"
          }`}
        >
          {subpages.map((subpage) => (
            <li
              className={`flex items-center justify-center text-base w-24 h-10 ${
                theme.isDarkTheme
                  ? "dark-second-bg text-white hover:bg-gray-800"
                  : "light-second-bg text-black hover:bg-gray-300"
              }`}
            >
              <a href={subpage}>{subpage}</a>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default NavBarButton;
