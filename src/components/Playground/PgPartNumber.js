import React from "react";

const PartNumberSelect = ({ selectedNumber, handleNumberChange }) => {
  return (
    <div className="flex flex-col mb-4 md:mb-0 md:mr-4 items-center justify-center">
      <label
        className="block text-gray-700 text-sm font-bold text-white mb-2"
        htmlFor="number"
      >
        Select part number
      </label>
      <select
        value={selectedNumber}
        onChange={handleNumberChange}
        className="text-white mx-4 namefield-bg-gray border border-cl_color_light_blue h-10 w-full focus:outline-none focus:outline-blue-700"
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
