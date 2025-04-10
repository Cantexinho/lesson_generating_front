import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import ThemeButton from "../Global/ThemeButton";

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
      className="absolute flex items-center justify-center rounded-full right-8 w-28 my-2 h-8 text-md border lg:hidden bg-transparent-light dark:bg-transparent-dark text-black dark:text-white border-gray-600 dark:border-white  hover:bg-gray-300 dark:hover:bg-gray-800"
      onClick={handleButtonClick}
    >
      <span className="font-semibold font-custom ">{label}</span>
      {showArrow && (
        <FontAwesomeIcon icon={faArrowDown} className="ml-2" size="xs" />
      )}
      {isDropdownOpen && showArrow && (
        <ul className="absolute top-full bg-white border border-gray-400 rounded mt-1 bg-transparent-light dark:bg-transparent-dark">
          {subpages.map((subpage) => (
            <li className="flex items-center justify-center text-base w-32 h-10 bg-transparent-light dark:bg-transparent-dark text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-900">
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
