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

  const formatWithEllipsis = (value, maxLength) => {
    const text = value || "";
    if (text.length <= maxLength) {
      return text;
    }
    return `${text.slice(0, maxLength - 1).trimEnd()}…`;
  };

  const snippetPreview = formatWithEllipsis(thread.snippet, 110);
  const sectionTitle = formatWithEllipsis(
    thread.sectionTitle || "Lesson section",
    60
  );

  const handleSelect = () => {
    onSelectThread?.(thread.id);
  };

  const handlePreview = () => {
    if (thread.sectionId) {
      onPreviewThread?.(thread.id);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleSelect();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      data-thread-tab={thread.id}
      onClick={handleSelect}
      onKeyDown={handleKeyDown}
      onMouseEnter={handlePreview}
      onMouseLeave={() => onClearPreview?.()}
      onFocus={handlePreview}
      onBlur={() => onClearPreview?.()}
      className={`flex h-20 w-44 flex-none overflow-hidden rounded-2xl border px-3 py-2 text-left text-xs transition focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 ${
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
          <p
            className="text-[11px] font-semibold text-gray-900 dark:text-white truncate"
            title={thread.sectionTitle || "Lesson section"}
          >
            {sectionTitle}
          </p>
          <p
            className="mt-1 text-[11px] text-gray-600 dark:text-gray-300 truncate"
            title={thread.snippet || ""}
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
          className="flex h-6 w-6 items-center justify-center rounded-full text-gray-500 transition hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
          aria-label={`Delete conversation ${thread.sectionTitle || ""}`}
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
      </div>
    </div>
  );
};

export default ChatThreadTab;


