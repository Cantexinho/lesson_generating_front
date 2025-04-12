import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const NavBarPlayground = ({ 
  containerClasses = "lg:flex", 
  listClasses = "mr-4 flex", 
  itemClasses = "text-md px-6 py-1 border rounded-full bg-transparent-light dark:bg-transparent-dark text-black dark:text-white border-gray-600 dark:border-white hover:bg-secondary dark:hover:bg-secondary-dark group",
  textClasses = "font-semibold font-custom",
  iconClasses = "ml-2 hidden xl:inline text-lg transition-transform duration-200 group-hover:translate-x-1"
}) => {
  return (
    <nav className={containerClasses}>
      <ul className={listClasses}>
        <li className={itemClasses}>
          <a href="/login" className="flex items-center">
            <span className={`hidden xl:inline ${textClasses}`}>
              Go to Playground
            </span>
            <span className={`xl:hidden ${textClasses}`}>
              Playground
            </span>
            <FontAwesomeIcon
              icon={faArrowRight}
              className={iconClasses}
              size="xs"
            />
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default NavBarPlayground;