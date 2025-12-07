import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import * as lessonDataOperations from "../utils/lessonDataOperations";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faArrowLeft,
  faRightFromBracket,
  faCirclePlus,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
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
  const [hoveredLessonId, setHoveredLessonId] = useState(null);
  const [focusedLessonId, setFocusedLessonId] = useState(null);
  const [openMenuLessonId, setOpenMenuLessonId] = useState(null);
  const [deletingLessonId, setDeletingLessonId] = useState(null);
  const [menuAnchorRect, setMenuAnchorRect] = useState(null);

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

  useEffect(() => {
    if (!openMenuLessonId) {
      return;
    }

    const handlePointerDown = (event) => {
      if (
        event.target?.closest(
          `[data-lesson-action-container="${openMenuLessonId}"]`
        )
      ) {
        return;
      }
      setOpenMenuLessonId(null);
      setMenuAnchorRect(null);
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpenMenuLessonId(null);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [openMenuLessonId]);

  const MAX_TITLE_LENGTH = 36;

  const formatLessonTitle = (lesson) => {
    const rawTitle = lesson?.title || lesson?.name || "Untitled lesson";
    const title = rawTitle.trim();
    if (title.length <= MAX_TITLE_LENGTH) {
      return title;
    }
    return `${title.slice(0, MAX_TITLE_LENGTH - 1)}…`;
  };

  const handleMenuToggle = (event, lessonId) => {
    event.preventDefault();
    event.stopPropagation();
    const nextLessonId = openMenuLessonId === lessonId ? null : lessonId;

    if (!nextLessonId) {
      setOpenMenuLessonId(null);
      setMenuAnchorRect(null);
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    setOpenMenuLessonId(nextLessonId);
    setMenuAnchorRect(rect);
  };

  const handleDeleteLesson = async (event, lesson) => {
    event.preventDefault();
    event.stopPropagation();

    if (!lesson?.id || deletingLessonId) {
      return;
    }

    try {
      setDeletingLessonId(lesson.id);
      await lessonDataOperations.deleteLessonById(lesson.id);
      const updatedLessons = await lessonDataOperations.fetchAllLessons(setLessons);

      if (selectedLesson?.id === lesson.id) {
        const nextLesson =
          updatedLessons?.find((item) => item.id !== lesson.id) || null;
        handleLessonSelect(nextLesson || null);
      }
    } catch (error) {
      console.error("Failed to delete lesson:", error);
      if (typeof window !== "undefined") {
        window.alert("Unable to delete this lesson. Please try again.");
      }
    } finally {
      setDeletingLessonId(null);
      setOpenMenuLessonId(null);
      setMenuAnchorRect(null);
      setHoveredLessonId(null);
      setFocusedLessonId(null);
      setMenuAnchorRect(null);
    }
  };

  const activeMenuLesson =
    openMenuLessonId && lessons.find((lesson) => lesson.id === openMenuLessonId);
  
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
            {lessons.map((lesson) => {
              const isSelected = selectedLesson && selectedLesson.id === lesson.id;
              const showActions =
                hoveredLessonId === lesson.id ||
                focusedLessonId === lesson.id ||
                openMenuLessonId === lesson.id ||
                isSelected;
              const formattedTitle = formatLessonTitle(lesson);

              return (
                <li
                  key={lesson.id}
                  data-lesson-action-container={lesson.id}
                  className="relative"
                  onMouseEnter={() => setHoveredLessonId(lesson.id)}
                  onMouseLeave={() => setHoveredLessonId(null)}
                  onFocusCapture={() => setFocusedLessonId(lesson.id)}
                  onBlurCapture={(event) => {
                    if (
                      !event.currentTarget.contains(event.relatedTarget)
                    ) {
                      setFocusedLessonId((current) =>
                        current === lesson.id ? null : current
                      );
                    }
                  }}
                >
                  <div
                    className={`flex w-full items-center rounded-lg px-2 py-1 text-sm transition ${
                      isSelected
                        ? "bg-gray-300 text-black dark:bg-gray-900 dark:text-white"
                        : "bg-secondary text-black hover:bg-gray-300 dark:bg-primary-dark dark:text-white dark:hover:bg-gray-900"
                    }`}
                  >
                    <button
                      type="button"
                      className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap bg-transparent text-left font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                      onClick={() => handleLessonSelect(lesson)}
                    >
                      {formattedTitle}
                    </button>
                    <div className="relative ml-2 flex-shrink-0">
                      <button
                        type="button"
                        className={`rounded-full p-2 text-gray-600 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-gray-300 ${
                          showActions ? "opacity-100" : "opacity-0"
                        } focus:opacity-100 focus-visible:opacity-100`}
                        aria-label={`Show actions for ${formattedTitle}`}
                        onClick={(event) => handleMenuToggle(event, lesson.id)}
                        onFocus={() => setFocusedLessonId(lesson.id)}
                      >
                        <FontAwesomeIcon
                          icon={faEllipsisVertical}
                          className="h-4 w-4"
                        />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
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
      {openMenuLessonId &&
        menuAnchorRect &&
        activeMenuLesson &&
        createPortal(
          <div
            data-lesson-action-container={openMenuLessonId}
            className="fixed z-50 w-44 rounded-xl border border-gray-200 bg-primary p-1 shadow-xl dark:border-gray-700 dark:bg-secondary-dark"
            style={{
              left: menuAnchorRect.left + menuAnchorRect.width / 2,
              top: menuAnchorRect.bottom + 8,
              transform: "translateX(-50%)",
            }}
          >
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 disabled:cursor-not-allowed disabled:opacity-60 dark:text-red-400 dark:hover:bg-gray-800"
              onClick={(event) => handleDeleteLesson(event, activeMenuLesson)}
              disabled={deletingLessonId === activeMenuLesson.id}
            >
              <span>
                {deletingLessonId === activeMenuLesson.id
                  ? "Deleting..."
                  : "Delete lesson"}
              </span>
            </button>
          </div>,
          document.body
        )}
    </div>
  );
};

export default PgNavBar;