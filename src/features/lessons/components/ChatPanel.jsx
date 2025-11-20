import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const ChatPanel = ({
  messages,
  inputValue,
  onInputChange,
  onSubmit,
  isSubmitting,
  pendingAction,
}) => {
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      onSubmit(event);
    }
  };

  return (
    <div className="flex h-full min-h-screen w-full flex-col border-l border-gray-200 bg-secondary dark:border-gray-800 dark:bg-primary-dark">
      <div className="border-b border-primary p-4 dark:border-gray-800">
        <p className="text-sm font-semibold text-black dark:text-white">
          Lesson Chat
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Highlight lesson text to auto-fill a question.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3">
        {messages.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
            No messages yet. Select some lesson content and start asking
            questions.
          </div>
        ) : (
          <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
            {messages.map((message) => {
              const isUser = message.role === "user";
              return (
                  <div key={message.id} className="flex justify-center">
                  {isUser ? (
                    <div className="w-full rounded-xl border border-gray-300 bg-primary px-4 py-3 text-sm leading-relaxed text-black shadow dark:border-gray-700 dark:bg-secondary-dark dark:text-white">
                      {message.text}
                      {message.meta?.action && (
                        <p className="mt-2 text-xs opacity-80">
                          action:{" "}
                          <span className="uppercase font-semibold">
                            {message.meta.action}
                          </span>
                          {message.meta.section_id && (
                            <> · section #{message.meta.section_id}</>
                          )}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="w-full py-3 text-sm leading-relaxed text-black dark:text-white">
                      {message.text}
                      {message.meta?.action && (
                        <p className="mt-2 text-xs text-gray-600 dark:text-gray-300">
                          action:{" "}
                          <span className="uppercase font-semibold">
                            {message.meta.action}
                          </span>
                          {message.meta.section_id && (
                            <> · section #{message.meta.section_id}</>
                          )}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 p-4 dark:border-gray-800">
        {pendingAction && (
          <div className="mb-3 rounded-lg border border-blue-200 bg-blue-50 p-2 text-xs text-blue-900 dark:border-blue-500/40 dark:bg-blue-500/10 dark:text-blue-100">
            Preparing to{" "}
            <span className="font-semibold uppercase">
              {pendingAction.action}
            </span>{" "}
            on section #{pendingAction.section_id || "?"}
          </div>
        )}
        <form onSubmit={onSubmit} className="space-y-2">
          <textarea
            value={inputValue}
            onChange={onInputChange}
            onKeyDown={handleKeyDown}
            className="h-24 w-full resize-none rounded-xl border border-gray-300 bg-primary p-3 text-sm text-black placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-secondary-dark dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-400"
            placeholder="Ask a question about the lesson..."
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 py-2 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FontAwesomeIcon icon={faPaperPlane} className="h-4 w-4" />
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPanel;

