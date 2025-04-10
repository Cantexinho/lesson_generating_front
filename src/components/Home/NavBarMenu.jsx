import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";

const NavBarMenu = ({ label, showArrow, subpages }) => {
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
      className="relative flex items-center justify-center rounded-full w-28 h-8 text-md border bg-transparent-light dark:bg-transparent-dark text-black dark:text-white border-gray-600 dark:border-white hover:bg-gray-300 dark:hover:bg-gray-800"
      onClick={handleButtonClick}
    >
      <span className="font-semibold font-custom ">{label}</span>
      {showArrow && (
        <FontAwesomeIcon icon={faArrowDown} className="ml-2" size="xs" />
      )}
      {isDropdownOpen && showArrow && (
        <ul className="absolute top-full bg-white border border-gray-400 mt-1 bg-transparent-light dark:bg-transparent-dark">
          {subpages.map((subpage) => (
            <li className="flex items-center justify-center text-base w-32 h-10 bg-transparent-light dark:bg-transparent-dark text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-900">
              <a href={subpage}>{subpage}</a>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default NavBarMenu;
