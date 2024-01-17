import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";

const NavBarButton = ({ label, showArrow, subpages }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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
      className="relative flex items-center justify-center w-32 h-10 text-white text-lg rounded border border-gray-400 hover:bg-cl_color_dark_blue"
      onClick={handleButtonClick}
    >
      {label}
      {showArrow && (
        <FontAwesomeIcon icon={faArrowDown} className="ml-2" size="xs" />
      )}
      {isDropdownOpen && showArrow && (
        <ul className="absolute top-full left-0 bg-white border border-gray-400 rounded mt-1">
          {subpages.map((subpage) => (
            <li className="flex items-center justify-center text-base w-32 h-10 second-bg-gray hover:bg-cl_color_dark_blue">
              <a href="/subpage1">{subpage}</a>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default NavBarButton;
