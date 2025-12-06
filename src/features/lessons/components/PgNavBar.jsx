import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
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
  navVisible,
  onToggleNav,
}) => {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const theme = useSelector(selectTheme);

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

  const MAX_TITLE_LENGTH = 36;

  const formatLessonTitle = (lesson) => {
    const rawTitle = lesson?.title || lesson?.name || "Untitled lesson";
    const title = rawTitle.trim();
    if (title.length <= MAX_TITLE_LENGTH) {
      return title;
    }
    return `${title.slice(0, MAX_TITLE_LENGTH - 1)}…`;
  };
  
  return (
    <div className="relative">
      {!navVisible && (
        <button
          className="fixed left-4 top-4 z-30 rounded-full bg-secondary p-2 text-black shadow-lg transition-all hover:bg-gray-200 dark:bg-primary-dark dark:text-white dark:hover:bg-gray-800"
          onClick={onToggleNav}
          aria-label="Show lesson library"
        >
          <FontAwesomeIcon icon={faArrowRight} className="h-5 w-5" size="xl" />
        </button>
      )}
      <nav
        className={`fixed left-0 top-0 z-20 flex h-screen w-60 flex-col items-center overflow-y-auto border-r border-gray-200 bg-secondary shadow-xl transition-transform dark:border-gray-800 dark:bg-primary-dark ${
          navVisible ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="relative flex w-full flex-col items-center px-4 pt-8">
          {navVisible && (
            <button
              type="button"
              className="absolute right-2 top-2 rounded-full bg-secondary p-2 text-black shadow-lg transition hover:bg-gray-200 dark:bg-primary-dark dark:text-white dark:hover:bg-gray-800"
              onClick={onToggleNav}
              aria-label="Hide lesson library"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="h-5 w-5" size="xl" />
            </button>
          )}
          <div className="flex flex-col items-center justify-center w-full">
          <a className="flex flex-col items-center mb-4" href="/home">
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
        <div className="flex w-full flex-1 flex-col px-4">
          <ul className="flex w-full flex-1 flex-col gap-2 overflow-y-auto pb-4">
            {lessons.map((lesson) => (
              <button
                key={lesson.id}
                className={`flex w-full items-center justify-start rounded-lg px-5 py-3 text-left text-sm font-medium text-black transition hover:bg-gray-300 dark:text-white dark:hover:bg-gray-900 ${
                  selectedLesson && selectedLesson.id === lesson.id
                    ? "bg-gray-300 dark:bg-gray-900"
                    : "bg-secondary dark:bg-primary-dark"
                }`}
                onClick={() => handleLessonSelect(lesson)}
              >
                <span className="block w-full overflow-hidden text-ellipsis whitespace-nowrap">
                  {formatLessonTitle(lesson)}
                </span>
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