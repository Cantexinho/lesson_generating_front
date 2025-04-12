import React, { useState, useRef, useEffect } from 'react';

const LessonGenerationOptions = ({ 
  options, 
  selectedValue, 
  onChange, 
  label,
  width = "w-24" // Default width
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Find the selected option to display
  const selectedOption = options.find(option => option.value === selectedValue) || options[0];
  
  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);
  
  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  // Select an option and close dropdown
  const handleSelect = (option) => {
    onChange(option.value);
    setIsOpen(false);
  };
  
  return (
    <div className="flex items-center">
      <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mr-1">
        {label}:
      </label>
      <div ref={dropdownRef} className={`relative ${width}`}>
        {/* Selected value button */}
        <button
          type="button"
          onClick={toggleDropdown}
          className="flex items-center justify-between w-full p-1 bg-secondary dark:bg-secondary-dark hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700 rounded-md text-xs text-black dark:text-white"
        >
          <div className="flex items-center">
            {selectedOption.icon && (
              <span className="mr-1">{selectedOption.icon}</span>
            )}
            <span className="truncate">{selectedOption.label}</span>
          </div>
          <svg 
            className={`h-4 w-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} 
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        
        {/* Dropdown menu */}
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg">
            <ul className="py-1 max-h-60 overflow-auto">
              {options.map((option) => (
                <li key={option.value}>
                  <button
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={`flex items-center px-2 py-1 w-full text-left text-xs hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      option.value === selectedValue ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-200' : 'text-black dark:text-white'
                    }`}
                  >
                    {option.icon && (
                      <span className="mr-1">{option.icon}</span>
                    )}
                    <span className="truncate">{option.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonGenerationOptions;