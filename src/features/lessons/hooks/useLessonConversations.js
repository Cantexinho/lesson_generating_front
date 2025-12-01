import { useCallback, useEffect, useMemo, useState } from "react";

const GENERAL_CONVERSATION_ID = "conversation-general";
const GENERAL_CONVERSATION_PREFIX = "conversation-general";
const GENERAL_SNIPPET = "General lesson chat";

const alignOffsetsToSectionContent = (parts, selectionDetails) => {
  if (
    !selectionDetails?.sectionId ||
    !selectionDetails.text ||
    !selectionDetails.offsets
  ) {
    return selectionDetails?.offsets || null;
  }

  const section = parts.find(
    (part) => String(part.id) === String(selectionDetails.sectionId)
  );
  const sectionContent = section?.lesson_part_content || "";

  if (!sectionContent) {
    return selectionDetails.offsets;
  }

  const targetText = selectionDetails.text;

  if (!targetText.length) {
    return selectionDetails.offsets;
  }

  const approxStart = selectionDetails.offsets.start ?? 0;
  const approxEnd =
    selectionDetails.offsets.end ?? approxStart + targetText.length;
  const windowRadius = Math.max(8, Math.ceil(targetText.length * 0.5));
  const windowStart = Math.max(0, approxStart - windowRadius);
  const windowEnd = Math.min(sectionContent.length, approxEnd + windowRadius);
  const windowText = sectionContent.slice(windowStart, windowEnd);

  let matchIndex = windowText.indexOf(targetText);

  if (matchIndex === -1) {
    return selectionDetails.offsets;
  }

  let bestStart = windowStart + matchIndex;
  let bestDistance = Math.abs(bestStart - approxStart);

  while (matchIndex !== -1) {
    const candidateStart = windowStart + matchIndex;
    const candidateDistance = Math.abs(candidateStart - approxStart);
    if (candidateDistance < bestDistance) {
      bestStart = candidateStart;
      bestDistance = candidateDistance;
    }
    matchIndex = windowText.indexOf(targetText, matchIndex + 1);
  }

  return {
    start: bestStart,
    end: bestStart + targetText.length,
  };
};

const buildConversationMeta = (conversation) => {
  if (!conversation) {
    return undefined;
  }

  return {
    action: conversation.action,
    section_id: conversation.sectionId,
    section_title: conversation.sectionTitle,
    text: conversation.snippet,
  };
};

const buildGeneralConversation = (id = GENERAL_CONVERSATION_ID) => ({
  id,
  action: "general",
  sectionId: null,
  sectionTitle: "Whole lesson",
  snippet: GENERAL_SNIPPET,
});

