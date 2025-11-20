import React from "react";
import Spinner from "./Spinner";

const LessonPart = ({
  part,
  loading,
}) => {
  return (
    <div
      key={part.id}
      className="flex w-full justify-between relative text-xs md:text-base"
      data-lesson-section={part.id}
      data-section-title={`Part ${part.number}: ${part.name}`}
    >
      <div className="p-4 w-full relative border text-black dark:text-white bg-secondary dark:bg-primary-dark  border-gray-300 dark:border-gray-800">
        {loading[part.id] ? (
          <div className="flex justify-center items-center w-full">
            <Spinner />
          </div>
        ) : (
          <>
            <h2 className="mb-2 text-black dark:text-white">
              {`Part ${part.number}: ${part.name}`}
            </h2>
            <p>{part.lesson_part_content}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default LessonPart;
