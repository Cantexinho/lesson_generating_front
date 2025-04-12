import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const NavBarPlayground = () => {
  return (
    <nav className="lg:flex">
      <ul className="mr-4 flex ">
        <li className="text-md px-6 py-1 border rounded-full bg-transparent-light dark:bg-transparent-dark text-black dark:text-white border-gray-600 dark:border-white hover:bg-gray-300 dark:hover:bg-gray-800 group">
          <a href="/login" className="flex items-center">
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
        </li>
      </ul>
    </nav>
  );
};

export default NavBarPlayground;