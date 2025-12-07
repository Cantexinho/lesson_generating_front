import React, { useEffect, useRef } from "react";
import useChatPanelResizing from "../hooks/useChatPanelResizing";
import ChatThreadsRail from "./chat/ChatThreadsRail";
import ChatMessages from "./chat/ChatMessages";
import ChatReferencePreview from "./chat/ChatReferencePreview";
import ChatInputBox from "./chat/ChatInputBox";

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
  pendingAction: _pendingAction,
  pendingReference,
  onPreviewThread,
  onClearPreview,
}) => {
  const {
    referenceContentRef,
    referenceHeight,
    referenceMaxHeight,
    chatInputHeight,
    startReferenceResize,
    startChatInputResize,
  } = useChatPanelResizing({ pendingReference, messages });
  const activeThread = threads.find((thread) => thread.id === activeThreadId);
  const hasActiveThread = Boolean(activeThread);
  const messagesLength = messages.length;
  const messagesScrollRef = useRef(null);

  useEffect(() => {
    if (!messagesScrollRef.current) {
      return;
    }
    const node = messagesScrollRef.current;
    node.scrollTop = node.scrollHeight;
  }, [messagesLength, hasActiveThread]);

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
          <ChatThreadsRail
            threads={threads}
            activeThreadId={activeThreadId}
            onAddGeneralThread={onAddGeneralThread}
            onSelectThread={onSelectThread}
            onCloseThread={onCloseThread}
            onPreviewThread={onPreviewThread}
            onClearPreview={onClearPreview}
          />
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3" ref={messagesScrollRef}>
        <ChatMessages hasActiveThread={hasActiveThread} messages={messages} />
      </div>

      <div className="border-t border-gray-200 p-4 dark:border-gray-800">
        <ChatReferencePreview
          pendingReference={pendingReference}
          messagesLength={messagesLength}
          referenceHeight={referenceHeight}
          referenceMaxHeight={referenceMaxHeight}
          referenceContentRef={referenceContentRef}
          startReferenceResize={startReferenceResize}
        />
        <ChatInputBox
          hasActiveThread={hasActiveThread}
          inputValue={inputValue}
          onInputChange={onInputChange}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          chatInputHeight={chatInputHeight}
          startChatInputResize={startChatInputResize}
        />
      </div>
    </div>
  );
};

export default ChatPanel;

