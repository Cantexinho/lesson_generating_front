import React from "react";
import NavBar from "../components/Home/NavBar";
import CustomFooter from "../components/Footers/CustomFooter";

const Support = () => {
  return (
    <div className="flex flex-col h-screen items-center justify-center bg-secondary dark:bg-secondary-dark">
      <NavBar />
      <div className="flex-grow flex flex-col items-center justify-center">
        <form className="flex flex-col justify-center items-center w-[550px] mt-20 p-8 pb-4 rounded-xl shadow bg-transparent-light dark:bg-transparent-dark">
          <label className="text-xl font-semibold mb-10 text-black dark:text-white">
            Need help? Submit a request!
          </label>
          <div className="mb-3 w-full">
            <label className="text-black dark:text-white">
              Your email address
            </label>
            <input
              id="username"
              className="w-full p-1 mt-1 text-gray-900 outline-none border border-gray-400 namefield-bg-gray focus:outline-blue-700"
              type="text"
            />
          </div>
          <div className="mb-3 w-full">
            <label className="text-black dark:text-white">Subject</label>
            <input
              id="subject"
              className="w-full p-1 mt-1 text-gray-900 outline-none border border-gray-400 namefield-bg-gray focus:outline-blue-700"
              type="text"
            />
          </div>
          <div className="mb-6 w-full">
            <label className="text-black dark:text-white">Description</label>
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
