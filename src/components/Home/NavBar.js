import NavBarButton from "./NavBarButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import ThemeButton from "../Global/ThemeButton";
import NavBarMenu from "./NavBarMenu";
import { useSelector } from "react-redux";
import { selectTheme } from "../../redux/themeSlice";

const NavBar = () => {
  const theme = useSelector(selectTheme);

  return (
    <div
      className={`flex items-top w-full h-16 border-b fixed top-0 p-2 mb-2 z-10 ${
        theme.isDarkTheme
          ? "dark-second-bg border-gray-600"
          : "light-second-bg border-gray-300"
      }`}
    >
      {/*img*/}
      <a className="flex items-center mx-12" href="/home">
        <img
          className="w-12 h-12 mx-2 rounded-2xl"
          src={require("../../assets/images/logo.png")}
          alt="Logo"
        />
        <p
          className={`text-2xl font-semibold flex-shrink-0 ${
            theme.isDarkTheme ? "text-white" : "text-black"
          }`}
        >
          Legatus AI
        </p>
      </a>
      {/*img*/}

      {/*buttons*/}
      <div className="flex items-center pl-20 mx-10">
        <nav
          className={`flex items-center w-full h-12 ${
            theme.isDarkTheme ? "dark-second-bg" : "light-second-bg"
          }`}
        >
          <ul className="hidden lg:flex">
            <NavBarButton
              label="Subscribe"
              showArrow={false}
              navigateTo={"/subscribe"}
            ></NavBarButton>
            <NavBarButton
              label="Goal"
              showArrow={false}
              navigateTo={"/goal"}
            ></NavBarButton>
            <NavBarButton
              label="API"
              showArrow={true}
              subpages={["Documentation", "Pricing"]}
              navigateTo={"/docs"}
            ></NavBarButton>
            <NavBarButton
              label="Contact"
              showArrow={true}
              subpages={["Support", "Business"]}
              navigateTo={"/support"}
            ></NavBarButton>
            <NavBarButton
              label="Company"
              showArrow={true}
              subpages={["About", "Careers"]}
              navigateTo={"/company"}
            ></NavBarButton>
          </ul>
        </nav>
      </div>
      {/*buttons*/}

      {/* dark mode playground login*/}
      <div className="hidden lg:flex items-center mx-4 ml-auto">
        <ThemeButton passed_props={"mt-0 ml-2"} />
        <nav className="flex">
          <ul className="mr-4 flex">
            <li
              className={`text-md px-6 py-1 border rounded-full   ${
                theme.isDarkTheme
                  ? "dark-second-bg text-white border-white hover:bg-gray-800"
                  : "light-second-bg text-black border-gray-600 hover:bg-gray-300"
              }`}
            >
              <a href="/login">
                {" "}
                <span className="hidden xl:inline">Go to Playground</span>
                <span className="xl:hidden">Playground</span>
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
      {/* dark mode playground*/}
      {/* menu*/}
      <NavBarMenu
        label="Menu"
        showArrow={true}
        subpages={[
          "Subscribe",
          "Goal",
          "API",
          "Contact",
          "Company",
          "Playground",
        ]}
      ></NavBarMenu>
      {/* menu*/}
    </div>
  );
};

export default NavBar;
