import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const NarBarPlayground = () => {
  return (
    <nav className="lg:flex">
      <ul className="mr-4 flex ">
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
  );
};
export default NarBarPlayground;
