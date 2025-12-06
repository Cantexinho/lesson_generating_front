const DEFAULT_LESSON_GENERATION_ENDPOINT =
  "http://localhost:8000/lessons/generate";

const getLessonGenerationEndpoint = () =>
  process.env.REACT_APP_LESSON_GENERATION_URL ||
  DEFAULT_LESSON_GENERATION_ENDPOINT;

export const requestLessonGeneration = async (payload = {}) => {
  const endpoint = getLessonGenerationEndpoint();

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
      `Lesson generation failed (${response.status})${
        errorBody ? `: ${errorBody}` : ""
      }`
    );
  }

  return response.json();
};
