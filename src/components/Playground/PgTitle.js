import { useSelector } from "react-redux";
import { selectTheme } from "../../redux/themeSlice";

const TitleSelect = ({
  title,
  handleTitleChange,
  passedProps,
  placeholderText,
}) => {
  const theme = useSelector(selectTheme);
  return (
    <div className={`${passedProps}`}>
      <span
        className={`text-2xl font-bold font-custom hidden md:inline ${
          theme.isDarkTheme ? "text-white" : "text-black"
        }`}
      >
        Enter title of lesson
      </span>
      <span className="text-2xl font-bold font-custom text-white md:hidden">
        Title
      </span>
      <input
        className={`flex w-[800px] text-xl font-custom p-4 mt-2 rounded-xl focus:outline-none h-18 ${
          theme.isDarkTheme
            ? "text-white dark-main-focus-outline dark-primary-bg border-b-2 border-gray-800"
            : "text-black light-main-focus-outline light-primary-bg border-b-2  border-gray-300"
        }`}
        type="text"
        value={title}
        onChange={handleTitleChange}
        placeholder={placeholderText}
      />
    </div>
  );
};

export default TitleSelect;
