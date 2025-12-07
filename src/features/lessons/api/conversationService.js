const DEFAULT_CONVERSATION_API = "http://localhost:8000";

const getConversationApiBase = () =>
  process.env.REACT_APP_LESSON_CONVERSATIONS_URL ||
  process.env.REACT_APP_LESSON_CHAT_URL ||
  DEFAULT_CONVERSATION_API;

const buildUrl = (path) => {
  const base = getConversationApiBase().replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
};

const parseJsonOrThrow = async (response) => {
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Conversation request failed (${response.status})${
        errorBody ? `: ${errorBody}` : ""
      }`
    );
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

export const fetchLessonConversations = async (lessonId) => {
  if (!lessonId) {
    throw new Error("lessonId is required to fetch conversations");
  }

  const url = buildUrl(
    `/lessons/${encodeURIComponent(lessonId)}/conversation_titles`
  );
  const response = await fetch(url);
  return parseJsonOrThrow(response);
};

export const fetchConversationMessages = async (conversationId) => {
  if (!conversationId) {
    throw new Error(
      "conversationId is required to fetch conversation messages"
    );
  }

  const url = buildUrl(`/conversations/${encodeURIComponent(conversationId)}`);
  const response = await fetch(url);
  return parseJsonOrThrow(response);
};

export const createConversation = async (lessonId, payload = {}) => {
  if (!lessonId) {
    throw new Error("lessonId is required to create conversation");
  }

  const url = buildUrl(
    `/lessons/${encodeURIComponent(lessonId)}/conversations`
  );
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return parseJsonOrThrow(response);
};
