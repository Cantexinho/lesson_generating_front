import start_now from "../../assets/images/start_now.png";
import { useSelector } from "react-redux";
import { selectTheme } from "../../redux/themeSlice";

const CustomFooter = () => {
  const theme = useSelector(selectTheme);
  return (
    <footer
      className={`flex flex-col items-center justify-center w-full mt-20 border-t ${
        theme.isDarkTheme
          ? "dark-bg-gray_transparent  border-gray-600 "
          : "bg-gray-100  border-gray-300 "
      }`}
    >
      <div className="flex items-center justify-center w-full h-20">
        <p
          className={`text-lg font-semibold ${
            theme.isDarkTheme ? "text-white" : "text-black"
          }`}
        >
          &copy; 2025 Legatus AI. All rights reserved.
        </p>
      </div>
      <button>
        <div className="flex flex-col items-left justify-center m-5 rounded-full">
          <a href="/login">
            <img
              className={"w-28 h-auto rounded-full"}
              src={start_now}
              alt=""
            />
          </a>
        </div>
      </button>
    </footer>
  );
};

export default CustomFooter;
