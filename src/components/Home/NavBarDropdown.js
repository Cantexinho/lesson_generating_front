import { selectTheme } from "../../redux/themeSlice";
import { useSelector } from "react-redux";

const NavBarDropdown = ({ subpages }) => {
  const theme = useSelector(selectTheme);
  const numCols = Object.keys(subpages).length;

  return (
    <ul
      className={`absolute z-0 top-full left-0 border rounded-xl px-4 py-1 mt-4 min-w-max ${
        theme.isDarkTheme
          ? "dark-second-bg border-gray-600"
          : "light-second-bg border-gray-200"
      }`}
    >
      <div className="dropdown-hover-area" />
      <div className={`grid grid-cols-${numCols} gap-2`}>
        {Object.entries(subpages).map(([column, items]) => (
          <div key={column}>
            {items.map((subpage) => (
              <li
                key={subpage}
                className={`flex items-center justify-center text-base h-8 rounded-md my-2 px-2 ${
                  theme.isDarkTheme
                    ? "text-white dark-hover-gray"
                    : "text-black light-hover-gray"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <a href={subpage.toLowerCase()}>{subpage}</a>
              </li>
            ))}
          </div>
        ))}
      </div>
    </ul>
  );
};

export default NavBarDropdown;
