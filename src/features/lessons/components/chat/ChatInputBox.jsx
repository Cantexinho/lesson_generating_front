import React, { useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const ChatInputBox = ({
  hasActiveThread,
  inputValue,
  onInputChange,
  onSubmit,
  isSubmitting,
  chatInputHeight,
  startChatInputResize,
}) => {
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
        onSubmit(event);
      }
    },
    [onSubmit]
  );

  return (
    <form onSubmit={onSubmit} className="space-y-2">
      <div className="relative">
        <div
          className="absolute -top-1 left-1/2 z-10 h-1 w-16 -translate-x-1/2 cursor-row-resize rounded-full bg-gray-300 dark:bg-gray-600"
          onMouseDown={startChatInputResize}
          role="separator"
          aria-orientation="horizontal"
          aria-label="Resize chat input"
        />
        <textarea
          disabled={!hasActiveThread}
          value={inputValue}
          onChange={onInputChange}
          onKeyDown={handleKeyDown}
          style={{
            height: `${chatInputHeight}px`,
          }}
          className="w-full resize-none rounded-xl border border-gray-300 bg-primary p-3 text-sm text-black placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-secondary-dark dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-500/40"
          placeholder={
            hasActiveThread
              ? "Ask a question about this highlight..."
              : "Select lesson text to start chatting..."
          }
        />
      </div>
      <button
        type="submit"
        disabled={!inputValue.trim() || isSubmitting || !hasActiveThread}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 py-2 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <FontAwesomeIcon icon={faPaperPlane} className="h-4 w-4" />
        Send
      </button>
    </form>
  );
};

export default ChatInputBox;


