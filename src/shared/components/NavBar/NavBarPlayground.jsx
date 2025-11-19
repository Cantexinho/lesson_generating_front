import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const NavBarPlayground = () => {
  return (
    <nav className="flex">
      <div className="flex">
        <a 
          href="/playground" 
          className="flex items-center text-md px-6 py-1 border rounded-full bg-transparent-light dark:bg-transparent-dark text-black dark:text-white border-gray-600 dark:border-white hover:bg-secondary dark:hover:bg-secondary-dark group"
        >
          <span className="hidden xl:inline font-semibold font-custom">
            Go to Playground
          </span>
          <span className="xl:hidden font-semibold font-custom">
            Playground
          </span>
          <FontAwesomeIcon
            icon={faArrowRight}
            className="ml-2 hidden xl:inline text-lg transition-transform duration-200 group-hover:translate-x-1"
            size="xs"
          />
        </a>
      </div>
    </nav>
  );
};

export default NavBarPlayground;