const useLessonConversations = ({ lesson, lessonId, parts = [] }) => {
  const [conversations, setConversations] = useState(() => [
    buildGeneralConversation(),
  ]);
  const [activeConversationId, setActiveConversationId] = useState(
    GENERAL_CONVERSATION_ID
  );
  const [messagesByConversation, setMessagesByConversation] = useState(() => ({
    [GENERAL_CONVERSATION_ID]: [],
  }));
  const [pendingActionPayload, setPendingActionPayload] = useState(null);
  const [highlightsBySection, setHighlightsBySection] = useState({});
  const [isSending, setIsSending] = useState(false);

  const resetConversations = useCallback(() => {
    setConversations([buildGeneralConversation()]);
    setActiveConversationId(GENERAL_CONVERSATION_ID);
    setMessagesByConversation({
      [GENERAL_CONVERSATION_ID]: [],
    });
    setPendingActionPayload(null);
    setHighlightsBySection({});
    setIsSending(false);
  }, []);

  useEffect(() => {
    if (!parts.length) {
      setHighlightsBySection({});
      return;
    }

    setHighlightsBySection((prev) => {
      const validSectionIds = new Set(parts.map((part) => part.id));
      const nextHighlights = {};

      validSectionIds.forEach((sectionId) => {
        if (prev[sectionId]?.length) {
          nextHighlights[sectionId] = prev[sectionId];
        }
      });

      return nextHighlights;
    });
  }, [parts]);

  const selectConversation = useCallback((conversationId) => {
    setActiveConversationId(conversationId);
  }, []);

  const createConversationFromSelection = useCallback(
    (selectionDetails, actionId) => {
      if (!selectionDetails?.text || !actionId) {
        return null;
      }

      const timestamp = Date.now();
      const conversationId = `conversation-${timestamp}`;
      const actionPayload = {
        lesson_id: lesson?.id || lessonId || null,
        section_id: selectionDetails.sectionId,
        section_title: selectionDetails.sectionTitle,
        action: actionId,
        text: selectionDetails.text,
        threadId: conversationId,
      };

      setConversations((prev) => [
        ...prev,
        {
          id: conversationId,
          action: actionId,
          sectionId: selectionDetails.sectionId,
          sectionTitle: selectionDetails.sectionTitle,
          snippet: selectionDetails.text,
        },
      ]);

      setMessagesByConversation((prev) => ({
        ...prev,
        [conversationId]: [],
      }));

      const alignedOffsets = alignOffsetsToSectionContent(
        parts,
        selectionDetails
      );

      if (selectionDetails.sectionId && alignedOffsets) {
        setHighlightsBySection((prev) => {
          const sectionHighlights = prev[selectionDetails.sectionId] || [];
          return {
            ...prev,
            [selectionDetails.sectionId]: [
              ...sectionHighlights,
              {
                id: conversationId,
                action: actionId,
                start: alignedOffsets.start,
                end: alignedOffsets.end,
                text: selectionDetails.text,
                sectionTitle: selectionDetails.sectionTitle || null,
              },
            ],
          };
        });
      }

      setPendingActionPayload(actionPayload);
      setActiveConversationId(conversationId);

      return {
        conversationId,
        actionPayload,
      };
    },
    [lesson, lessonId, parts]
  );

  const startGeneralConversation = useCallback(() => {
    const conversationId = `${GENERAL_CONVERSATION_PREFIX}-${Date.now()}`;
    const thread = buildGeneralConversation(conversationId);

    setConversations((prev) => [...prev, thread]);
    setMessagesByConversation((prev) => ({
      ...prev,
      [conversationId]: [],
    }));
    setActiveConversationId(conversationId);

    return conversationId;
  }, []);

  const removeConversation = useCallback((conversationId) => {
    if (!conversationId) {
      return;
    }

    setConversations((prevConversations) => {
      const removedConversation = prevConversations.find(
        (conv) => conv.id === conversationId
      );
      const remainingConversations = prevConversations.filter(
        (conv) => conv.id !== conversationId
      );
      const hasRemaining = remainingConversations.length > 0;
      const fallbackThread = buildGeneralConversation();
      const nextConversations = hasRemaining
        ? remainingConversations
        : [fallbackThread];

      setMessagesByConversation((prevMessages) => {
        if (!prevMessages[conversationId]) {
          return hasRemaining
            ? prevMessages
            : { [GENERAL_CONVERSATION_ID]: [] };
        }

        const nextMessages = { ...prevMessages };
        delete nextMessages[conversationId];
        if (!hasRemaining) {
          return { [GENERAL_CONVERSATION_ID]: [] };
        }
        return nextMessages;
      });

      if (removedConversation?.sectionId) {
        setHighlightsBySection((prevHighlights) => {
          const existingHighlights =
            prevHighlights[removedConversation.sectionId];
          if (!existingHighlights) {
            return prevHighlights;
          }

          const updatedHighlights = existingHighlights.filter(
            (highlight) => highlight.id !== conversationId
          );

          if (!updatedHighlights.length) {
            const { [removedConversation.sectionId]: _, ...rest } =
              prevHighlights;
            return rest;
          }

          return {
            ...prevHighlights,
            [removedConversation.sectionId]: updatedHighlights,
          };
        });
      }

      setPendingActionPayload((prevPending) =>
        prevPending?.threadId === conversationId ? null : prevPending
      );

      setActiveConversationId((currentActiveId) => {
        if (currentActiveId !== conversationId) {
          return currentActiveId;
        }

        if (hasRemaining) {
          return remainingConversations[remainingConversations.length - 1].id;
        }

        return fallbackThread.id;
      });

      return nextConversations;
    });
  }, []);

  const sendMessage = useCallback(
    (rawText) => {
      const trimmed = rawText.trim();

      if (!trimmed || !activeConversationId) {
        return false;
      }

      const conversation = conversations.find(
        (thread) => thread.id === activeConversationId
      );
      const metaBase = buildConversationMeta(conversation);
      const actionMeta =
        pendingActionPayload?.threadId === activeConversationId
          ? pendingActionPayload
          : metaBase;

      if (
        pendingActionPayload &&
        pendingActionPayload.threadId === activeConversationId
      ) {
        setPendingActionPayload(null);
      }

      const timestamp = Date.now();
      const targetConversationId = activeConversationId;
      const userMessage = {
        id: `user-${timestamp}`,
        role: "user",
        text: trimmed,
        meta: actionMeta,
      };

      setMessagesByConversation((prev) => ({
        ...prev,
        [targetConversationId]: [
          ...(prev[targetConversationId] || []),
          userMessage,
        ],
      }));
      setIsSending(true);

      console.log("Chat request payload", {
        prompt: trimmed,
        ...(actionMeta || {}),
        conversation_id: targetConversationId,
      });

      const assistantReply = {
        id: `assistant-${timestamp}`,
        role: "assistant",
        text: "🚧 Chat service integration is coming soon. Your request was captured for processing.",
        meta: actionMeta,
      };

      setTimeout(() => {
        setMessagesByConversation((prev) => ({
          ...prev,
          [targetConversationId]: [
            ...(prev[targetConversationId] || []),
            assistantReply,
          ],
        }));
        setIsSending(false);
      }, 450);

      setConversations((prev) => {
        const index = prev.findIndex(
          (conversation) => conversation.id === targetConversationId
        );

        if (index === -1) {
          return prev;
        }

        const reordered = [...prev];
        const [selected] = reordered.splice(index, 1);
        reordered.push(selected);
        return reordered;
      });

      return true;
    },
    [activeConversationId, conversations, pendingActionPayload]
  );

  const activeConversationMessages = useMemo(() => {
    if (!activeConversationId) {
      return [];
    }
    return messagesByConversation[activeConversationId] || [];
  }, [activeConversationId, messagesByConversation]);

  const activePendingAction = useMemo(() => {
    if (!pendingActionPayload) {
      return null;
    }

    return pendingActionPayload.threadId === activeConversationId
      ? pendingActionPayload
      : null;
  }, [pendingActionPayload, activeConversationId]);

  return {
    conversations,
    activeConversationId,
    activeConversationMessages,
    activePendingAction,
    highlightsBySection,
    isSending,
    resetConversations,
    createConversationFromSelection,
    selectConversation,
    removeConversation,
    startGeneralConversation,
    sendMessage,
  };
};

export default useLessonConversations;
