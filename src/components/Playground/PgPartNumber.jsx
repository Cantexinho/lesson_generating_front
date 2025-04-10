import React from "react";

const PartNumberSelect = ({ selectedNumber, handleNumberChange }) => {
  return (
    <div className="flex flex-col mr-4 items-center justify-center">
      <label
        className="block text-sm font-bold mb-2 text-black dark:text-white"
        htmlFor="number"
      >
        <span className="hidden lg:inline">Select part number</span>
        <span className="lg:hidden">Number</span>
      </label>
      <select
        value={selectedNumber}
        onChange={handleNumberChange}
        className="mx-4 h-10 w-full focus:outline-none focus:outline-blue-700 border text-black dark:text-white bg-transparent-light dark:bg-transparent-dark border-gray-300 dark:border-gray-800"
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
