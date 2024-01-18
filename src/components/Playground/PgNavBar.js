import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import * as lessonDataOperations from "../../utils/lessonDataOperations";

const PgNavBar = ({
  pgMainState,
  handleNewLessonButton,
  handleLessonSelect,
  selectedLesson,
}) => {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);

  const handleAccountBtnClick = () => {
    navigate("/login");
  };
  useEffect(() => {
    const fetchData = async () => {
      await lessonDataOperations.fetchAllLessons(setLessons);
    };
    fetchData();
  }, [pgMainState]);

  return (
    <nav className="flex flex-col fixed justify-top items-center second-bg-gray h-screen rounded overflow-y">
      <div className="flex fixed flex-col items-center justify-center">
        <a className="flex flex-col items-center mt-4 mb-4" href="/home">
          <img
            className="w-14 h-14 rounded-2xl"
            src={require("../../assets/images/logo.png")}
            alt="Logo"
          />
          <p className="text-white text-xl font-semibold flex-shrink-0 mx-2">
            CyberLearn
          </p>
        </a>
        <div className="flex justify-center space-x-1 mb-4">
          <button
            className="text-white p-1 hover:bg-cl_color_dark_blue border border-cl_color_light_blue second-bg-gray"
            onClick={handleNewLessonButton}
          >
            New Lesson
          </button>
        </div>
      </div>
      <div className="mt-40 mb-2 max-h-screen h-full overflow-y-auto scrollbar border border-cl_color_light_blue">
        <ul className="flex flex-col items-center w-52">
          {lessons.map((lesson) => (
            <button
              key={lesson.id}
              className={`relative flex items-center justify-left pl-2 w-full h-12 text-white text-sm border-t border-b border-gray-700 rounded ${
                selectedLesson && selectedLesson.id === lesson.id
                  ? "bg-cl_color_dark_blue hover:bg-cl_color_dark_blue"
                  : "pg-bg-gray hover:bg-cl_color_dark_blue"
              }`}
              onClick={() => handleLessonSelect(lesson)}
            >
              {lesson.name}
            </button>
          ))}
        </ul>
      </div>
      <div className="flex justify-center w-full space-x-1 mb-1 mt-auto">
        <button
          className="text-white border border-cl_color_light_blue p-2 w-full hover:bg-cl_color_dark_blue second-bg-gray"
          onClick={handleAccountBtnClick}
        >
          Log out
        </button>
      </div>
    </nav>
  );
};

export default PgNavBar;
