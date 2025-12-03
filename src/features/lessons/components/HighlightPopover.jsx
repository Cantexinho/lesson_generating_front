import React from "react";
import { createPortal } from "react-dom";

const HighlightPopover = ({
  popoverState,
  popoverHighlights = [],
  handleCycle,
  handlePopoverSelect,
  handlePopoverKeyDown,
  popoverRef,
}) => {
  const popoverTarget =
    typeof document !== "undefined" ? document.body : null;

  if (!popoverTarget || !popoverState || !popoverHighlights.length) {
    return null;
  }

  const popoverActiveIndex = popoverHighlights.findIndex(
    (highlight) => highlight.id === popoverState.activeHighlightId
  );
  const resolvedPopoverIndex =
    popoverActiveIndex === -1 ? 0 : popoverActiveIndex;

  return createPortal(
    <div
      ref={popoverRef}
      role="dialog"
      tabIndex={-1}
      aria-label="Annotation options"
      className="fixed z-50 w-64 max-w-[90vw] rounded-xl border border-gray-200 bg-white p-3 text-xs shadow-2xl focus:outline-none dark:border-gray-700 dark:bg-secondary-dark"
      style={{
        top: popoverState.position.top,
        left: popoverState.position.left,
        transform: "translate(-50%, 0)",
        height: popoverState.isScrollable
          ? `${popoverState.popoverHeight}px`
          : "auto",
        maxHeight: `${popoverState.popoverHeight || 320}px`,
        overflowY: popoverState.isScrollable ? "auto" : "visible",
      }}
      onKeyDown={handlePopoverKeyDown}
    >
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          className="rounded-full border border-gray-200 p-1 text-gray-600 transition hover:bg-gray-100 disabled:opacity-30 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
          onClick={() => handleCycle(-1)}
          disabled={popoverHighlights.length < 2}
          aria-label="Previous annotation"
        >
          {"<"}
        </button>
        <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
          {popoverHighlights.length > 1
            ? `Annotation ${resolvedPopoverIndex + 1} of ${
                popoverHighlights.length
              }`
            : "Annotation"}
        </div>
        <button
          type="button"
          className="rounded-full border border-gray-200 p-1 text-gray-600 transition hover:bg-gray-100 disabled:opacity-30 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
          onClick={() => handleCycle(1)}
          disabled={popoverHighlights.length < 2}
          aria-label="Next annotation"
        >
          {">"}
        </button>
      </div>

      <ul className="mt-2 space-y-1">
        {popoverHighlights.map((highlight) => {
          const isActive = highlight.id === popoverState.activeHighlightId;
          return (
            <li key={highlight.id}>
              <button
                type="button"
                className={`w-full rounded-lg border px-2 py-1 text-left transition ${
                  isActive
                    ? "border-blue-500 bg-blue-50 text-blue-900 dark:border-blue-400/70 dark:bg-blue-500/10 dark:text-blue-50"
                    : "border-transparent text-gray-700 hover:border-blue-200 hover:bg-blue-50/50 dark:text-gray-200 dark:hover:border-blue-400/40 dark:hover:bg-blue-500/5"
                }`}
                onClick={() => handlePopoverSelect(highlight.id)}
              >
                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  {highlight.action}
                </p>
                <p className="text-sm leading-snug text-black dark:text-white">
                  {highlight.text}
                </p>
              </button>
            </li>
          );
        })}
      </ul>
    </div>,
    popoverTarget
  );
};

export default HighlightPopover;


