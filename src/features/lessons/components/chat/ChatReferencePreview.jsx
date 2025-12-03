import React from "react";
import { MIN_REFERENCE_HEIGHT } from "../../hooks/useChatPanelResizing";

const ChatReferencePreview = ({
  pendingReference,
  messagesLength,
  referenceHeight,
  referenceMaxHeight,
  referenceContentRef,
  startReferenceResize,
}) => {
  if (!pendingReference || messagesLength > 0) {
    return null;
  }

  return (
    <div className="relative">
      <div
        className="absolute -top-1 left-1/2 z-10 h-1 w-16 -translate-x-1/2 cursor-row-resize rounded-full bg-gray-300 dark:bg-gray-600"
        onMouseDown={startReferenceResize}
        role="separator"
        aria-orientation="horizontal"
        aria-label="Resize referencing note"
      />
      <div
        className="mb-3 rounded-lg border border-dashed border-gray-400 bg-white/60 p-2 pb-4 text-xs text-gray-700 shadow-sm dark:border-gray-600 dark:bg-secondary-dark/80 dark:text-gray-200"
        style={{
          height: `${referenceHeight}px`,
          minHeight: `${MIN_REFERENCE_HEIGHT}px`,
          maxHeight: `${referenceMaxHeight}px`,
          overflowY: "auto",
        }}
      >
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Referencing
        </p>
        <p ref={referenceContentRef} className="whitespace-pre-line break-words">
          {pendingReference}
        </p>
      </div>
    </div>
  );
};

export default ChatReferencePreview;

