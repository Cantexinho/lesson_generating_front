const TitleSelect = ({ title, handleTitleChange }) => {
  return (
    <div className="flex flex-grow flex-col mb-4 md:mb-0 md:mr-4">
      <label
        className="block text-sm font-bold text-white mb-2"
        htmlFor="title"
      >
        Enter title of lesson
      </label>
      <input
        className="flex-grow w-full p-2 namefield-bg-gray border border-cl_color_light_blue rounded mr-4 text-white focus:outline-none focus:outline-blue-700"
        type="text"
        value={title}
        onChange={handleTitleChange}
        placeholder="Enter title of the text you wish to generate"
      />
    </div>
  );
};

export default TitleSelect;
