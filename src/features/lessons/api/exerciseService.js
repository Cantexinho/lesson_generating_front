const DEFAULT_API_BASE = "http://localhost:8000";

const getApiBase = () => process.env.REACT_APP_API_BASE_URL || DEFAULT_API_BASE;

const getExercisesEndpoint = (lessonId, sectionId) =>
  `${getApiBase()}/lessons/${lessonId}/sections/${sectionId}/exercises`;

export const getExercises = async ({ lessonId, sectionId }) => {
  const endpoint = getExercisesEndpoint(lessonId, sectionId);

  const response = await fetch(endpoint, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Failed to get exercises (${response.status})${
        errorBody ? `: ${errorBody}` : ""
      }`
    );
  }

  return response.json();
};

export const generateExercises = async ({ lessonId, sectionId }) => {
  const endpoint = getExercisesEndpoint(lessonId, sectionId);

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Exercise generation failed (${response.status})${
        errorBody ? `: ${errorBody}` : ""
      }`
    );
  }

  return response.json();
};

export const checkExercise = async ({ lessonId, sectionId, exercise }) => {
  const exerciseId = exercise.id || exercise.exercise_id || exercise.exerciseId;
  const endpoint = `${getExercisesEndpoint(
    lessonId,
    sectionId
  )}/${exerciseId}/check`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(exercise),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Exercise check failed (${response.status})${
        errorBody ? `: ${errorBody}` : ""
      }`
    );
  }

  // Returns 204 No Content
  return;
};

export const deleteExercise = async ({ lessonId, sectionId, exerciseId }) => {
  const endpoint = `${getExercisesEndpoint(lessonId, sectionId)}/${exerciseId}`;

  const response = await fetch(endpoint, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Exercise delete failed (${response.status})${
        errorBody ? `: ${errorBody}` : ""
      }`
    );
  }

  return;
};
