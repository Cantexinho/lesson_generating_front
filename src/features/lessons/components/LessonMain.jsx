import { useCallback } from "react";
import Spinner from "./Spinner";
import * as partHandlers from "../utils/partHandlers";
import LessonPart from "./LessonPart";

const LessonMain = ({
  parts,
  setParts,
  title,
  loading,
  setLoading,
  submitLoading,
  onTextSelection,
}) => {
  const handleLessonMouseUp = useCallback(() => {
    if (!onTextSelection || typeof window === "undefined") {
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

    onTextSelection({
      text: selectedText,
      sectionId,
      sectionTitle,
      rect: {
        top: rect.top + window.scrollY,
        left: rect.left + rect.width / 2 + window.scrollX,
      },
    });
  }, [onTextSelection]);

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
        ) : parts.length === 0 ? (
          <div className="flex h-full w-full items-center justify-center rounded-2xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
            Generate a lesson to see its content here.
          </div>
        ) : (
          parts.map((part) => (
            <LessonPart
              key={part.id}
              part={part}
              loading={loading}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default LessonMain;
