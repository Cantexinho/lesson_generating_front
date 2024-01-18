import React from "react";
import NavBar from "../components/Home/NavBar";

const Support = () => {
  return (
    <div className="flex flex-col h-screen items-center justify-center bg-futuristic_background bg-cover">
      <NavBar />
      <div>
        <form className="flex flex-col justify-center items-center border border-gray-700 w-[550px] mt-20 p-8 pb-4 second-bg-gray rounded-xl shadow">
          <label className="text-primary text-xl font-semibold text-gray-300 mb-10">
            Need help? Submit a request!
          </label>
          <div className="mb-3 w-full">
            <label className="text-primary text-gray-300">
              Your email address
            </label>
            <input
              id="username"
              className="w-full p-1 mt-1 text-gray-200 outline-none border border-gray-800 namefield-bg-gray focus:outline-blue-700"
              type="text"
            />
          </div>
          <div className="mb-3 w-full">
            <label className="text-primary text-gray-300">Subject</label>
            <input
              id="subject"
              className="w-full p-1 mt-1 text-gray-200 outline-none border border-gray-800 namefield-bg-gray focus:outline-blue-700"
              type="text"
            />
          </div>
          <div className="mb-6 w-full">
            <label className="text-primary text-gray-300">Description</label>
            <textarea
              id="description"
              className="flex items-top justify-left w-full p-1 mt-1 text-gray-200 h-44 outline-none border border-gray-800 namefield-bg-gray focus:outline-blue-700 resize-none"
              type="text"
            />
          </div>
          <button className="flex-grow m-1 w-5/6 transform transition-transform duration-100 ease-in-out py-1 text-white bg-blue-700 hover:bg-blue-800 active:scale-95 rounded">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Support;
