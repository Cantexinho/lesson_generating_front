import React, {
  useMemo,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faFloppyDisk,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import Spinner from "./Spinner";
import HighlightPopover from "./HighlightPopover";
import RichTextEditor from "./RichTextEditor";
import ExercisesBlock from "./ExercisesBlock";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const resolveSectionContent = (section) =>
  section?.lesson_section_content ??
  section?.lesson_part_content ??
  section?.text ??
  section?.content ??
  "";

const LessonSection = ({
  lessonId,
  section,
  loading,
  highlights = [],
  onHighlightSelect,
  activeHighlightId = null,
  previewHighlightId = null,
  onSectionSave,
  onSectionDelete,
  onSectionMove,
  onEditingChange,
  onCancelNew,
  isEditing = false,
  isNewSection = false,
  sectionIndex = 0,
  totalSections = 1,
}) => {
  const sectionId = section.id;
  const content = resolveSectionContent(section);
  const contentWrapperRef = useRef(null);
  const popoverRef = useRef(null);
  const [popoverState, setPopoverState] = useState(null);
  const [draftContent, setDraftContent] = useState(content);
  const [draftTitle, setDraftTitle] = useState(section.name || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const isMovingRef = useRef(false);
  const sectionLoading = Boolean(loading[sectionId]);
  const highlightSource = isEditing ? [] : highlights;
  const fallbackTitle =
    (section.name && section.name.trim().length ? section.name.trim() : null) ||
    "Untitled section";
  const titleInputId = `lesson-section-title-${sectionId}`;

  const highlightLookup = useMemo(() => {
    const lookup = {};
    highlightSource.forEach((highlight) => {
      lookup[highlight.id] = highlight;
    });
    return lookup;
  }, [highlightSource]);

  const popoverHighlights = useMemo(() => {
    if (!popoverState) {
      return [];
    }
    return popoverState.highlightIds
      .map((id) => highlightLookup[id])
      .filter(Boolean);
  }, [popoverState, highlightLookup]);

  const computePopoverMetrics = useCallback((rect, highlightCount) => {
    const viewportWidth =
      typeof window !== "undefined"
        ? window.innerWidth || document.documentElement.clientWidth || 0
        : 0;
    const viewportHeight =
      typeof window !== "undefined"
        ? window.innerHeight || document.documentElement.clientHeight || 0
        : 0;
    const baseHeight =
      highlightCount > 4
        ? 320
        : Math.max(120, highlightCount * 64 + 40);
    const rawLeft = rect.left + rect.width / 2;
    const clampedLeft = viewportWidth
      ? clamp(rawLeft, 24, viewportWidth - 24)
      : rawLeft;
    const desiredTop = rect.bottom + 8;
    const top =
      viewportHeight && desiredTop + baseHeight > viewportHeight - 16
        ? Math.max(16, rect.top - 8 - baseHeight)
        : desiredTop;
    return {
      top,
      left: clampedLeft,
      height: baseHeight,
      isScrollable: highlightCount > 4,
    };
  }, []);

  const closePopover = useCallback(() => {
    setPopoverState(null);
  }, []);

  useEffect(() => {
    if (!isEditing) {
      setDraftContent(content);
      setDraftTitle(section.name || "");
      setIsSaving(false);
    }
  }, [content, section.name, isEditing]);

  useEffect(() => {
    if (isEditing) {
      closePopover();
    }
  }, [isEditing, closePopover]);

  const handleEditorChange = useCallback((value) => {
    setDraftContent(value ?? "");
  }, []);

  const handleEnterEdit = useCallback(() => {
    if (isEditing || sectionLoading) {
      return;
    }
    setDraftContent(content);
    setDraftTitle(section.name || "");
    setPopoverState(null);
    onEditingChange?.(sectionId);
  }, [isEditing, sectionLoading, content, section.name, onEditingChange, sectionId]);

  const handleCancelEdit = useCallback(() => {
    if (isSaving) {
      return;
    }
    if (isNewSection && onCancelNew) {
      onCancelNew();
      return;
    }
    setDraftContent(content);
    setDraftTitle(section.name || "");
    setPopoverState(null);
    onEditingChange?.(null);
  }, [isSaving, content, section.name, onEditingChange, isNewSection, onCancelNew]);

  const handleTitleChange = useCallback((event) => {
    setDraftTitle(event.target.value);
  }, []);

  const handleSave = useCallback(async () => {
    if (isSaving || !onSectionSave) {
      return;
    }

    const trimmedTitle = (draftTitle || "").trim();
    const trimmedContent = (draftContent || "").trim();

    if (isNewSection && (!trimmedTitle || !trimmedContent)) {
      if (typeof window !== "undefined") {
        window.alert("Please provide both a title and content for the new section.");
      }
      return;
    }

    try {
      setIsSaving(true);
      const normalizedTitle = trimmedTitle || fallbackTitle;
      await onSectionSave(sectionId, {
        text: draftContent ?? "",
        title: normalizedTitle,
      });
      setPopoverState(null);
      onEditingChange?.(null);
    } catch (error) {
      console.error("Failed to save section", error);
      if (typeof window !== "undefined") {
        window.alert(
          error?.message || "Unable to save section. Please try again."
        );
      }
    } finally {
      setIsSaving(false);
    }
  }, [
    isSaving,
    onSectionSave,
    sectionId,
    draftContent,
    draftTitle,
    fallbackTitle,
    onEditingChange,
    isNewSection,
  ]);

  const handleDelete = useCallback(async () => {
    if (isDeleting || !onSectionDelete || isNewSection) {
      return;
    }
    const confirmed = window.confirm(
      "Are you sure you want to delete this section? This action cannot be undone."
    );
    if (!confirmed) {
      return;
    }
    try {
      setIsDeleting(true);
      await onSectionDelete(sectionId);
    } catch (error) {
      console.error("Failed to delete section", error);
      if (typeof window !== "undefined") {
        window.alert(
          error?.message || "Unable to delete section. Please try again."
        );
      }
    } finally {
      setIsDeleting(false);
    }
  }, [isDeleting, onSectionDelete, sectionId, isNewSection]);

  const handleMoveUp = useCallback(async () => {
    if (
      isMovingRef.current ||
      !onSectionMove ||
      isNewSection ||
      sectionIndex === 0
    ) {
      return;
    }
    const targetPosition = sectionIndex - 1;
    try {
      isMovingRef.current = true;
      setIsMoving(true);
      await onSectionMove(sectionId, targetPosition);
    } catch (error) {
      console.error("Failed to move section up", error);
      if (typeof window !== "undefined") {
        window.alert(
          error?.message || "Unable to move section. Please try again."
        );
      }
    } finally {
      isMovingRef.current = false;
      setIsMoving(false);
    }
  }, [onSectionMove, sectionId, sectionIndex, isNewSection]);

  const handleMoveDown = useCallback(async () => {
    if (
      isMovingRef.current ||
      !onSectionMove ||
      isNewSection ||
      sectionIndex >= totalSections - 1
    ) {
      return;
    }
    const targetPosition = sectionIndex + 1;
    try {
      isMovingRef.current = true;
      setIsMoving(true);
      await onSectionMove(sectionId, targetPosition);
    } catch (error) {
      console.error("Failed to move section down", error);
      if (typeof window !== "undefined") {
        window.alert(
          error?.message || "Unable to move section. Please try again."
        );
      }
    } finally {
      isMovingRef.current = false;
      setIsMoving(false);
    }
  }, [onSectionMove, sectionId, sectionIndex, totalSections, isNewSection]);

  useEffect(() => {
    if (!popoverState) {
      return undefined;
    }

    const handleMouseDown = (event) => {
      if (popoverRef.current?.contains(event.target)) {
        return;
      }
      closePopover();
    };

    document.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [popoverState, closePopover]);

  useEffect(() => {
    if (popoverState && popoverRef.current) {
      popoverRef.current.focus();
    }
  }, [popoverState]);

  useEffect(() => {
    if (!popoverState) {
      return;
    }

    if (!popoverHighlights.length) {
      closePopover();
      return;
    }

    if (
      activeHighlightId &&
      !popoverState.highlightIds.includes(activeHighlightId)
    ) {
      closePopover();
      return;
    }

    if (
      activeHighlightId &&
      popoverState.highlightIds.includes(activeHighlightId) &&
      popoverState.activeHighlightId !== activeHighlightId
    ) {
      setPopoverState((prev) =>
        prev
          ? {
              ...prev,
              activeHighlightId,
            }
          : prev
      );
    }
  }, [activeHighlightId, popoverState, popoverHighlights, closePopover]);

  useEffect(() => {
    if (
      !popoverState?.targetElement ||
      typeof window === "undefined" ||
      typeof document === "undefined"
    ) {
      return undefined;
    }

    const reposition = () => {
      setPopoverState((prev) => {
        if (!prev?.targetElement) {
          return prev;
        }
        const rect = prev.targetElement.getBoundingClientRect();
        const metrics = computePopoverMetrics(
          rect,
          prev.highlightIds.length
        );
        return {
          ...prev,
          position: {
            top: metrics.top,
            left: metrics.left,
          },
          popoverHeight: metrics.height,
          isScrollable: metrics.isScrollable,
        };
      });
    };

    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true);
    return () => {
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
    };
  }, [popoverState, computePopoverMetrics]);

  const handlePopoverSelect = useCallback(
    (highlightId) => {
      if (!highlightId || isEditing) {
        return;
      }
      onHighlightSelect?.(highlightId);
      setPopoverState((prev) =>
        prev
          ? {
              ...prev,
              activeHighlightId: highlightId,
            }
          : prev
      );
    },
    [onHighlightSelect, isEditing]
  );

  const handleCycle = useCallback(
    (direction) => {
      if (isEditing) {
        return;
      }
      setPopoverState((prev) => {
        if (!prev || prev.highlightIds.length < 2) {
          return prev;
        }
        const currentId =
          prev.activeHighlightId && prev.highlightIds.includes(prev.activeHighlightId)
            ? prev.activeHighlightId
            : prev.highlightIds[0];
        const currentIndex = prev.highlightIds.indexOf(currentId);
        const nextIndex =
          (currentIndex + direction + prev.highlightIds.length) %
          prev.highlightIds.length;
        const nextHighlightId = prev.highlightIds[nextIndex];
        if (nextHighlightId) {
          onHighlightSelect?.(nextHighlightId);
          return {
            ...prev,
            activeHighlightId: nextHighlightId,
          };
        }
        return prev;
      });
    },
    [onHighlightSelect, isEditing]
  );

  const handlePopoverKeyDown = useCallback(
    (event) => {
      if (!popoverState || isEditing) {
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        handleCycle(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        handleCycle(-1);
      } else if (event.key === "Escape") {
        event.preventDefault();
        closePopover();
      }
    },
    [popoverState, handleCycle, closePopover, isEditing]
  );

  const handleHighlightClick = useCallback(
    (highlightIds, rect, event) => {
      if (isEditing) {
        return;
      }

      // Normalize to array
      const ids = Array.isArray(highlightIds) ? highlightIds : [highlightIds];

      // Filter to valid highlights only
      const validIds = ids.filter((id) => highlightLookup[id]);
      if (!validIds.length) {
        return;
      }

      const selection =
        typeof window !== "undefined"
          ? window.getSelection()?.toString().trim()
          : "";

      if (selection) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      // Select the first (primary) highlight, or keep current if it's in the list
      const initialId =
        activeHighlightId && validIds.includes(activeHighlightId)
          ? activeHighlightId
          : validIds[0];

      onHighlightSelect?.(initialId);

      const metrics = computePopoverMetrics(rect, validIds.length);

      setPopoverState({
        highlightIds: validIds,
        activeHighlightId: initialId,
        position: {
          top: metrics.top,
          left: metrics.left,
        },
        popoverHeight: metrics.height,
        isScrollable: validIds.length > 4,
        targetElement: event.target,
      });
    },
    [highlightLookup, activeHighlightId, onHighlightSelect, computePopoverMetrics, isEditing]
  );

  const showMoveArrows = !isEditing && !isNewSection && onSectionMove && totalSections > 1;

  return (
    <div
      className="relative flex w-full text-xs md:text-base"
      data-lesson-section={sectionId}
      data-section-title={section.name}
    >
      <div
        className="flex w-full border border-gray-300 bg-secondary text-black dark:border-gray-800 dark:bg-primary-dark dark:text-white"
        ref={contentWrapperRef}
      >
        <div className="flex-1 p-4">
        <div className="absolute right-4 top-4 flex gap-2 text-xs font-semibold">
          {isEditing ? (
            <>
              <button
                type="button"
                className="flex items-center gap-1 rounded bg-green-600 px-3 py-1 text-white disabled:opacity-60"
                onClick={handleSave}
                disabled={isSaving || sectionLoading}
              >
                <FontAwesomeIcon icon={faFloppyDisk} className="h-3.5 w-3.5" />
                {isSaving ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                className="flex items-center gap-1 rounded border border-gray-400 px-3 py-1 text-gray-700 dark:text-gray-100 disabled:opacity-60"
                onClick={handleCancelEdit}
                disabled={isSaving}
              >
                <FontAwesomeIcon icon={faXmark} className="h-3.5 w-3.5" />
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="flex items-center gap-1 rounded border border-gray-400 px-3 py-1 text-gray-700 dark:text-gray-100 disabled:opacity-60"
                onClick={handleEnterEdit}
                disabled={sectionLoading || isDeleting}
                aria-label="Edit section"
              >
                <FontAwesomeIcon icon={faPenToSquare} className="h-3.5 w-3.5" />
                Edit
              </button>
              {onSectionDelete && !isNewSection && (
                <button
                  type="button"
                  className="flex h-7 w-7 items-center justify-center rounded-full text-gray-500 transition hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-950 dark:hover:text-red-400 disabled:opacity-60"
                  onClick={handleDelete}
                  disabled={sectionLoading || isDeleting}
                  aria-label="Delete section"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 pointer-events-none"
                    aria-hidden="true"
                  >
                    <path d="M4 7h16" />
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                    <path d="M6 7l1 11a2 2 0 002 2h6a2 2 0 002-2l1-11" />
                    <path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2" />
                  </svg>
                </button>
              )}
            </>
          )}
        </div>
        {sectionLoading ? (
          <div className="flex w-full items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <>
            <div className={`mb-2 ${isEditing ? "mt-2" : ""}`}>
              {isEditing ? (
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor={titleInputId}
                    className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
                  >
                    Section title
                  </label>
                  <input
                    id={titleInputId}
                    type="text"
                    className="rounded border border-gray-300 bg-white px-3 py-2 text-base font-semibold text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    value={draftTitle}
                    onChange={handleTitleChange}
                    placeholder="Enter a title for this section"
                  />
                </div>
              ) : (
                <h2 className="pr-28 text-lg font-semibold text-black dark:text-white">
                  {section.name || fallbackTitle}
                </h2>
              )}
              <div className="mt-1 h-px w-full bg-gray-300 dark:bg-gray-700" />
            </div>
            <div
              data-section-content
              data-section-id={sectionId}
              className="lesson-section-content leading-relaxed"
            >
              {isEditing ? (
                <RichTextEditor
                  value={draftContent}
                  onChange={handleEditorChange}
                  placeholder="Update this section's content…"
                />
              ) : (
                <RichTextEditor
                  value={content}
                  readOnly
                  highlights={highlightSource}
                  activeHighlightId={activeHighlightId}
                  previewHighlightId={previewHighlightId}
                  onHighlightClick={handleHighlightClick}
                />
              )}
            </div>
            {!isEditing && lessonId && (
              <ExercisesBlock
                lessonId={lessonId}
                sectionId={sectionId}
              />
            )}
          </>
        )}
        </div>
        {showMoveArrows && (
          <div className="flex flex-col items-center justify-center">
            <button
              type="button"
              onClick={handleMoveUp}
              disabled={sectionLoading || isMoving || sectionIndex === 0}
              className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-200 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-30 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300"
              aria-label="Move section up"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 pointer-events-none"
                aria-hidden="true"
              >
                <path d="M18 15l-6-6-6 6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleMoveDown}
              disabled={sectionLoading || isMoving || sectionIndex >= totalSections - 1}
              className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-200 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-30 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300"
              aria-label="Move section down"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 pointer-events-none"
                aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          </div>
        )}
      </div>
      {!isEditing && (
        <HighlightPopover
          popoverState={popoverState}
          popoverHighlights={popoverHighlights}
          handleCycle={handleCycle}
          handlePopoverSelect={handlePopoverSelect}
          handlePopoverKeyDown={handlePopoverKeyDown}
          popoverRef={popoverRef}
        />
      )}
    </div>
  );
};

export default LessonSection;
