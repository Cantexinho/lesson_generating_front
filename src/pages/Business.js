import React from "react";
import NavBar from "../components/Home/NavBar";
import CustomFooter from "../components/Global/CustomFooter";
import { useSelector } from "react-redux";
import { selectTheme } from "../redux/themeSlice";

const Support = () => {
  const theme = useSelector(selectTheme);
  return (
    <div
      className={`flex flex-col h-screen items-center justify-center ${
        theme.isDarkTheme ? "dark-primary-bg" : "light-primary-bg"
      }`}
    >
      <NavBar />
      <div className="flex-grow flex flex-col items-center justify-center">
        <form
          className={`flex flex-col justify-center items-center w-[550px] mt-20 p-8 pb-4 rounded-xl shadow ${
            theme.isDarkTheme
              ? "dark-bg-gray_transparent"
              : "light-bg-gray_transparent"
          }`}
        >
          <label
            className={`text-primary text-xl font-semibold mb-10 ${
              theme.isDarkTheme ? "text-gray-300" : "text-black"
            }`}
          >
            Have a proposition? Write us!
          </label>
          <div className="mb-3 w-full">
            <label
              className={`text-primary  ${
                theme.isDarkTheme ? "text-gray-300" : "text-black"
              }`}
            >
              Your email address
            </label>
            <input
              id="username"
              className="w-full p-1 mt-1 text-gray-900 outline-none border border-gray-400 namefield-bg-gray focus:outline-blue-700"
              type="text"
            />
          </div>
          <div className="mb-3 w-full">
            <label
              className={`text-primary ${
                theme.isDarkTheme ? "text-gray-300" : "text-black"
              }`}
            >
              Subject
            </label>
            <input
              id="subject"
              className="w-full p-1 mt-1 text-gray-900 outline-none border border-gray-400 namefield-bg-gray focus:outline-blue-700"
              type="text"
            />
          </div>
          <div className="mb-6 w-full">
            <label
              className={`text-primary ${
                theme.isDarkTheme ? "text-gray-300" : "text-black"
              }`}
            >
              Description
            </label>
            <textarea
              id="description"
              className="flex items-top justify-left w-full p-1 mt-1 text-gray-900 h-44 outline-none border border-gray-400 namefield-bg-gray focus:outline-blue-700 resize-none"
              type="text"
            />
          </div>
          <button className="flex-grow m-1 w-5/6 transform transition-transform duration-100 ease-in-out py-1 text-white bg-blue-700 hover:bg-blue-800 active:scale-95 rounded">
            Submit
          </button>
        </form>
      </div>
      <CustomFooter />
    </div>
  );
};

export default Support;
