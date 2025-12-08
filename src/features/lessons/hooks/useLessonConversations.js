import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { sendLessonChat } from "../api/chatService";
import {
  createConversation,
  deleteConversation,
  fetchConversationMessages,
  fetchLessonConversations,
} from "../api/conversationService";

const GENERAL_CONVERSATION_PREFIX = "conversation-general";
const GENERAL_SNIPPET = "General lesson chat";

const ensureArray = (value) => {
  if (Array.isArray(value)) {
    return value;
  }
  if (Array.isArray(value?.results)) {
    return value.results;
  }
  if (Array.isArray(value?.data)) {
    return value.data;
  }
  if (Array.isArray(value?.items)) {
    return value.items;
  }
  if (Array.isArray(value?.messages)) {
    return value.messages;
  }
  return [];
};

const toFiniteNumber = (value) => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const parseTimestamp = (value) => {
  if (value instanceof Date) {
    const timestamp = value.getTime();
    return Number.isFinite(timestamp) ? timestamp : null;
  }
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value === "string" && value.trim()) {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? null : parsed;
  }
  return null;
};

const sortConversationsByRecency = (threads = []) =>
  [...threads].sort((a, b) => {
    const aTime = a?.lastUpdatedAt ?? 0;
    const bTime = b?.lastUpdatedAt ?? 0;
    if (aTime === bTime) {
      return (a?.id || "").localeCompare(b?.id || "");
    }
    return bTime - aTime;
  });

const alignOffsetsToSectionContent = (sections, selectionDetails) => {
  if (
    !selectionDetails?.sectionId ||
    !selectionDetails.text ||
    !selectionDetails.offsets
  ) {
    return selectionDetails?.offsets || null;
  }

  const section = sections.find(
    (section) => String(section.id) === String(selectionDetails.sectionId)
  );
  const sectionContent = section?.lesson_section_content || "";

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
    section_id: conversation.sectionId || null,
    section_title: conversation.sectionTitle || null,
    text: conversation.snippet,
    lesson_id: conversation.lessonId || null,
    highlight_start: conversation.highlight?.start ?? null,
    highlight_end: conversation.highlight?.end ?? null,
  };
};

const normalizeConversationRecord = (record) => {
  if (!record) {
    return null;
  }

  const id = record.id || record.uuid || record.conversation_id;
  if (!id) {
    return null;
  }

  const action =
    record.action ||
    record.highlight_action ||
    record.highlighted_action ||
    "ask";
  const sectionIdRaw =
    record.section_id ||
    record.sectionId ||
    record.section?.id ||
    record.lesson_section_id ||
    null;
  const sectionId = sectionIdRaw ? String(sectionIdRaw) : null;
  const sectionTitle =
    record.section_title ||
    record.sectionTitle ||
    record.section?.title ||
    record.lesson_section_title ||
    (sectionId ? `Section ${sectionId}` : "Whole lesson");
  const lessonId = record.lesson_id || record.lessonId || null;

  const highlightStart = toFiniteNumber(
    record.highlight_start ??
      record.highlight_start_offset ??
      record.highlight?.start_offset
  );
  const highlightEnd = toFiniteNumber(
    record.highlight_end ??
      record.highlight_end_offset ??
      record.highlight?.end_offset
  );
  const highlightText =
    record.highlight_text ||
    record.highlighted_text ||
    record.highlight?.text ||
    record.snippet ||
    record.text ||
    "";
  const lastUpdatedAt =
    parseTimestamp(
      record.updated_at ||
        record.updatedAt ||
        record.last_message_at ||
        record.lastMessageAt ||
        record.modified_at ||
        record.modifiedAt
    ) ?? null;

  return {
    id: String(id),
    action: action || "ask",
    sectionId,
    sectionTitle,
    snippet:
      record.snippet ||
      record.summary ||
      record.text ||
      highlightText ||
      GENERAL_SNIPPET,
    lessonId,
    isPersisted: true,
    highlight:
      typeof highlightStart === "number" && typeof highlightEnd === "number"
        ? {
            start: highlightStart,
            end: highlightEnd,
            text: highlightText || GENERAL_SNIPPET,
          }
        : null,
    lastUpdatedAt,
  };
};

