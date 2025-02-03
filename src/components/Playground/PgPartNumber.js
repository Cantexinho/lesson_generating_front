import React from "react";
import { useSelector } from "react-redux";
import { selectTheme } from "../../redux/themeSlice";

const PartNumberSelect = ({ selectedNumber, handleNumberChange }) => {
  const theme = useSelector(selectTheme);
  return (
    <div className="flex flex-col mr-4 items-center justify-center">
      <label
        className={`block text-gray-700 text-sm font-bold mb-2 ${
          theme.isDarkTheme ? "text-white" : " text-black"
        }`}
        htmlFor="number"
      >
        <span className="hidden lg:inline">Select part number</span>
        <span className="lg:hidden">Number</span>
      </label>
      <select
        value={selectedNumber}
        onChange={handleNumberChange}
        className={`mx-4 h-10 w-full focus:outline-none focus:outline-blue-700 ${
          theme.isDarkTheme
            ? "text-white dark-second-bg border border-gray-800"
            : "text-black light-second-bg border border-gray-300"
        }`}
      >
        {Array.from({ length: 9 }, (_, i) => i + 1).map((num) => (
          <option key={num} value={num}>
            {num}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PartNumberSelect;
