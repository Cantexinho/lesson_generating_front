import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { selectTheme } from "../../redux/themeSlice";
import { useNavigate } from "react-router-dom";
import NavBarDropdown from "./NavBarDropdown";

const NavBarButton = ({ label, showArrow, subpages, navigateTo }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const theme = useSelector(selectTheme);
  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (navigateTo) {
      navigate(navigateTo);
    }
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
      className={`relative z-10 flex items-center justify-center p-2 text-md rounded-lg ${
        theme.isDarkTheme
          ? "text-white hover:text-gray-400"
          : "text-black hover:text-gray-600"
      }`}
      onClick={handleButtonClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {label}
      {showArrow && (
        <FontAwesomeIcon
          icon={isDropdownOpen ? faArrowUp : faArrowDown}
          className="ml-2"
          size="xs"
        />
      )}
      {isDropdownOpen && showArrow && <NavBarDropdown subpages={subpages} />}
    </li>
  );
};

export default NavBarButton;
