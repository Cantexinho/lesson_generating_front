const DEFAULT_CHAT_ENDPOINT = "/api/lesson-chat";

const getChatEndpoint = () =>
  process.env.REACT_APP_LESSON_CHAT_URL || DEFAULT_CHAT_ENDPOINT;

export const sendLessonChat = async (payload = {}) => {
  const endpoint = getChatEndpoint();

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Lesson chat failed (${response.status})${
        errorBody ? `: ${errorBody}` : ""
      }`
    );
  }

  return response.json();
};
