import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import * as lessonDataOperations from "../../utils/lessonDataOperations";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import ThemeButton from "../Global/ThemeButton";
import { useSelector } from "react-redux";
import { selectTheme } from "../../redux/themeSlice";
import { LOGO_TEXT } from "../../constants/logoText";

const PgNavBar = ({
  pgMainState,
  handleNewLessonButton,
  handleLessonSelect,
  selectedLesson,
}) => {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [navBarVisible, setNavBarVisible] = useState(false);

  const theme = useSelector(selectTheme);

  const handleNavBarVisible = () => {
    setNavBarVisible(!navBarVisible);
  };

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
    <div className="relative">
      <button
        className={`text-white fixed top-0 md:invisible transition-transform z-20 ${
          navBarVisible ? "translate-x-52" : "translate-x-2"
        }`}
        onClick={handleNavBarVisible}
      >
        {navBarVisible ? (
          <FontAwesomeIcon
            icon={faTimes}
            className="mt-2 text-black dark:text-white"
            size="xl"
          />
        ) : (
          <FontAwesomeIcon
            icon={faArrowRight}
            className="mt-2 text-black dark:text-white"
            size="xl"
          />
        )}
      </button>
      <nav
        className={`flex flex-col fixed justify-top items-center h-screen rounded overflow-y md:translate-x-0 transition-transform z-10 bg-secondary dark:bg-secondary-dark ${
          navBarVisible ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex fixed flex-col items-center justify-center">
          <a className="flex flex-col items-center mt-4 mb-4" href="/home">
            <img
              className="w-14 h-14 rounded-2xl"
              src={
                theme.isDarkTheme
                  ? require("../../assets/images/legatus-logo-white.png")
                  : require("../../assets/images/legatus-logo-black.png")
              }
              alt="Logo"
            />
            <p className="text-xl font-semibold flex-shrink-0 mx-2 text-black dark:text-white">
              {LOGO_TEXT.logo}
            </p>
          </a>
          <div className="flex justify-center space-x-1 mb-4">
            <button
              className="p-1 second-bg-gray border bg-transparent-light dark:bg-transparent-dark text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-900 border-gray-300 dark:border-gray-800"
              onClick={handleNewLessonButton}
            >
              New Lesson
            </button>
          </div>
        </div>
        <div className="mt-40 mb-2 max-h-screen h-full overflow-y-auto scrollbar mx-2 bg-transparent-light dark:bg-transparent-dark border-gray-200 dark:border-gray-800">
          <ul className="flex flex-col items-center w-52">
            {lessons.map((lesson) => (
              <button
                key={lesson.id}
                className={`relative flex items-center justify-left pl-2 w-full h-12 text-sm rounded border-t border-b text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-900 border-gray-300 dark:border-gray-700" ${
                  selectedLesson && selectedLesson.id === lesson.id
                    ? "bg-gray-300 dark:bg-gray-900"
                    : ""
                }`}
                onClick={() => handleLessonSelect(lesson)}
              >
                {lesson.name}
              </button>
            ))}
          </ul>
        </div>
        <ThemeButton passed_props={"my-2 mb-3 ml-8"} />
        <div className="flex justify-center w-52 space-x-1 mb-1 mt-auto ">
          <button
            className="p-2 w-full border text-black dark:text-white bg-transparent-light dark:bg-primary-dark hover:bg-gray-300 dark:hover:bg-gray-900 border-gray-400 dark:border-gray-700"
            onClick={handleAccountBtnClick}
          >
            Log out
          </button>
        </div>
      </nav>
    </div>
  );
};

export default PgNavBar;
