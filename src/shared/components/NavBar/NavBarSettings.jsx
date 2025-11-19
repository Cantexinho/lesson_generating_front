import { faCog } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect, useRef } from "react";
import ThemeButton from "features/theme/components/ThemeButton";

const languages = [
  {
    language: "Language 1",
  },
  {
    language: "Language 2",
  },
  {
    language: "Language 3",
  },
];

const NavBarSettings = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="p-2 m-2 rounded-full"
      >
        <FontAwesomeIcon
          icon={faCog}
          className="text-xl text-black dark:text-white"
        />
      </button>

      {showDropdown && (
        <div className="absolute z-0 top-full left-1/2 transform -translate-x-1/2 border rounded-xl px-4 py-1 mt-2 min-w-max bg-primary dark:bg-primary-dark border-gray-200 dark:border-gray-600">
          {languages.map((lang, index) => (
            <div
              key={index}
              className="px-4 py-2 text-sm text-black dark:text-white hover:bg-secondary dark:hover:bg-secondary-dark rounded-lg cursor-pointer"
            >
              {lang.language}
            </div>
          ))}
          <div className="border-t border-gray-300 dark:border-gray-700 mt-2 pt-2 px-4">
            <ThemeButton passed_props={"mt-0"} />
          </div>
        </div>
      )}
    </div>
  );
};

export default NavBarSettings;