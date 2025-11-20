import { useCallback, useEffect, useMemo, useState } from "react";

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

const useLessonConversations = ({ lesson, lessonId, parts = [] }) => {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messagesByConversation, setMessagesByConversation] = useState({});
  const [pendingActionPayload, setPendingActionPayload] = useState(null);
  const [highlightsBySection, setHighlightsBySection] = useState({});
  const [isSending, setIsSending] = useState(false);

  const resetConversations = useCallback(() => {
    setConversations([]);
    setActiveConversationId(null);
    setMessagesByConversation({});
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
        [conversationId]: [
          {
            id: `assistant-${timestamp}-welcome`,
            role: "assistant",
            text: "Select or type a question about this highlighted text.",
            meta: {
              action: actionId,
              section_id: selectionDetails.sectionId,
              section_title: selectionDetails.sectionTitle,
            },
          },
        ],
      }));

      if (selectionDetails.sectionId && selectionDetails.offsets) {
        setHighlightsBySection((prev) => {
          const sectionHighlights = prev[selectionDetails.sectionId] || [];
          return {
            ...prev,
            [selectionDetails.sectionId]: [
              ...sectionHighlights,
              {
                id: conversationId,
                action: actionId,
                start: selectionDetails.offsets.start,
                end: selectionDetails.offsets.end,
                text: selectionDetails.text,
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
    [lesson, lessonId]
  );

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
    sendMessage,
  };
};

export default useLessonConversations;
