import NavBarButton from "./NavBarButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import ThemeButton from "../Global/ThemeButton";
import { useSelector } from "react-redux";
import { selectTheme } from "../../redux/themeSlice";

const NavBar = () => {
  const theme = useSelector(selectTheme);
  return (
    <div
      className={`flex items-top w-full fixed top-0 p-2 mb-2 ${
        theme.isDarkTheme ? "dark-second-bg" : "light-second-bg"
      }`}
    >
      <a className="flex items-center" href="/home">
        <img
          className="w-16 h-16 rounded-2xl"
          src={require("../../assets/images/logo.png")}
          alt="Logo"
        />
        <p
          className={`text-2xl font-semibold flex-shrink-0 mx-2 ${
            theme.isDarkTheme ? "text-white" : "text-black"
          }`}
        >
          CyberLearn
        </p>
      </a>
      <div className="flex items-center pl-10 ml-10">
        <nav
          className={`flex items-center w-full ${
            theme.isDarkTheme ? "dark-second-bg" : "light-second-bg"
          }`}
        >
          <ul className="flex space-x-2">
            <NavBarButton label="Subscribe" showArrow={false}></NavBarButton>
            <NavBarButton label="Goal" showArrow={false}></NavBarButton>
            <NavBarButton
              label="API"
              showArrow={true}
              subpages={["Documentation", "Pricing"]}
            ></NavBarButton>
            <NavBarButton
              label="Contact"
              showArrow={true}
              subpages={["Support", "Business"]}
            ></NavBarButton>
            <NavBarButton
              label="Company"
              showArrow={true}
              subpages={["About", "Careers"]}
            ></NavBarButton>
          </ul>
        </nav>
      </div>

      <div className="flex items-right mx-4 ml-auto">
        <ThemeButton passed_props={"mt-0 ml-2"} />
        <nav className="flex items-center">
          <ul className="mr-4 flex">
            <li
              className={`text-lg px-6 py-1 border   ${
                theme.isDarkTheme
                  ? "dark-second-bg text-white border-white hover:bg-gray-900"
                  : "light-second-bg text-black border-gray-400 hover:bg-gray-300"
              }`}
            >
              <a href="/login">
                {" "}
                <span className="hidden xl:inline">Go to Playground</span>
                <span className="xl:hidden">Playground</span>
              </a>
              <FontAwesomeIcon icon={faArrowRight} className="ml-2" size="xs" />
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default NavBar;
