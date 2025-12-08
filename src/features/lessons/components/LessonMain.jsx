import { useCallback } from "react";
import Spinner from "./Spinner";
import LessonSection from "./LessonSection";

const LessonMain = ({
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
  editingSectionId,
  onEditingChange,
}) => {
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
        ) : sections.length === 0 ? (
          <div className="flex h-full w-full items-center justify-center rounded-2xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
            Generate a lesson to see its content here.
          </div>
        ) : (
          sections.map((section) => (
            <LessonSection
              key={section.id}
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
              onSectionSave={onSectionSave}
              onEditingChange={onEditingChange}
              isEditing={editingSectionId === section.id}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default LessonMain;
