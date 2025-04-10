import NavBarButton from "./NavBarButton";
import NavBarMenu from "./NavBarMenu";
import NarBarPlayground from "./NavBarPlayground";
import NavBarSettings from "./NavBarSettings";
import { useSelector } from "react-redux";
import { selectTheme } from "../../redux/themeSlice";
import { useState } from "react";
import { useEffect } from "react";

const NavBar = () => {
  const theme = useSelector(selectTheme);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`flex items-top w-full h-16 fixed top-0 p-2 mb-2 z-10
        ${
          scrolled
            ? "bg-primary dark:bg-primary-dark"
            : "bg-transparent-light dark:bg-transparent-dark"
        }`}
    >
      {/*img*/}
      <a className="flex items-center lg:mx-12" href="/home">
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
          className={`text-2xl font-semibold font-custom flex-shrink-0 text-black dark:text-white`}
        >
          Legatus
        </p>
      </a>
      {/*img*/}

      {/*buttons*/}
      <div className="flex items-center">
        <nav className={`flex items-center w-full h-12 `}>
          <ul className="hidden lg:flex">
            <NavBarButton
              label="Goal"
              showArrow={false}
              navigateTo={"/goal"}
            ></NavBarButton>
            <NavBarButton
              label="Tools"
              showArrow={true}
              subpages={{
                col1: ["lesson-generator", "bg-remover", "image-observer"],
              }}
              navigateTo={"/company"}
            ></NavBarButton>
            <NavBarButton
              label="API"
              showArrow={true}
              subpages={{
                col1: ["Home", "About", "Contact"],
                col2: ["Services", "Blog", "FAQ"],
              }}
              navigateTo={"/docs"}
            ></NavBarButton>
            <NavBarButton
              label="Contact"
              showArrow={true}
              subpages={{
                col1: ["Home", "About", "Contact"],
                col2: ["Services", "Blog", "FAQ"],
                col3: ["Services", "Blog", "FAQ"],
              }}
              navigateTo={"/support"}
            ></NavBarButton>
          </ul>
        </nav>
      </div>
      <div className="flex items-center mx-4 ml-auto relative">
        <NavBarSettings />
        <div className="hidden lg:block">
          <NarBarPlayground />
        </div>
        <div className="block lg:hidden">
          <NavBarMenu
            label="Menu"
            showArrow={true}
            subpages={["Goal", "Tools", "API", "Contact", "Playground"]}
          />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