const deriveHighlightsBySection = (threads = []) =>
  threads.reduce((acc, thread) => {
    if (!thread.sectionId || !thread.highlight) {
      return acc;
    }
    const nextEntry = acc[thread.sectionId] ? [...acc[thread.sectionId]] : [];
    nextEntry.push({
      id: thread.id,
      action: thread.action,
      start: thread.highlight.start,
      end: thread.highlight.end,
      text: thread.highlight.text || thread.snippet,
      sectionTitle: thread.sectionTitle,
    });
    acc[thread.sectionId] = nextEntry;
    return acc;
  }, {});

const resolveMessageRole = (rawType) => {
  const normalized = (rawType || "").toLowerCase();
  if (normalized.includes("user")) {
    return "user";
  }
  return "assistant";
};

const normalizeMessageRecord = (message, fallbackMeta) => {
  if (!message) {
    return null;
  }
  const role = resolveMessageRole(
    message.role || message.type || message.message_type
  );
  const rawText =
    message.text || message.content || message.body || message.message || "";
  const text =
    typeof rawText === "string" ? rawText : JSON.stringify(rawText ?? "");
  return {
    id: String(message.id || message.uuid || `${role}-${Date.now()}`),
    role,
    text,
    meta: message.meta || fallbackMeta || null,
  };
};

