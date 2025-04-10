const TitleSelect = ({
  title,
  handleTitleChange,
  passedProps,
  placeholderText,
}) => {
  return (
    <div className={`${passedProps}`}>
      <span className="text-2xl font-bold font-custom hidden md:inline text-black dark:text-white">
        Enter title of lesson
      </span>
      <span className="text-2xl font-bold font-custom text-white md:hidden">
        Title
      </span>
      <input
        className="flex w-[400px] lg:w-[800px] text-xl font-custom p-4 mt-2 rounded-xl focus:outline-none h-18 text-black dark:text-white focus:outline-main dark:focus:outline-main-dark bg-primary dark:bg-primary-dark  border-gray-300 dark:border-gray-800"
        type="text"
        value={title}
        onChange={handleTitleChange}
        placeholder={placeholderText}
      />
    </div>
  );
};

export default TitleSelect;
