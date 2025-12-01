import React, { useEffect, useRef, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const MIN_REFERENCE_HEIGHT = 32;
const REFERENCE_BUFFER = 12;
const REFERENCE_SLACK = 32;

const ChatPanel = ({
  threads = [],
  activeThreadId,
  onSelectThread,
  onAddGeneralThread,
  onCloseThread,
  messages = [],
  inputValue,
  onInputChange,
  onSubmit,
  isSubmitting,
  pendingAction,
  pendingReference,
  onPreviewThread,
  onClearPreview,
}) => {
  const tabsContainerRef = useRef(null);
  const referenceContentRef = useRef(null);
  const [referenceHeight, setReferenceHeight] = useState(
    MIN_REFERENCE_HEIGHT
  );
  const [referenceMaxHeight, setReferenceMaxHeight] = useState(
    MIN_REFERENCE_HEIGHT
  );
  const [chatInputHeight, setChatInputHeight] = useState(120);
  const [isResizingReference, setIsResizingReference] = useState(false);
  const [isResizingChatInput, setIsResizingChatInput] = useState(false);
  const orderedThreads = [...threads].slice().reverse();
  const activeThread = threads.find((thread) => thread.id === activeThreadId);
  const hasActiveThread = Boolean(activeThread);

  const clamp = useCallback((value, min, max) => {
    return Math.min(Math.max(value, min), max);
  }, []);

  const renderTab = (thread) => {
    const snippetText = thread.snippet || "";
    const snippetPreview =
      snippetText.length > 120
        ? `${snippetText.slice(0, 117).trimEnd()}…`
        : snippetText;
    const isActive = thread.id === activeThreadId;
    return (
      <button
        key={thread.id}
        type="button"
        onClick={() => onSelectThread?.(thread.id)}
        onMouseEnter={() => {
          if (thread.sectionId) {
            onPreviewThread?.(thread.id);
          }
        }}
        onMouseLeave={() => onClearPreview?.()}
        onFocus={() => {
          if (thread.sectionId) {
            onPreviewThread?.(thread.id);
          }
        }}
        onBlur={() => onClearPreview?.()}
        data-thread-tab={thread.id}
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

  useEffect(() => {
    if (!activeThreadId || !tabsContainerRef.current) {
      return;
    }

    const tabNode = tabsContainerRef.current.querySelector(
      `[data-thread-tab="${activeThreadId}"]`
    );

    if (tabNode && tabNode.scrollIntoView) {
      tabNode.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeThreadId, threads]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      onSubmit(event);
    }
  };

  useEffect(() => {
    if (!isResizingReference && !isResizingChatInput) {
      return undefined;
    }

    const handleMouseMove = (event) => {
      if (isResizingReference) {
        setReferenceHeight((prev) =>
          clamp(
            prev - event.movementY,
            MIN_REFERENCE_HEIGHT,
            referenceMaxHeight
          )
        );
      }
      if (isResizingChatInput) {
        setChatInputHeight((prev) =>
          clamp(prev - event.movementY, 80, 260)
        );
      }
    };

    const handleMouseUp = () => {
      setIsResizingReference(false);
      setIsResizingChatInput(false);
      if (document.body) {
        document.body.style.userSelect = "";
        document.body.style.cursor = "";
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    if (document.body) {
      document.body.style.userSelect = "none";
      document.body.style.cursor = "row-resize";
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      if (document.body) {
        document.body.style.userSelect = "";
        document.body.style.cursor = "";
      }
    };
  }, [isResizingReference, isResizingChatInput, clamp, referenceMaxHeight]);

  useEffect(() => {
    if (!pendingReference || messages.length > 0) {
      setReferenceMaxHeight(MIN_REFERENCE_HEIGHT);
      setReferenceHeight(MIN_REFERENCE_HEIGHT);
      return;
    }

    const node = referenceContentRef.current;
    if (!node) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      const measured = node.scrollHeight + REFERENCE_BUFFER;
      const nextMax = Math.max(
        MIN_REFERENCE_HEIGHT,
        measured + REFERENCE_SLACK
      );
      setReferenceMaxHeight(nextMax);
      setReferenceHeight(nextMax);
    });

    return () => cancelAnimationFrame(frame);
  }, [pendingReference, messages]);

  const startReferenceResize = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsResizingReference(true);
  };

  const startChatInputResize = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsResizingChatInput(true);
  };

  return (
    <div className="flex h-full min-h-screen w-full flex-col border-l border-gray-200 bg-secondary dark:border-gray-800 dark:bg-primary-dark">
      <div className="border-b border-primary p-4 dark:border-gray-800">
        <p className="text-sm font-semibold text-black dark:text-white">
          Lesson Chat
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Highlight lesson text to create focused conversations.
        </p>
      </div>

      <div className="border-b border-gray-200 bg-white/60 px-4 py-3 dark:border-gray-800 dark:bg-primary-dark/80">
        {threads.length === 0 ? (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            No saved highlights yet. Select lesson text to start.
          </p>
        ) : (
          <div
            className="flex items-center gap-2 overflow-x-auto pb-1"
            ref={tabsContainerRef}
          >
            <button
              type="button"
              onClick={() => onAddGeneralThread?.()}
              className="flex h-8 w-8 flex-none items-center justify-center rounded-full border border-dashed border-gray-400 text-lg text-gray-600 transition hover:border-blue-500 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-400 dark:hover:text-blue-300"
              aria-label="Start a new general chat"
            >
              +
            </button>
            {orderedThreads.map((thread) => renderTab(thread))}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3">
        {!hasActiveThread ? (
          <div className="rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
            Select lesson content to pin a highlight and begin chatting.
          </div>
        ) : messages.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
            No messages yet. Use the input below to ask a question.
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
                          <span className="font-semibold uppercase">
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
                          <span className="font-semibold uppercase">
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
        {pendingReference && messages.length === 0 && (
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
              <p
                ref={referenceContentRef}
                className="whitespace-pre-line break-words"
              >
                {pendingReference}
              </p>
            </div>
          </div>
        )}
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
      </div>
    </div>
  );
};

export default ChatPanel;

