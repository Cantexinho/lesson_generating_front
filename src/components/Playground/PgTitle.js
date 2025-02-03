import { useSelector } from "react-redux";
import { selectTheme } from "../../redux/themeSlice";

const TitleSelect = ({ title, handleTitleChange }) => {
  const theme = useSelector(selectTheme);
  return (
    <div className="flex flex-col flex-grow w-max-full mr-4">
      <label
        className={`block text-sm font-bold mb-2 ${
          theme.isDarkTheme ? "text-white" : " text-black"
        }`}
        htmlFor="title"
      >
        <span className="hidden md:inline">Enter title of lesson</span>
        <span className="md:hidden">Title</span>
      </label>
      <input
        className={`flex w-full p-2  rounded mr-4 focus:outline-none focus:outline-blue-700 ${
          theme.isDarkTheme
            ? "text-white dark-second-bg border border-gray-800"
            : "text-black light-second-bg border border-gray-300"
        }`}
        type="text"
        value={title}
        onChange={handleTitleChange}
        placeholder="Enter title of the text you wish to generate"
      />
    </div>
  );
};

export default TitleSelect;
