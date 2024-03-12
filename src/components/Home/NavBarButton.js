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
      className={`relative flex items-center justify-center w-32 h-10 text-lg rounded border border-gray-400 ${
        theme.isDarkTheme
          ? "text-white hover:bg-gray-900"
          : "text-black hover:bg-gray-300"
      }`}
      onClick={handleButtonClick}
    >
      {label}
      {showArrow && (
        <FontAwesomeIcon icon={faArrowDown} className="ml-2" size="xs" />
      )}
      {isDropdownOpen && showArrow && (
        <ul className="absolute top-full bg-white border border-gray-400 rounded mt-1">
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
        </ul>
      )}
    </li>
  );
};

export default NavBarButton;