const useLessonConversations = ({ lesson, lessonId, sections = [] }) => {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messagesByConversation, setMessagesByConversation] = useState({});
  const [pendingActionPayload, setPendingActionPayload] = useState(null);
  const [pendingReferences, setPendingReferences] = useState({});
  const [highlightsBySection, setHighlightsBySection] = useState({});
  const [isSending, setIsSending] = useState(false);

  const conversationsRef = useRef(conversations);
  const messagesLoadedRef = useRef(new Set());
  const generalSeedInFlightRef = useRef(new Set());

  useEffect(() => {
    conversationsRef.current = conversations;
  }, [conversations]);

  const upsertConversationState = useCallback(
    (conversation, { activate = false, touch = false } = {}) => {
      if (!conversation) {
        return null;
      }

      const shouldTouch = Boolean(touch || activate);
      const timestamp = Date.now();
      let mergedConversation = conversation;

      setConversations((prev) => {
        const next = [...prev];
        const index = next.findIndex((thread) => thread.id === conversation.id);

        if (index === -1) {
          mergedConversation = {
            ...conversation,
            lastUpdatedAt: shouldTouch
              ? timestamp
              : conversation.lastUpdatedAt ?? null,
          };
          next.push(mergedConversation);
        } else {
          const existing = next[index];
          mergedConversation = {
            ...existing,
            ...conversation,
            lastUpdatedAt: shouldTouch
              ? timestamp
              : conversation.lastUpdatedAt ?? existing.lastUpdatedAt ?? null,
          };
          next[index] = mergedConversation;
        }

        return sortConversationsByRecency(next);
      });

      setMessagesByConversation((prev) => {
        if (prev[conversation.id]) {
          return prev;
        }
        return {
          ...prev,
          [conversation.id]: [],
        };
      });

      if (mergedConversation.sectionId && mergedConversation.highlight) {
        setHighlightsBySection((prev) => {
          const existing = prev[mergedConversation.sectionId] || [];
          const filtered = existing.filter(
            (highlight) => highlight.id !== mergedConversation.id
          );
          const nextEntry = {
            id: mergedConversation.id,
            action: mergedConversation.action,
            start: mergedConversation.highlight.start,
            end: mergedConversation.highlight.end,
            text:
              mergedConversation.highlight.text || mergedConversation.snippet,
            sectionTitle: mergedConversation.sectionTitle,
          };
          return {
            ...prev,
            [mergedConversation.sectionId]: [...filtered, nextEntry],
          };
        });
      }

      if (activate) {
        setActiveConversationId(conversation.id);
      }

      return mergedConversation;
    },
    [setActiveConversationId]
  );

  const resetConversations = useCallback(() => {
    messagesLoadedRef.current = new Set();
    conversationsRef.current = [];
    setConversations([]);
    setActiveConversationId(null);
    setMessagesByConversation({});
    setPendingActionPayload(null);
    setPendingReferences({});
    setHighlightsBySection({});
    setIsSending(false);
  }, []);

  const createServerConversation = useCallback(
    async (
      lessonIdentifier,
      payload = {},
      { activate = true, pendingReferenceText = null, touch = false } = {}
    ) => {
      if (!lessonIdentifier) {
        return null;
      }

      try {
        const response = await createConversation(lessonIdentifier, payload);
        const normalized = normalizeConversationRecord(response);
        if (!normalized) {
          return null;
        }

        const conversation = upsertConversationState(normalized, {
          activate,
          touch,
        });
        if (conversation && pendingReferenceText) {
          const trimmed = pendingReferenceText.trim();
          if (trimmed) {
            setPendingReferences((prev) => ({
              ...prev,
              [conversation.id]: trimmed,
            }));
          }
        }
        return conversation;
      } catch (error) {
        console.error("Failed to create conversation", error);
        return null;
      }
    },
    [upsertConversationState]
  );

  const touchConversation = useCallback((conversationId) => {
    if (!conversationId) {
      return;
    }
    const timestamp = Date.now();
    setConversations((prev) => {
      const index = prev.findIndex((thread) => thread.id === conversationId);
      if (index === -1) {
        return prev;
      }
      const next = [...prev];
      next[index] = {
        ...next[index],
        lastUpdatedAt: timestamp,
      };
      return sortConversationsByRecency(next);
    });
  }, []);

  useEffect(() => {
    if (!sections.length) {
      setHighlightsBySection({});
      return;
    }

    setHighlightsBySection((prev) => {
      const validSectionIds = new Set(sections.map((section) => section.id));
      const nextHighlights = {};

      validSectionIds.forEach((sectionId) => {
        if (prev[sectionId]?.length) {
          nextHighlights[sectionId] = prev[sectionId];
        }
      });

      return nextHighlights;
    });
  }, [sections]);

  const syncConversationsFromServer = useCallback(async (lessonIdentifier) => {
    if (!lessonIdentifier) {
      return [];
    }

    try {
      const response = await fetchLessonConversations(lessonIdentifier);
      const records = ensureArray(
        response?.conversations ?? response?.results ?? response
      );
      const normalized = records
        .map(normalizeConversationRecord)
        .filter(Boolean);

      const previousThreads = conversationsRef.current || [];
      const previousById = new Map(
        previousThreads.map((thread) => [thread.id, thread])
      );

      const merged = normalized.map((thread) => {
        const existing = previousById.get(thread.id);
        if (existing) {
          previousById.delete(thread.id);
        }
        return {
          ...existing,
          ...thread,
          isPersisted: true,
          lastUpdatedAt:
            thread.lastUpdatedAt || existing?.lastUpdatedAt || null,
        };
      });

      const remaining = Array.from(previousById.values()).filter(
        (thread) => !thread.isPersisted
      );
      const nextThreads = sortConversationsByRecency([...merged, ...remaining]);

      conversationsRef.current = nextThreads;
      setConversations(nextThreads);
      setMessagesByConversation((prev) => {
        const next = {};
        nextThreads.forEach((thread) => {
          next[thread.id] = prev[thread.id] || [];
        });
        return next;
      });

      const validIds = new Set(nextThreads.map((thread) => thread.id));
      Array.from(messagesLoadedRef.current).forEach((id) => {
        if (!validIds.has(id)) {
          messagesLoadedRef.current.delete(id);
        }
      });

      setHighlightsBySection(deriveHighlightsBySection(nextThreads));
      setActiveConversationId((currentId) => {
        if (currentId && validIds.has(currentId)) {
          return currentId;
        }
        return nextThreads.length ? nextThreads[0].id : null;
      });

      return nextThreads;
    } catch (error) {
      console.error("Failed to load lesson conversations", error);
      return conversationsRef.current || [];
    }
  }, []);

  useEffect(() => {
    const lessonIdentifier = lesson?.id || lessonId || null;
    resetConversations();
    if (!lessonIdentifier) {
      return;
    }

    let isMounted = true;

    (async () => {
      const threads = await syncConversationsFromServer(lessonIdentifier);
      if (
        !isMounted ||
        !lessonIdentifier ||
        (threads && threads.length > 0) ||
        generalSeedInFlightRef.current.has(lessonIdentifier)
      ) {
        return;
      }

      try {
        generalSeedInFlightRef.current.add(lessonIdentifier);
        await createServerConversation(
          lessonIdentifier,
          {
            action: "general",
            highlight_action_id: "general",
            snippet: GENERAL_SNIPPET,
          },
          { activate: true, touch: true }
        );
      } finally {
        generalSeedInFlightRef.current.delete(lessonIdentifier);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [
    lesson?.id,
    lessonId,
    resetConversations,
    syncConversationsFromServer,
    createServerConversation,
  ]);

  const fetchMessagesForConversation = useCallback(
    async (
      conversationId,
      { force = false, skipPersistCheck = false, metaOverride } = {}
    ) => {
      if (!conversationId) {
        return;
      }

      const conversation =
        conversationsRef.current?.find(
          (thread) => thread.id === conversationId
        ) || null;

      if (
        !skipPersistCheck &&
        (!conversation || (conversation && !conversation.isPersisted))
      ) {
        return;
      }

      if (!force && messagesLoadedRef.current.has(conversationId)) {
        return;
      }

      try {
        const response = await fetchConversationMessages(conversationId);
        const payload = ensureArray(
          response?.messages ?? response?.results ?? response
        );
        const conversationMeta =
          metaOverride || buildConversationMeta(conversation);
        const normalizedMessages = payload
          .map((message) => normalizeMessageRecord(message, conversationMeta))
          .filter(Boolean);
        setMessagesByConversation((prev) => ({
          ...prev,
          [conversationId]: normalizedMessages,
        }));
        messagesLoadedRef.current.add(conversationId);
      } catch (error) {
        console.error("Failed to fetch conversation messages", error);
      }
    },
    []
  );

  const selectConversation = useCallback(
    (conversationId) => {
      if (!conversationId) {
        setActiveConversationId(null);
        return;
      }
      setActiveConversationId(conversationId);
      fetchMessagesForConversation(conversationId);
    },
    [fetchMessagesForConversation]
  );

  const createConversationFromSelection = useCallback(
    async (selectionDetails, actionId) => {
      if (!selectionDetails?.text || !actionId) {
        return null;
      }

      const lessonIdentifier = lesson?.id || lessonId || null;
      if (!lessonIdentifier) {
        return null;
      }

      const alignedOffsets = alignOffsetsToSectionContent(
        sections,
        selectionDetails
      );

      const payload = {
        action: actionId,
        highlight_action_id: actionId,
        section_id: selectionDetails.sectionId,
        section_title: selectionDetails.sectionTitle,
        highlight_text: selectionDetails.text,
        highlight_start: alignedOffsets?.start ?? null,
        highlight_end: alignedOffsets?.end ?? null,
      };

      const conversation = await createServerConversation(
        lessonIdentifier,
        payload,
        {
          activate: true,
          pendingReferenceText: selectionDetails.text,
          touch: true,
        }
      );

      if (!conversation) {
        return null;
      }

      const actionPayload = {
        lesson_id: lessonIdentifier,
        section_id: selectionDetails.sectionId,
        section_title: selectionDetails.sectionTitle,
        action: actionId,
        text: selectionDetails.text,
        threadId: conversation.id,
      };

      if (alignedOffsets) {
        actionPayload.highlight_start = alignedOffsets.start;
        actionPayload.highlight_end = alignedOffsets.end;
      } else {
        actionPayload.highlight_start = null;
        actionPayload.highlight_end = null;
      }

      setPendingActionPayload(actionPayload);

      return {
        conversationId: conversation.id,
        actionPayload,
      };
    },
    [lesson, lessonId, sections, createServerConversation]
  );

  const startGeneralConversation = useCallback(async () => {
    const lessonIdentifier = lesson?.id || lessonId || null;
    if (!lessonIdentifier) {
      return null;
    }

    return createServerConversation(
      lessonIdentifier,
      {
        action: "general",
        highlight_action_id: "general",
        snippet: GENERAL_SNIPPET,
      },
      { activate: true, touch: true }
    );
  }, [lesson, lessonId, createServerConversation]);

  const pruneConversationState = useCallback((conversationId) => {
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
      const nextConversations = hasRemaining ? remainingConversations : [];

      setMessagesByConversation((prevMessages) => {
        if (!prevMessages[conversationId]) {
          return hasRemaining ? prevMessages : {};
        }

        const nextMessages = { ...prevMessages };
        delete nextMessages[conversationId];
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
            const { [removedConversation.sectionId]: _omit, ...rest } =
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
      setPendingReferences((prev) => {
        if (!prev[conversationId]) {
          return prev;
        }
        const next = { ...prev };
        delete next[conversationId];
        return next;
      });

      messagesLoadedRef.current.delete(conversationId);

      setActiveConversationId((currentActiveId) => {
        if (currentActiveId !== conversationId) {
          return currentActiveId;
        }

        if (hasRemaining) {
          return remainingConversations[0].id;
        }

        return null;
      });

      return nextConversations;
    });
  }, []);

  const removeConversation = useCallback(
    async (conversationId) => {
      if (!conversationId) {
        return;
      }

      const lessonIdentifier = lesson?.id || lessonId || null;

      try {
        await deleteConversation(conversationId);
      } catch (error) {
        console.error("Failed to delete conversation", error);
        return;
      }

      pruneConversationState(conversationId);

      if (lessonIdentifier) {
        await syncConversationsFromServer(lessonIdentifier);
      }
    },
    [lesson?.id, lessonId, pruneConversationState, syncConversationsFromServer]
  );

  const sendMessage = useCallback(
    async (rawText) => {
      const trimmed = rawText.trim();

      if (!trimmed || !activeConversationId) {
        return false;
      }

      const conversation =
        conversationsRef.current?.find(
          (thread) => thread.id === activeConversationId
        ) || null;
      if (!conversation?.isPersisted) {
        console.warn("Conversation is not ready for messaging yet.");
        return false;
      }
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

      const targetConversationId = activeConversationId;
      const timestamp = Date.now();
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
      touchConversation(targetConversationId);
      setIsSending(true);

      setPendingReferences((prev) => {
        if (!prev[targetConversationId]) {
          return prev;
        }
        const next = { ...prev };
        delete next[targetConversationId];
        return next;
      });

      const requestLessonId =
        actionMeta?.lesson_id || lesson?.id || lessonId || null;
      const requestPayload = {
        user_input: trimmed,
        reference_text: actionMeta?.text || null,
        conversation_id: targetConversationId,
        lesson_id: requestLessonId,
        section_id: actionMeta?.section_id || null,
        section_title: actionMeta?.section_title || null,
      };

      const appendAssistantMessage = (messageText, metaOverride) => {
        const assistantTimestamp = Date.now();
        const assistantMessage = {
          id: `assistant-${assistantTimestamp}`,
          role: "assistant",
          text: messageText,
          meta: metaOverride || actionMeta,
        };
        setMessagesByConversation((prev) => ({
          ...prev,
          [targetConversationId]: [
            ...(prev[targetConversationId] || []),
            assistantMessage,
          ],
        }));
        touchConversation(targetConversationId);
      };

      try {
        await sendLessonChat(requestPayload);
        const syncedThreads = await syncConversationsFromServer(
          requestLessonId
        );
        const syncedTarget = syncedThreads.find(
          (thread) => thread.id === targetConversationId
        );
        await fetchMessagesForConversation(targetConversationId, {
          force: true,
          skipPersistCheck: true,
          metaOverride: buildConversationMeta(syncedTarget),
        });
      } catch (error) {
        const fallbackMessage =
          error?.message ||
          "We could not reach the lesson chat service. Please try again.";
        appendAssistantMessage(`⚠️ ${fallbackMessage}`);
      } finally {
        setIsSending(false);
      }

      return true;
    },
    [
      activeConversationId,
      pendingActionPayload,
      lesson,
      lessonId,
      fetchMessagesForConversation,
      syncConversationsFromServer,
      touchConversation,
    ]
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

  const activePendingReference = useMemo(() => {
    if (!activeConversationId) {
      return null;
    }
    return pendingReferences[activeConversationId] || null;
  }, [pendingReferences, activeConversationId]);

  useEffect(() => {
    if (!activeConversationId) {
      return;
    }
    fetchMessagesForConversation(activeConversationId);
    const lessonIdentifier = lesson?.id || lessonId || null;
    if (!lessonIdentifier) {
      return;
    }
    syncConversationsFromServer(lessonIdentifier);
  }, [
    activeConversationId,
    fetchMessagesForConversation,
    syncConversationsFromServer,
    lesson?.id,
    lessonId,
  ]);

  const orderedConversations = useMemo(
    () => sortConversationsByRecency(conversations),
    [conversations]
  );

  return {
    conversations: orderedConversations,
    activeConversationId,
    activeConversationMessages,
    activePendingAction,
    activePendingReference,
    pendingReferences,
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
