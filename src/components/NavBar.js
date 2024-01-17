import NavBarButton from "./NavBarButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const NavBar = () => {
  return (
    <div className="flex items-top w-full fixed top-0 p-2 mb-2 second-bg-gray border border-cl_color_dark_blue">
      <a className="flex items-center" href="/home">
        <img
          className="w-16 h-16 rounded-2xl"
          src={require("C:/Users/karolispakalnis/Desktop/lesson_generating_front/src/assets/images/logo.png")}
          alt="Logo"
        />
        <p className="text-white text-2xl font-semibold flex-shrink-0 mx-2">
          CyberLearn
        </p>
      </a>
      <div className="flex items-center pl-10 ml-10">
        <nav className="flex items-center w-full second-bg-gray">
          <ul className="flex space-x-2">
            <NavBarButton
              label="Company"
              showArrow={true}
              subpages={["About", "Careers"]}
            ></NavBarButton>
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
              label="Goal"
              showArrow={false}
              subpages={[]}
            ></NavBarButton>
          </ul>
        </nav>
      </div>
      <div className="flex items-right mx-4 ml-auto">
        <nav className="flex items-center">
          <ul className="mx-4 flex">
            <li className="second-bg-gray text-white text-lg px-6 py-1 border border-white hover:bg-cl_color_dark_blue">
              <a href="/playground">Go to Playground</a>
              <FontAwesomeIcon icon={faArrowRight} className="ml-2" size="xs" />
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default NavBar;
