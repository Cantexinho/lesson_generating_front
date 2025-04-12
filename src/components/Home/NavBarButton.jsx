import { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import NavBarDropdown from "./NavBarDropdown";

const NavBarButton = ({ label, showArrow, subpages, navigateTo }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
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
      className="relative z-10 flex items-center justify-center p-3 text-md text-black dark:text-white border-b-0 hover:border-b-2 hover:border-main dark:hover:border-main-dark cursor-pointer"
      onClick={handleButtonClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className="font-semibold font-custom dark:text-shadow-dark">
        {label}
      </span>

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
