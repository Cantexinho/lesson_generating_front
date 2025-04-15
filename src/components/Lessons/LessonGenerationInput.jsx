import React, { useState, useRef, useEffect } from 'react';
import LessonGenerationOptions from './LessonGenerationOptions';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWandMagicSparkles, faGear, faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";

const LessonGenerationInput = ({
  title,
  handleTitleChange,
  passedProps,
  placeholderText,
  onSubmit,
}) => {
  const [format, setFormat] = useState('presentation');
  const [audience, setAudience] = useState('beginners');
  const [length, setLength] = useState('medium');
  const [optionsExpanded, setOptionsExpanded] = useState(false);
  const textareaRef = useRef(null);

  const formatOptions = [
    { value: 'presentation', label: 'Presentation', icon: <span role="img" aria-label="presentation">📊</span> },
    { value: 'lecture', label: 'Lecture', icon: <span role="img" aria-label="lecture">🎓</span> },
    { value: 'workshop', label: 'Workshop', icon: <span role="img" aria-label="workshop">🛠️</span> },
    { value: 'tutorial', label: 'Tutorial', icon: <span role="img" aria-label="tutorial">📝</span> },
  ];
  
  const audienceOptions = [
    { value: 'beginners', label: 'Beginners', icon: <span role="img" aria-label="beginners">🔰</span> },
    { value: 'intermediate', label: 'Intermediate', icon: <span role="img" aria-label="intermediate">📈</span> },
    { value: 'advanced', label: 'Advanced', icon: <span role="img" aria-label="advanced">🚀</span> },
    { value: 'all', label: 'All levels', icon: <span role="img" aria-label="all levels">👥</span> },
  ];
  
  const lengthOptions = [
    { value: 'short', label: 'Short', icon: <span role="img" aria-label="short">⏱️</span> },
    { value: 'medium', label: 'Medium', icon: <span role="img" aria-label="medium">⏲️</span> },
    { value: 'long', label: 'Long', icon: <span role="img" aria-label="long">⌛</span> },
    { value: 'detailed', label: 'Very detailed', icon: <span role="img" aria-label="very detailed">📚</span> },
  ];

  const toggleOptions = () => {
    setOptionsExpanded(!optionsExpanded);
  };

  const handleSubmit = () => {
    if (onSubmit) {
      const formatLabel = formatOptions.find(opt => opt.value === format)?.label || format;
      const audienceLabel = audienceOptions.find(opt => opt.value === audience)?.label || audience;
      const lengthLabel = lengthOptions.find(opt => opt.value === length)?.label || length;
      
      onSubmit({
        format: formatLabel,
        audience: audienceLabel,
        length: lengthLabel
      });
    }
  };

  const autoResizeTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      
      const lineHeight = parseInt(window.getComputedStyle(textareaRef.current).lineHeight);
      const singleRowHeight = lineHeight || 20;
      
      const maxHeight = singleRowHeight * 5;
      
      const scrollHeight = textareaRef.current.scrollHeight;
      
      if (scrollHeight <= maxHeight) {
        textareaRef.current.style.height = `${scrollHeight}px`;
        textareaRef.current.style.overflowY = 'hidden';
      } else {
        textareaRef.current.style.height = `${maxHeight}px`;
        textareaRef.current.style.overflowY = 'auto';
      }
    }
  };

  useEffect(() => {
    autoResizeTextarea();
  }, [title]);

  const onTextareaChange = (e) => {
    handleTitleChange(e);
  };

  return (
    <div className={`rounded-xl bg-secondary dark:bg-secondary-dark border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col w-full max-w-2xl ${passedProps}`}>
      {/* Top part - Input field with reduced padding */}
      <div className="p-2 flex-1 bg-secondary dark:bg-secondary-dark rounded-t-xl">
        <textarea
          ref={textareaRef}
          className="w-full text-md font-custom p-2 rounded-lg text-black dark:text-white bg-secondary dark:bg-secondary-dark resize-none focus:outline-none min-h-[40px] max-h-[120px]"
          value={title}
          onChange={onTextareaChange}
          placeholder={placeholderText}
          rows={1}
        />
      </div>

      {/* Bottom part - Options and Generate button on the same line */}
      <div className="p-2 flex flex-wrap items-center justify-between bg-secondary dark:bg-secondary-dark rounded-b-xl">
        {/* Desktop view: Options directly visible */}
        <div className="hidden md:flex flex-wrap items-center gap-2">
          {/* Format dropdown - Custom with icons */}
          <LessonGenerationOptions
            options={formatOptions}
            selectedValue={format}
            onChange={setFormat}
            label="Format"
            width="w-28"
          />

          {/* Audience dropdown - Custom with icons */}
          <LessonGenerationOptions
            options={audienceOptions}
            selectedValue={audience}
            onChange={setAudience}
            label="Audience"
            width="w-28"
          />

          {/* Length dropdown - Custom with icons */}
          <LessonGenerationOptions
            options={lengthOptions}
            selectedValue={length}
            onChange={setLength}
            label="Length"
            width="w-24"
          />
        </div>

        {/* Mobile view: Options button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleOptions}
            className="bg-secondary dark:bg-secondary-dark hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700 text-black dark:text-white px-3 py-1 rounded-lg text-sm font-medium flex items-center"
          >
            <FontAwesomeIcon icon={faGear} className="h-4 w-4 mr-1" />
            <span>Options</span>
            <FontAwesomeIcon 
              icon={optionsExpanded ? faChevronUp : faChevronDown} 
              className="h-3 w-3 ml-1" 
            />
          </button>
        </div>

        <button
          onClick={handleSubmit}
          className="bg-secondary dark:bg-secondary-dark hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700 text-black dark:text-white px-3 py-1 rounded-lg text-sm font-medium ml-2 flex items-center"
        >
          <FontAwesomeIcon icon={faWandMagicSparkles} className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Generate</span>
        </button>
      </div>

      {/* Expandable mobile options section */}
      {optionsExpanded && (
        <div className="md:hidden p-3 bg-secondary dark:bg-secondary-dark rounded-b-xl">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col">
              <span className="text-xs font-medium mb-1 text-gray-600 dark:text-gray-400">Format</span>
              <LessonGenerationOptions
                options={formatOptions}
                selectedValue={format}
                onChange={setFormat}
                label=""
                width="w-full"
              />
            </div>
            
            <div className="flex flex-col">
              <span className="text-xs font-medium mb-1 text-gray-600 dark:text-gray-400">Audience</span>
              <LessonGenerationOptions
                options={audienceOptions}
                selectedValue={audience}
                onChange={setAudience}
                label=""
                width="w-full"
              />
            </div>
            
            <div className="flex flex-col">
              <span className="text-xs font-medium mb-1 text-gray-600 dark:text-gray-400">Length</span>
              <LessonGenerationOptions
                options={lengthOptions}
                selectedValue={length}
                onChange={setLength}
                label=""
                width="w-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonGenerationInput;