import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import * as lessonDataOperations from "../utils/lessonDataOperations";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft, faRightFromBracket, faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import ThemeButton from "features/theme/components/ThemeButton";
import { useSelector } from "react-redux";
import { selectTheme } from "features/theme/themeSlice";
import { LOGO_TEXT } from "shared/constants/logoText";
import { authService } from "features/auth/services/authService";

const PgNavBar = ({
  pgMainState,
  handleNewLessonButton,
  handleLessonSelect,
  selectedLesson,
}) => {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [navBarVisible, setNavBarVisible] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const theme = useSelector(selectTheme);

  const handleNavBarVisible = () => {
    setNavBarVisible(!navBarVisible);
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      authService.logout();
      
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await lessonDataOperations.fetchAllLessons(setLessons);
    };
    fetchData();
  }, [pgMainState]);
  
  return (
    <div className="relative">
      {!navBarVisible && (
        <button
          className="fixed left-4 top-4 z-30 rounded-full bg-secondary p-2 text-black shadow-lg transition-all hover:bg-gray-200 dark:bg-primary-dark dark:text-white dark:hover:bg-gray-800"
          onClick={handleNavBarVisible}
          aria-label="Show lesson library"
        >
          <FontAwesomeIcon icon={faArrowRight} className="h-5 w-5" size="xl" />
        </button>
      )}
      <nav
        className={`fixed left-0 top-0 z-20 flex h-screen w-60 flex-col items-center overflow-y-auto border-r border-gray-200 bg-secondary shadow-xl transition-transform dark:border-gray-800 dark:bg-primary-dark ${
          navBarVisible ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="relative flex w-full flex-col items-center">
          {navBarVisible && (
            <button
              type="button"
              className="absolute right-4 top-4 rounded-full bg-secondary p-2 text-black shadow-lg transition hover:bg-gray-200 dark:bg-primary-dark dark:text-white dark:hover:bg-gray-800"
              onClick={handleNavBarVisible}
              aria-label="Hide lesson library"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="h-5 w-5" size="xl" />
            </button>
          )}
          <div className="flex flex-col items-center justify-center w-full">
          <a className="flex flex-col items-center mt-4 mb-4" href="/home">
            <img
              className="w-14 h-14 rounded-2xl"
              src={
                theme.isDarkTheme
                  ? require("../../../assets/images/legatus-logo-white.png")
                  : require("../../../assets/images/legatus-logo-black.png")
              }
              alt="Logo"
            />
            <p className="text-xl font-semibold flex-shrink-0 mx-2 text-black dark:text-white">
              {LOGO_TEXT.logo}
            </p>
          </a>
            <div className="w-full px-4 mb-4">
              <button
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-transparent-light py-2 text-sm font-semibold text-black transition hover:bg-gray-300 dark:border-gray-800 dark:bg-transparent-dark dark:text-white dark:hover:bg-gray-900"
                onClick={handleNewLessonButton}
              >
                <FontAwesomeIcon icon={faCirclePlus} className="h-4 w-4" />
                New Lesson
              </button>
            </div>
          </div>
        </div>
        <div className="mt-40 mb-2 h-full max-h-screen overflow-y-auto scrollbar mx-2 bg-transparent-light dark:bg-transparent-dark border-gray-200 dark:border-gray-800">
          <ul className="flex flex-col items-center w-full">
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
        <ThemeButton passed_props={"my-2 mb-3"} />
        <div className="mb-4 mt-auto w-full px-4">
          <button
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 py-2 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <FontAwesomeIcon icon={faRightFromBracket} className="h-4 w-4" />
            {isLoggingOut ? "Logging out..." : "Log out"}
          </button>
        </div>
      </nav>
    </div>
  );
};

export default PgNavBar;