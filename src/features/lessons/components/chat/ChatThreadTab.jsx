import React from "react";

const ChatThreadTab = ({
  thread,
  isActive,
  onSelectThread,
  onCloseThread,
  onPreviewThread,
  onClearPreview,
}) => {
  if (!thread) {
    return null;
  }

  const snippetText = thread.snippet || "";
  const snippetPreview =
    snippetText.length > 120
      ? `${snippetText.slice(0, 117).trimEnd()}…`
      : snippetText;

  const handleSelect = () => {
    onSelectThread?.(thread.id);
  };

  const handlePreview = () => {
    if (thread.sectionId) {
      onPreviewThread?.(thread.id);
    }
  };

  return (
    <button
      type="button"
      data-thread-tab={thread.id}
      onClick={handleSelect}
      onMouseEnter={handlePreview}
      onMouseLeave={() => onClearPreview?.()}
      onFocus={handlePreview}
      onBlur={() => onClearPreview?.()}
      className={`flex h-20 w-44 flex-none overflow-hidden rounded-2xl border px-3 py-2 text-left text-xs transition ${
        isActive
          ? "border-blue-500 bg-blue-50 text-blue-900 dark:border-blue-500/60 dark:bg-blue-500/10 dark:text-blue-100"
          : "border-gray-200 bg-white text-gray-700 hover:border-blue-300 dark:border-gray-800 dark:bg-secondary-dark dark:text-gray-200 dark:hover:border-blue-500/60"
      }`}
    >
      <div className="flex h-full w-full items-start gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-wide">
            {thread.action}
          </p>
          <p className="text-[11px] font-semibold text-gray-900 dark:text-white">
            {thread.sectionTitle || "Lesson section"}
          </p>
          <p
            className="mt-1 text-[11px] text-gray-600 dark:text-gray-300"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {snippetPreview}
          </p>
        </div>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onCloseThread?.(thread.id);
          }}
          className="flex-none text-lg leading-none text-gray-500 transition hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
          aria-label={`Close conversation ${thread.sectionTitle || ""}`}
        >
          ×
        </button>
      </div>
    </button>
  );
};

export default ChatThreadTab;


