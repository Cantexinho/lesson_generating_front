import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { selectTheme } from "../../redux/themeSlice";
import { useNavigate } from "react-router-dom";

const NavBarButton = ({ label, showArrow, subpages }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const theme = useSelector(selectTheme);
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/company");
  };

  const handleMouseEnter = () => {
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setDropdownOpen(false);
  };

  return (
    <li
      ref={dropdownRef}
      className={`relative flex items-center justify-center p-2 h-10 text-md rounded-lg  hover:scale-110 ${
        theme.isDarkTheme
          ? "text-white hover:bg-gray-800"
          : "text-black hover:bg-gray-100"
      }`}
      onClick={handleButtonClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {label}
      {showArrow && (
        <FontAwesomeIcon icon={faArrowDown} className="ml-2" size="xs" />
      )}
      {isDropdownOpen && showArrow && (
        <ul
          className={`absolute top-full left-0 border rounded mt-1 ${
            theme.isDarkTheme ? "border-gray-600" : "border-gray-200"
          }`}
        >
          <div className="dropdown-hover-area" />
          {subpages.map((subpage) => (
            <li
              className={`flex items-center justify-center text-base w-32 h-10 ${
                theme.isDarkTheme
                  ? "dark-second-bg text-white hover:bg-gray-800"
                  : "light-second-bg text-black hover:bg-gray-100"
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
