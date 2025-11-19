import { useDispatch, useSelector } from "react-redux";
import { toggleTheme, selectTheme } from "features/theme/themeSlice";

const ThemeButton = ({ passed_props }) => {
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <div className={`relative flex flex-col justify-center ${passed_props}`}>
      <label className="inline-flex relative items-center mr-5 cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          readOnly
          checked={theme.isDarkTheme}
        />
        <div
          onClick={handleThemeToggle}
          className={`w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-gray-600 peer-checked:after:bg-gray-200 after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-600`}
        ></div>
        <span className="ml-2 text-sm font-medium text-black dark:text-white">
          <span className="hidden xl:inline">
            {theme.isDarkTheme ? "Light mode" : "Dark mode"}
          </span>
          <span className="xl:hidden">
            {theme.isDarkTheme ? "Light" : "Dark"}
          </span>
        </span>
      </label>
    </div>
  );
};

export default ThemeButton;
