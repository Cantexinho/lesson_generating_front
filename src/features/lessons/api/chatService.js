const DEFAULT_CHAT_ENDPOINT = "http://localhost:8000/bot-response";

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

  const rawBody = await response.text();

  if (!response.ok) {
    throw new Error(
      `Lesson chat failed (${response.status})${rawBody ? `: ${rawBody}` : ""}`
    );
  }

  if (!rawBody) {
    return null;
  }

  try {
    return JSON.parse(rawBody);
  } catch (error) {
    throw new Error("Lesson chat returned invalid JSON response.");
  }
};
