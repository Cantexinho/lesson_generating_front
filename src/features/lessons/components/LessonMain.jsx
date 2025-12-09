import { useCallback, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Spinner from "./Spinner";
import LessonSection from "./LessonSection";

const LessonMain = ({
  lessonId,
  sections,
  setSections,
  title,
  loading,
  setLoading,
  submitLoading,
  onTextSelection,
  highlights,
  onHighlightSelect,
  activeHighlightId,
  previewHighlightId,
  onSectionSave,
  onSectionAdd,
  editingSectionId,
  onEditingChange,
}) => {
  const [pendingNewSection, setPendingNewSection] = useState(null);

  const handleAddSection = useCallback(() => {
    if (pendingNewSection || editingSectionId) return;
    const tempId = `new-section-${Date.now()}`;
    setPendingNewSection({ id: tempId, name: "", lesson_section_content: "" });
    onEditingChange?.(tempId);
  }, [pendingNewSection, editingSectionId, onEditingChange]);

  const handleNewSectionSave = useCallback(
    async (sectionId, data) => {
      const result = await onSectionAdd?.(data);
      if (result) {
        setPendingNewSection(null);
      }
      return result;
    },
    [onSectionAdd]
  );

  const handleNewSectionCancel = useCallback(() => {
    setPendingNewSection(null);
    onEditingChange?.(null);
  }, [onEditingChange]);

  const allSections = pendingNewSection
    ? [...sections, pendingNewSection]
    : sections;

  const handleLessonMouseUp = useCallback(() => {
    if (
      !onTextSelection ||
      typeof window === "undefined" ||
      editingSectionId
    ) {
      return;
    }

    const selection = window.getSelection();

    if (!selection || selection.rangeCount === 0) {
      onTextSelection(null);
      return;
    }

    const selectedText = selection.toString().trim();

    if (!selectedText) {
      onTextSelection(null);
      return;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    if (!rect) {
      onTextSelection(null);
      return;
    }

    const anchorNode = selection.anchorNode;
    const elementNodeType =
      window.Node && window.Node.ELEMENT_NODE
        ? window.Node.ELEMENT_NODE
        : 1;

    const anchorElement =
      anchorNode?.nodeType === elementNodeType
        ? anchorNode
        : anchorNode?.parentElement;

    const sectionElement = anchorElement
      ? anchorElement.closest("[data-lesson-section]")
      : null;

    if (!sectionElement) {
      onTextSelection(null);
      return;
    }

    const sectionId = sectionElement.getAttribute("data-lesson-section");
    const sectionTitle = sectionElement.getAttribute("data-section-title");
    const contentElement =
      sectionElement.querySelector("[data-section-content]");

    let offsets = null;

    if (
      contentElement &&
      contentElement.contains(range.startContainer) &&
      contentElement.contains(range.endContainer)
    ) {
      try {
        const preSelectionRange = range.cloneRange();
        preSelectionRange.selectNodeContents(contentElement);
        preSelectionRange.setEnd(range.startContainer, range.startOffset);
        const start = preSelectionRange.toString().length;
        const length = range.toString().length;
        offsets = {
          start,
          end: start + length,
        };
      } catch (error) {
        offsets = null;
      }
    }

    onTextSelection({
      text: selectedText,
      sectionId,
      sectionTitle,
      offsets,
      rect: {
        top: rect.top,
        left: rect.left + rect.width / 2,
      },
    });
  }, [onTextSelection, editingSectionId]);

  return (
    <div className="flex h-full w-full justify-center overflow-y-auto">
      <div
        className="flex w-full max-w-5xl flex-col gap-4 px-8 py-8"
        onMouseUp={handleLessonMouseUp}
      >
        {submitLoading ? (
          <div className="flex h-full w-full items-center justify-center">
            <Spinner />
          </div>
        ) : sections.length === 0 && !pendingNewSection ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
            Generate a lesson to see its content here.
            {lessonId && (
              <button
                type="button"
                onClick={handleAddSection}
                className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <FontAwesomeIcon icon={faPlus} className="h-3.5 w-3.5" />
                Add section
              </button>
            )}
          </div>
        ) : (
          <>
            {allSections.map((section) => {
              const isNewSection = section.id === pendingNewSection?.id;
              return (
                <LessonSection
                  key={section.id}
                  lessonId={lessonId}
                  section={section}
                  loading={loading}
                  highlights={
                    editingSectionId ? [] : highlights?.[section.id] || []
                  }
                  onHighlightSelect={
                    editingSectionId ? undefined : onHighlightSelect
                  }
                  activeHighlightId={editingSectionId ? null : activeHighlightId}
                  previewHighlightId={editingSectionId ? null : previewHighlightId}
                  onSectionSave={isNewSection ? handleNewSectionSave : onSectionSave}
                  onEditingChange={isNewSection ? undefined : onEditingChange}
                  onCancelNew={isNewSection ? handleNewSectionCancel : undefined}
                  isEditing={editingSectionId === section.id}
                  isNewSection={isNewSection}
                />
              );
            })}
            {lessonId && !pendingNewSection && !editingSectionId && (
              <button
                type="button"
                onClick={handleAddSection}
                className="group flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 py-4 text-sm font-medium text-gray-500 transition-all hover:border-gray-400 hover:bg-gray-50 hover:text-gray-700 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-500 dark:hover:bg-gray-800/50 dark:hover:text-gray-300"
              >
                <FontAwesomeIcon
                  icon={faPlus}
                  className="h-4 w-4 transition-transform group-hover:scale-110"
                />
                Add section
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LessonMain;
