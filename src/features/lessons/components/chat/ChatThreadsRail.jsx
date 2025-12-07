import React, { useEffect, useRef } from "react";
import ChatThreadTab from "./ChatThreadTab";

const ChatThreadsRail = ({
  threads = [],
  activeThreadId,
  onAddGeneralThread,
  onSelectThread,
  onCloseThread,
  onPreviewThread,
  onClearPreview,
}) => {
  const tabsContainerRef = useRef(null);

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

  return (
    <div
      className="flex items-center gap-2 overflow-x-auto p-1"
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
      {threads.map((thread) => (
        <ChatThreadTab
          key={thread.id}
          thread={thread}
          isActive={thread.id === activeThreadId}
          onSelectThread={onSelectThread}
          onCloseThread={onCloseThread}
          onPreviewThread={onPreviewThread}
          onClearPreview={onClearPreview}
        />
      ))}
    </div>
  );
};

export default ChatThreadsRail;


