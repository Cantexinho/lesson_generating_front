import React, { useState, useEffect, useCallback, useMemo } from "react";
import LessonGenerationInput from "features/lessons/components/LessonGenerationInput";
import LessonMain from "features/lessons/components/LessonMain";
import PgNavBar from "features/lessons/components/PgNavBar";
import ChatPanel from "features/lessons/components/ChatPanel";
import SelectionActions from "features/lessons/components/SelectionActions";
import * as inputHandlers from "features/lessons/utils/inputHandlers";
import * as lessonDataOperations from "features/lessons/utils/lessonDataOperations";
import useLessonConversations from "features/lessons/hooks/useLessonConversations";

const SELECTION_ACTIONS = [
  { id: "ask", label: "Ask" },
  { id: "explain", label: "Explain" },
  { id: "expand", label: "Expand" },
  { id: "simplify", label: "Simplify" },
  { id: "exercises", label: "Add exercises" },
];

const MIN_CHAT_WIDTH = 320;
const MAX_CHAT_WIDTH = 860;
const DEFAULT_CHAT_WIDTH = MIN_CHAT_WIDTH;
const NAV_WIDTH = 240;

const Playground = () => {
  const [title, setTitle] = useState("");
  const [lessonId, setLessonId] = useState();
  const [parts, setParts] = useState([]);
  const [pgMainState, setPgMainState] = useState([]);
  const [loading, setLoading] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [lesson, setLesson] = useState();
  const [chatInput, setChatInput] = useState("");
  const [selectionDetails, setSelectionDetails] = useState(null);
  const [selectionPosition, setSelectionPosition] = useState(null);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [chatWidth, setChatWidth] = useState(DEFAULT_CHAT_WIDTH);
  const [isResizingChat, setIsResizingChat] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(false);
  const [previewHighlightId, setPreviewHighlightId] = useState(null);

  const {
    conversations,
    activeConversationId,
    activeConversationMessages,
    activePendingAction,
    activePendingReference,
    highlightsBySection,
    isSending,
    resetConversations,
    createConversationFromSelection,
    selectConversation,
    removeConversation,
    startGeneralConversation,
    sendMessage,
  } = useLessonConversations({ lesson, lessonId, parts });

  const activeHighlightId = useMemo(() => {
    const activeThread = conversations.find(
      (thread) => thread.id === activeConversationId
    );
    if (!activeThread?.sectionId) {
      return null;
    }
    return activeThread.id;
  }, [conversations, activeConversationId]);

  const resetConversationState = useCallback(() => {
    resetConversations();
    setChatInput("");
    setSelectionDetails(null);
    setSelectionPosition(null);
    setPreviewHighlightId(null);
  }, [resetConversations, setPreviewHighlightId]);
  useEffect(() => {
    if (
      previewHighlightId &&
      !conversations.some((thread) => thread.id === previewHighlightId)
    ) {
      setPreviewHighlightId(null);
    }
  }, [previewHighlightId, conversations, setPreviewHighlightId]);

  const lessonViewportStyle = useMemo(() => {
    const navOffset = isNavVisible ? NAV_WIDTH : 0;
    return {
      marginLeft: navOffset ? `${navOffset}px` : 0,
      width: `max(calc(100vw - ${navOffset}px - ${MIN_CHAT_WIDTH}px), 320px)`,
    };
  }, [isNavVisible]);

  const handleTitleChangeSubmit = (e) => {
    inputHandlers.handleTitleChange(e, setTitle);
  };

  const handleLessonSelect = async (selectedLesson) => {
    resetConversationState();
    setLesson(selectedLesson);
    setTitle(selectedLesson.name);
    setLessonId(selectedLesson.id);
  };

  useEffect(() => {
    const fetchData = async () => {
      await lessonDataOperations.fetchSingleLesson(lesson, setParts);
    };

    fetchData();
  }, [lesson]);

  const handleNewLessonButton = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    setTitle("");
    setParts([]);
    resetConversationState();
    setIsLessonModalOpen(true);
  };

  const closeLessonModal = () => {
    setIsLessonModalOpen(false);
  };

  useEffect(() => {
    setPgMainState(parts);
  }, [parts]);

  useEffect(() => {
    setSelectionDetails(null);
    setSelectionPosition(null);
  }, [parts]);

  useEffect(() => {
    if (
      !selectionDetails ||
      typeof document === "undefined" ||
      typeof window === "undefined"
    ) {
      return undefined;
    }

    const handleGlobalMouseDown = (event) => {
      const popover = document.querySelector("[data-selection-actions]");
      if (popover && popover.contains(event.target)) {
        return;
      }
      setSelectionDetails(null);
      setSelectionPosition(null);
    };

    document.addEventListener("mousedown", handleGlobalMouseDown);
    return () => {
      document.removeEventListener("mousedown", handleGlobalMouseDown);
    };
  }, [selectionDetails]);

  useEffect(() => {
    if (
      !isResizingChat ||
      typeof window === "undefined" ||
      typeof document === "undefined"
    ) {
      return undefined;
    }

    const handleMouseMove = (event) => {
      const viewportWidth = window.innerWidth || 0;
      if (!viewportWidth) {
        return;
      }

      const proposedWidth = viewportWidth - event.clientX;
      const constrainedWidth = Math.min(
        MAX_CHAT_WIDTH,
        Math.max(MIN_CHAT_WIDTH, proposedWidth)
      );

      setChatWidth(constrainedWidth);
    };

    const stopResize = () => {
      setIsResizingChat(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", stopResize);
    const previousUserSelect = document.body?.style.userSelect;
    if (document.body) {
      document.body.style.userSelect = "none";
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopResize);
      if (document.body) {
        document.body.style.userSelect = previousUserSelect || "";
      }
    };
  }, [isResizingChat]);

  const handleTextSelection = useCallback((payload) => {
    if (!payload || !payload.text) {
      setSelectionDetails(null);
      setSelectionPosition(null);
      return;
    }

    setSelectionDetails(payload);
    setSelectionPosition(payload.rect);
  }, []);

  const handleSelectionAction = (actionId) => {
    if (!selectionDetails) {
      return;
    }

    const result = createConversationFromSelection(selectionDetails, actionId);
    if (!result) {
      return;
    }

    if (typeof window !== "undefined") {
      const selection = window.getSelection();
      if (selection && selection.removeAllRanges) {
        selection.removeAllRanges();
      }
    }

    setChatInput("");
    setSelectionDetails(null);
    setSelectionPosition(null);
  };

  const handleHighlightSelect = useCallback(
    (conversationId) => {
      if (!conversationId) {
        return;
      }

      selectConversation(conversationId);
      setPreviewHighlightId(null);

      const thread = conversations.find(
        (item) => item.id === conversationId && item.sectionId
      );

      if (!thread?.sectionId || typeof document === "undefined") {
        return;
      }

      const target = document.querySelector(
        `[data-highlight-anchor="${conversationId}"]`
      );
      const fallbackTarget =
        target ||
        document.querySelector(
          `[data-highlight-segment="true"][data-highlight-ids~="${conversationId}"]`
        );

      if (fallbackTarget && "scrollIntoView" in fallbackTarget) {
        fallbackTarget.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    },
    [selectConversation, conversations, setPreviewHighlightId]
  );

  const handleThreadPreview = useCallback(
    (threadId) => {
      if (!threadId) {
        setPreviewHighlightId(null);
        return;
      }
      const thread = conversations.find((item) => item.id === threadId);
      if (!thread?.sectionId) {
        setPreviewHighlightId(null);
        return;
      }
      setPreviewHighlightId(thread.id);
    },
    [conversations, setPreviewHighlightId]
  );

  const clearThreadPreview = useCallback(() => {
    setPreviewHighlightId(null);
  }, [setPreviewHighlightId]);

  const startChatResize = (event) => {
    event.preventDefault();
    setIsResizingChat(true);
  };

  const handleChatInputChange = (event) => {
    setChatInput(event.target.value);
  };

  const handleChatSubmit = async (event) => {
    event.preventDefault();
    const trimmed = chatInput.trim();

    if (!trimmed) {
      return;
    }

    const didSend = sendMessage(trimmed);
    if (didSend) {
      setChatInput("");
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-primary dark:bg-primary-dark">
      <PgNavBar
        navVisible={isNavVisible}
        onToggleNav={() => setIsNavVisible((prev) => !prev)}
        pgMainState={pgMainState}
        handleNewLessonButton={handleNewLessonButton}
        handleLessonSelect={handleLessonSelect}
        selectedLesson={lesson}
      />
      <div
        className="min-h-screen bg-primary p-8 dark:bg-secondary-dark transition-[margin,width] flex justify-center"
        style={lessonViewportStyle}
      >
        <LessonMain
          parts={parts}
          setParts={setParts}
          title={title}
          loading={loading}
          setLoading={setLoading}
          submitLoading={submitLoading}
          onTextSelection={handleTextSelection}
          highlights={highlightsBySection}
          onHighlightSelect={handleHighlightSelect}
          activeHighlightId={activeHighlightId}
          previewHighlightId={previewHighlightId}
        />
      </div>
      <div
        className="fixed inset-y-0 right-0 z-30 flex"
        style={{ width: `${chatWidth}px` }}
      >
        <div className="relative h-full w-full">
          <div
            className={`absolute left-0 top-0 h-full w-2 cursor-col-resize transition bg-transparent ${
              isResizingChat ? "bg-blue-500/30" : "bg-transparent"
            }`}
            onMouseDown={startChatResize}
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize lesson chat"
          />
          <ChatPanel
            threads={conversations}
            activeThreadId={activeConversationId}
            onSelectThread={handleHighlightSelect}
            onAddGeneralThread={startGeneralConversation}
            onCloseThread={removeConversation}
            messages={activeConversationMessages}
            inputValue={chatInput}
            onInputChange={handleChatInputChange}
            onSubmit={handleChatSubmit}
            isSubmitting={isSending}
            pendingAction={activePendingAction}
            pendingReference={activePendingReference}
            onPreviewThread={handleThreadPreview}
            onClearPreview={clearThreadPreview}
          />
        </div>
      </div>
      <SelectionActions
        visible={Boolean(selectionDetails)}
        position={selectionPosition}
        actions={SELECTION_ACTIONS}
        onAction={handleSelectionAction}
      />

      {isLessonModalOpen && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-4"
          onClick={closeLessonModal}
        >
          <div
            className="relative mx-auto flex w-full max-w-3xl items-start gap-3 rounded-2xl bg-secondary p-4 shadow-2xl dark:bg-secondary-dark sm:p-3"
            onClick={(event) => event.stopPropagation()}
          >
            <LessonGenerationInput
              title={title}
              handleTitleChange={handleTitleChangeSubmit}
              passedProps="w-full flex-1 max-w-none"
              placeholderText="Describe lesson to generate..."
              onSubmit={null}
            />
            <button
              type="button"
              onClick={closeLessonModal}
              className="shrink-0 self-start text-2xl font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Playground;
