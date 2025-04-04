import { selectTheme } from "../../redux/themeSlice";
import { useSelector } from "react-redux";

const NavBarDropdown = ({ subpages }) => {
  const theme = useSelector(selectTheme);
  return (
    <ul
      className={`absolute w-64 z-0 top-full left-0 border rounded-xl p-4 mt-4 ${
        theme.isDarkTheme
          ? "dark-second-bg border-gray-600"
          : "light-second-bg border-gray-200"
      }`}
    >
      <div className="dropdown-hover-area" />
      {subpages.map((subpage) => (
        <li
          key={subpage}
          className={`flex items-center justify-center text-base h-8 rounded-md my-2 ${
            theme.isDarkTheme
              ? "dark-second-bg text-white hover:bg-gray-800"
              : "light-second-bg text-black hover:bg-gray-100"
          }`}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <a href={subpage.toLowerCase()}>{subpage}</a>
        </li>
      ))}
    </ul>
  );
};

export default NavBarDropdown;
