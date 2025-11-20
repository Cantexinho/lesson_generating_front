import React from "react";
import Spinner from "./Spinner";

const HIGHLIGHT_COLORS = {
  ask: "bg-yellow-200 text-black dark:bg-yellow-500/40 dark:text-white",
  explain: "bg-green-200 text-black dark:bg-green-500/30 dark:text-white",
  expand: "bg-blue-200 text-black dark:bg-blue-500/30 dark:text-white",
  simplify: "bg-purple-200 text-black dark:bg-purple-500/30 dark:text-white",
  exercises: "bg-orange-200 text-black dark:bg-orange-500/30 dark:text-white",
};

const renderContentWithHighlights = (
  content,
  highlights,
  onHighlightSelect
) => {
  if (!highlights?.length) {
    return content;
  }

  const safeContent = content || "";
  const orderedHighlights = [...highlights].sort((a, b) => a.start - b.start);
  const fragments = [];
  let cursor = 0;

  orderedHighlights.forEach((highlight) => {
    const start = Math.max(0, Math.min(safeContent.length, highlight.start));
    const end = Math.max(start, Math.min(safeContent.length, highlight.end));

    if (cursor < start) {
      fragments.push(safeContent.slice(cursor, start));
    }

    const slice = safeContent.slice(start, end);
    const highlightClasses =
      HIGHLIGHT_COLORS[highlight.action] ||
      "bg-blue-200 text-black dark:bg-blue-500/30 dark:text-white";

    fragments.push(
      <span
        key={`${highlight.id}-${start}-${end}`}
        role="button"
        tabIndex={0}
        onClick={() => onHighlightSelect?.(highlight.id)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onHighlightSelect?.(highlight.id);
          }
        }}
        className={`rounded px-1 py-0.5 ${highlightClasses} cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500`}
        data-highlight-id={highlight.id}
      >
        {slice}
      </span>
    );
    cursor = end;
  });

  if (cursor < safeContent.length) {
    fragments.push(safeContent.slice(cursor));
  }

  return fragments;
};

const LessonPart = ({ part, loading, highlights = [], onHighlightSelect }) => {
  const content = part.lesson_part_content || "";

  return (
    <div
      className="relative flex w-full justify-between text-xs md:text-base"
      data-lesson-section={part.id}
      data-section-title={`Part ${part.number}: ${part.name}`}
    >
      <div className="relative w-full border border-gray-300 bg-secondary p-4 text-black dark:border-gray-800 dark:bg-primary-dark dark:text-white">
        {loading[part.id] ? (
          <div className="flex w-full items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <>
            <h2 className="mb-2 text-black dark:text-white">
              {`Part ${part.number}: ${part.name}`}
            </h2>
            <p
              data-section-content
              data-section-id={part.id}
              className="whitespace-pre-wrap"
            >
              {renderContentWithHighlights(content, highlights, onHighlightSelect)}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default LessonPart;
