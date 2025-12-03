import { useCallback, useEffect, useRef, useState } from "react";

export const MIN_REFERENCE_HEIGHT = 32;
const REFERENCE_BUFFER = 12;
const REFERENCE_SLACK = 32;
const MIN_CHAT_HEIGHT = 80;
const MAX_CHAT_HEIGHT = 260;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const useChatPanelResizing = ({ pendingReference, messages }) => {
  const referenceContentRef = useRef(null);
  const [referenceHeight, setReferenceHeight] = useState(MIN_REFERENCE_HEIGHT);
  const [referenceMaxHeight, setReferenceMaxHeight] =
    useState(MIN_REFERENCE_HEIGHT);
  const [chatInputHeight, setChatInputHeight] = useState(120);
  const [isResizingReference, setIsResizingReference] = useState(false);
  const [isResizingChatInput, setIsResizingChatInput] = useState(false);

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
          clamp(prev - event.movementY, MIN_CHAT_HEIGHT, MAX_CHAT_HEIGHT)
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
  }, [isResizingReference, isResizingChatInput, referenceMaxHeight]);

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

  const startReferenceResize = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsResizingReference(true);
  }, []);

  const startChatInputResize = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsResizingChatInput(true);
  }, []);

  return {
    referenceContentRef,
    referenceHeight,
    referenceMaxHeight,
    chatInputHeight,
    startReferenceResize,
    startChatInputResize,
  };
};

export default useChatPanelResizing;
