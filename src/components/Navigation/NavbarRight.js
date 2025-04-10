import { faCog, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import ThemeButton from "../Global/ThemeButton";

function NavbarRight() {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="hidden lg:flex items-center mx-4 ml-auto relative">
      {/* Settings Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="p-2 m-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
        >
          <FontAwesomeIcon icon={faCog} className="text-xl" />
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl shadow-lg z-50 py-2">
            <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
              Language 1
            </div>
            <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
              Language 2
            </div>
            <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
              Language 3
            </div>
            <div className="border-t border-gray-300 dark:border-gray-700 mt-2 pt-2 px-4">
              <ThemeButton passed_props={"mt-0"} />
            </div>
          </div>
        )}
      </div>

      {/* Playground Button */}
      <nav className="flex">
        <ul className="mr-4 flex">
          <li className="text-md px-6 py-1 border rounded-full bg-transparent-light dark:bg-transparent-dark text-black dark:text-white border-gray-600 dark:border-white hover:bg-gray-300 dark:hover:bg-gray-800">
            <a href="/login">
              <span className="hidden xl:inline font-semibold font-custom">
                Go to Playground
              </span>
              <span className="xl:hidden font-semibold font-custom">
                Playground
              </span>
            </a>
            <FontAwesomeIcon
              icon={faArrowRight}
              className="ml-2 hidden xl:inline"
              size="xs"
            />
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default NavbarRight;
