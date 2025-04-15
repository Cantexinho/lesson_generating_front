import NavBarButton from "../navbar/NavBarButton";
import NavBarMenu from "../navbar/NavBarMenu";
import NavBarPlayground from "../navbar/NavBarPlayground";
import NavBarSettings from "../navbar/NavBarSettings";
import { useSelector } from "react-redux";
import { selectTheme } from "../../redux/themeSlice";
import { useState, useEffect } from "react";
import { LOGO_TEXT } from "../../constants/logoText";

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
        } hover:bg-primary dark:hover:bg-primary-dark transition-colors duration-300 ease-in-out`}
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
          {LOGO_TEXT.logo}
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
                "Popular Tools": ["Lesson Generator", "BG Remover", "Image Observer"],
                "New Releases": ["AI Writer", "Code Assistant", "Text Summarizer"]
              }}
              navigateTo={"/tools"}
            ></NavBarButton>
            <NavBarButton
              label="API"
              showArrow={true}
              subpages={{
                "Documentation": ["Getting Started", "API Reference", "Examples"],
                "Resources": ["Pricing", "Usage Limits", "Support"]
              }}
              navigateTo={"/docs"}
            ></NavBarButton>
            <NavBarButton
              label="Contact"
              showArrow={true}
              subpages={{
                "Support": ["Help Center", "Tickets", "Community"],
                "Business": ["Enterprise", "Partners", "Resellers"],
                "Company": ["About Us", "Careers", "Press"]
              }}
              navigateTo={"/contact"}
            ></NavBarButton>
            <NavBarButton
              label="News"
              showArrow={false}
              navigateTo={"/news"}
            ></NavBarButton>
          </ul>
        </nav>
      </div>
      <div className="flex items-center mx-4 ml-auto relative">
        <NavBarSettings/>
        {/* Self-contained NavBarPlayground component - no props needed */}
        <div className="hidden lg:block">
          <NavBarPlayground />
        </div>
        <div className="block lg:hidden">
          <NavBarMenu
            label="Menu"
            showArrow={true}
            subpages={["Playground", "Goal", "Tools", "API", "Contact"]}
          />
        </div>
      </div>
    </div>
  );
};

export default NavBar;