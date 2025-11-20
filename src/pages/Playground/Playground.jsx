import React, { useState, useEffect, useCallback } from "react";
import LessonGenerationInput from "features/lessons/components/LessonGenerationInput";
import LessonNumber from "features/lessons/components/LessonNumber";
import LessonMain from "features/lessons/components/LessonMain";
import PgNavBar from "features/lessons/components/PgNavBar";
import ChatPanel from "features/lessons/components/ChatPanel";
import SelectionActions from "features/lessons/components/SelectionActions";
import * as inputHandlers from "features/lessons/utils/inputHandlers";
import * as lessonHandlers from "features/lessons/utils/lessonHandlers";
import * as lessonDataOperations from "features/lessons/utils/lessonDataOperations";

const SELECTION_ACTIONS = [
  { id: "ask", label: "Ask" },
  { id: "explain", label: "Explain" },
  { id: "expand", label: "Expand" },
  { id: "simplify", label: "Simplify" },
  { id: "exercises", label: "Add exercises" },
];

const MIN_CHAT_WIDTH = 320;
const MAX_CHAT_WIDTH = 860;
const DEFAULT_CHAT_WIDTH = 420;

const Playground = () => {
  const [title, setTitle] = useState("");
  const [lessonId, setLessonId] = useState();
  const [parts, setParts] = useState([]);
  const [pgMainState, setPgMainState] = useState([]);
  const [selectedNumber, setSelectedNumber] = useState(1);
  const [loading, setLoading] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [lesson, setLesson] = useState();
  const [chatMessages, setChatMessages] = useState([
    {
      id: "assistant-welcome",
      role: "assistant",
      text: "Select text inside the lesson on the right to start a conversation.",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [pendingActionPayload, setPendingActionPayload] = useState(null);
  const [selectionDetails, setSelectionDetails] = useState(null);
  const [selectionPosition, setSelectionPosition] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [chatWidth, setChatWidth] = useState(DEFAULT_CHAT_WIDTH);
  const [isResizingChat, setIsResizingChat] = useState(false);
  const lessonViewportWidth = `max(calc(100vw - ${MIN_CHAT_WIDTH}px), 320px)`;

  const handleTitleChangeSubmit = (e) => {
    inputHandlers.handleTitleChange(e, setTitle);
  };

  const handleNumberChangeSubmit = (e) => {
    inputHandlers.handleNumberChange(e, setSelectedNumber);
  };

  const handleLessonSelect = async (selectedLesson) => {
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

  const handleGenerateSubmit = async (e) => {
    e.preventDefault();
    await lessonDataOperations.handleGenerate(
      title,
      selectedNumber,
      setSubmitLoading,
      setParts
    );
  };

  const handleDeleteLessonSubmit = async (e) => {
    e.preventDefault();
    await lessonHandlers.handleDeleteLesson(
      title,
      lessonId,
      setSubmitLoading,
      setParts
    );
  };

  const handleNewLessonButton = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    setTitle("");
    setParts([]);
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

    const actionPayload = {
      lesson_id: lesson?.id || lessonId || null,
      section_id: selectionDetails.sectionId,
      section_title: selectionDetails.sectionTitle,
      action: actionId,
      text: selectionDetails.text,
    };

    setPendingActionPayload(actionPayload);
    setChatInput(selectionDetails.text);
    setSelectionDetails(null);
    setSelectionPosition(null);
  };

  const startChatResize = (event) => {
    event.preventDefault();
    setIsResizingChat(true);
  };

  const handleModalGenerate = async (event) => {
    await handleGenerateSubmit(event);
    closeLessonModal();
  };

  const handleModalDelete = async (event) => {
    await handleDeleteLessonSubmit(event);
    closeLessonModal();
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

    const actionMeta = pendingActionPayload || undefined;
    setPendingActionPayload(null);

    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: trimmed,
      meta: actionMeta,
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setIsSending(true);

    console.log("Chat request payload", {
      prompt: trimmed,
      ...(actionMeta || {}),
    });

    const assistantReply = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      text:
        "🚧 Chat service integration is coming soon. Your request was captured for processing.",
      meta: actionMeta,
    };

    setTimeout(() => {
      setChatMessages((prev) => [...prev, assistantReply]);
      setIsSending(false);
    }, 450);
  };

  return (
    <div className="relative min-h-screen w-full bg-primary dark:bg-primary-dark">
      <PgNavBar
        pgMainState={pgMainState}
        handleNewLessonButton={handleNewLessonButton}
        handleLessonSelect={handleLessonSelect}
        selectedLesson={lesson}
      />
      <div
        className="min-h-screen bg-primary p-8 dark:bg-secondary-dark"
        style={{ width: lessonViewportWidth }}
      >
        <LessonMain
          parts={parts}
          setParts={setParts}
          title={title}
          loading={loading}
          setLoading={setLoading}
          submitLoading={submitLoading}
          onTextSelection={handleTextSelection}
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
            messages={chatMessages}
            inputValue={chatInput}
            onInputChange={handleChatInputChange}
            onSubmit={handleChatSubmit}
            isSubmitting={isSending}
            pendingAction={pendingActionPayload}
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
