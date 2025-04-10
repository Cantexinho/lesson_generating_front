import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { selectTheme } from "../../redux/themeSlice";
import ThemeButton from "../Global/ThemeButton";

const NavBarMenu = ({ label, showArrow, subpages }) => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const theme = useSelector(selectTheme);

  const handleMenuOpen = () => {
    setMenuOpen(!isMenuOpen);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  const bgImage = require(`../../assets/images/ai_rome_1.png`);


  return (
    <div ref={menuRef} className="relative">
      {/* Menu Button */}
      <button
        onClick={handleMenuOpen}
        className="flex items-center justify-center rounded-full w-28 h-8 text-md border bg-transparent-light dark:bg-transparent-dark text-black dark:text-white border-gray-600 dark:border-white hover:bg-gray-300 dark:hover:bg-gray-800"
      >
        <span className="font-semibold font-custom">{label}</span>
      </button>

      {/* Full Screen Slide-in Menu */}
      <div 
        className={`fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex flex-col h-full bg-transparent-light dark:bg-transparent-dark">
          {/* Header with logo and close button - aligned with navbar height */}
          <div className="flex justify-between items-center h-16 p-2 border-b border-gray-200 dark:border-gray-700">
            <a className="flex items-center" href="/home">
              <img
                className="w-16 h-16 rounded-2xl"
                src={
                  theme.isDarkTheme
                    ? require("../../assets/images/legatus-logo-white.png")
                    : require("../../assets/images/legatus-logo-black.png")
                }
                alt="Logo"
              />
              <p
                className="text-2xl font-semibold font-custom flex-shrink-0 text-black dark:text-white"
              >
                Legatus
              </p>
            </a>
            <button 
              onClick={handleMenuOpen}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
            >
              <FontAwesomeIcon icon={faTimes} className="text-black dark:text-white" />
            </button>
          </div>
          
          {/* Menu Items */}
          <ul className="flex flex-col p-4 space-y-4 flex-grow">
            {subpages.map((subpage, index) => (
              <li 
                key={index} 
                className="py-3 hover:bg-secondary dark:hover:bg-secondary-dark text-black dark:text-white rounded-xl"
              >
                <a href={subpage.toLowerCase()} className="block mx-16 text-lg font-bold font-custom">
                  {subpage}
                </a>
              </li>
            ))}
          </ul>
          
          {/* Theme Toggle Button at the bottom */}
          <div className="flex justify-center items-center py-6 border-t border-gray-200 dark:border-gray-700 bg-secondary dark:bg-secondary-dark">
            <ThemeButton passed_props="mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBarMenu;