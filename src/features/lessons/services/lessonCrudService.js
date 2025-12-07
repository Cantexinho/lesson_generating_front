import { MOCK_LESSONS, createMockLesson } from "../data/mockLessons";

const LESSON_API_BASE = "http://localhost:8000";
const LESSON_TEXT_API = "http://localhost:8000";

const useStaticLessons = process.env.REACT_APP_USE_STATIC_LESSONS === "true";

const fetchJson = async (url, options) => {
  const response = await fetch(url, options);
  const responseText = await response.text();

  if (!response.ok) {
    const error = new Error(
      `Request failed with status ${response.status} for ${url}`
    );
    error.status = response.status;
    error.statusText = response.statusText;
    error.body = responseText;
    throw error;
  }

  if (!responseText) {
    return null;
  }

  try {
    return JSON.parse(responseText);
  } catch (parseError) {
    const error = new Error(`Failed to parse JSON response from ${url}`);
    error.cause = parseError;
    error.rawBody = responseText;
    throw error;
  }
};

const realApi = {
  fetchLessonByName: (title) =>
    fetchJson(
      `${LESSON_API_BASE}/lesson?name=${encodeURIComponent(title || "")}`
    ),
  fetchLessonById: (id) =>
    fetchJson(`${LESSON_API_BASE}/lessons/${encodeURIComponent(id || "")}`),
  fetchAllLessons: () => fetchJson(`${LESSON_API_BASE}/lessons/titles`),
  fetchLessonParts: (id) =>
    fetchJson(
      `${LESSON_API_BASE}/lesson/${encodeURIComponent(id || "")}/parts`
    ),
  generateLessonText: ({
    userInput,
    format,
    audience,
    length,
    language,
    model,
  }) =>
    fetchJson(`${LESSON_TEXT_API}/lesson/text/generate`, {
      method: "POST",
      body: JSON.stringify({
        user_input: userInput ?? "",
        format,
        audience,
        length,
        language: language ?? "english",
        model,
      }),
      headers: { "Content-Type": "application/json" },
    }),
  createLesson: (name) =>
    fetchJson(`${LESSON_API_BASE}/lesson/name`, {
      method: "POST",
      body: JSON.stringify({ name }),
      headers: { "Content-Type": "application/json" },
    }),
  splitLessonText: (content) =>
    fetchJson(`${LESSON_TEXT_API}/lesson/text/split`, {
      method: "POST",
      body: JSON.stringify({ lesson_text: content }),
      headers: { "Content-Type": "application/json" },
    }),
  postSplitLesson: (splitLessonsData) =>
    fetchJson(`${LESSON_API_BASE}/lesson/parts/`, {
      method: "POST",
      body: JSON.stringify(splitLessonsData),
      headers: { "Content-Type": "application/json" },
    }),
  postLessonText: (content) =>
    fetchJson(`${LESSON_API_BASE}/lesson/text/`, {
      method: "POST",
      body: JSON.stringify({ content }),
      headers: { "Content-Type": "application/json" },
    }),
  regeneratePart: (title, part) =>
    fetchJson(`${LESSON_TEXT_API}/lesson/part/regenerate`, {
      method: "POST",
      body: JSON.stringify({
        lesson_name: title,
        part_name: part.name,
        part_content: part.lesson_part_content,
      }),
      headers: { "Content-Type": "application/json" },
    }),
  fetchLessonPart: (partID) =>
    fetchJson(`${LESSON_API_BASE}/lesson/${encodeURIComponent(partID)}/part`),
  updateLessonPart: (newPart) =>
    fetchJson(`${LESSON_API_BASE}/lesson/part/`, {
      method: "PUT",
      body: JSON.stringify({
        id: newPart.id,
        number: newPart.number,
        name: newPart.name,
        lesson_part_content: newPart.lesson_part_content,
        lesson_id: newPart.lesson_id,
      }),
      headers: { "Content-Type": "application/json" },
    }),
  extendPart: (title, part) =>
    fetchJson(`${LESSON_TEXT_API}/lesson/part/extend`, {
      method: "POST",
      body: JSON.stringify({
        lesson_name: title,
        part_name: part.name,
        part_content: part.lesson_part_content,
      }),
      headers: { "Content-Type": "application/json" },
    }),
  deletePart: (partId) =>
    fetchJson(`${LESSON_API_BASE}/lesson/part/`, {
      method: "DELETE",
      body: JSON.stringify({ part_id: partId }),
      headers: { "Content-Type": "application/json" },
    }),
  deleteLesson: async (lessonId) => {
    if (!lessonId) {
      throw new Error("lessonId is required for deleteLesson");
    }

    const deleteWithBody = () =>
      fetchJson(`${LESSON_API_BASE}/lesson/`, {
        method: "DELETE",
        body: JSON.stringify({ lesson_id: lessonId }),
        headers: { "Content-Type": "application/json" },
      });

    const deletePluralPath = () =>
      fetchJson(
        `${LESSON_API_BASE}/lessons/${encodeURIComponent(lessonId || "")}`,
        {
          method: "DELETE",
        }
      );

    const deleteSingularPath = () =>
      fetchJson(
        `${LESSON_API_BASE}/lesson/${encodeURIComponent(lessonId || "")}`,
        {
          method: "DELETE",
        }
      );

    const shouldRetry = (error) =>
      error && (error.status === 404 || error.status === 405);

    try {
      return await deleteWithBody();
    } catch (error) {
      if (!shouldRetry(error)) {
        throw error;
      }
    }

    try {
      return await deletePluralPath();
    } catch (error) {
      if (!shouldRetry(error)) {
        throw error;
      }
    }

    return deleteSingularPath();
  },
};

const mockApi = (() => {
  const deepClone = (value) => JSON.parse(JSON.stringify(value));
  const normalizeTitle = (value) =>
    (value && value.trim()) || "Untitled Lesson";
  const randomId = (prefix) =>
    `${prefix}-${Math.random().toString(36).slice(2, 10)}-${Date.now()}`;

  let lessons = deepClone(MOCK_LESSONS);
  const pendingLessonsByName = new Map();

  const cloneBasicLesson = (lesson) => ({
    id: lesson.id,
    name: lesson.name,
  });

  const findLessonIndex = (lessonId) =>
    lessons.findIndex((lesson) => lesson.id === lessonId);

  const getLessonById = (lessonId) => {
    const index = findLessonIndex(lessonId);
    return index === -1 ? null : lessons[index];
  };

  const findLessonByName = (title) => {
    if (!title) return null;
    const normalized = title.trim().toLowerCase();
    return (
      lessons.find((lesson) => lesson.name.toLowerCase() === normalized) || null
    );
  };

  const findPartLocation = (partId) => {
    for (let lessonIndex = 0; lessonIndex < lessons.length; lessonIndex += 1) {
      const partIndex = lessons[lessonIndex].parts.findIndex(
        (part) => part.id === partId
      );
      if (partIndex !== -1) {
        return { lessonIndex, partIndex };
      }
    }
    return null;
  };

  const normalizeParts = (lessonId, parts) =>
    parts.map((part, index) => ({
      id: part.id || `${lessonId}-part-${index + 1}`,
      lesson_id: lessonId,
      number: part.number || index + 1,
      name: part.name || `Part ${index + 1}`,
      lesson_part_content: part.lesson_part_content || part.content || "",
    }));

  const recordPendingLesson = (lesson) => {
    pendingLessonsByName.set(lesson.name, deepClone(lesson));
  };

  const takePendingLesson = (name) => {
    const pending = pendingLessonsByName.get(name);
    if (pending) {
      pendingLessonsByName.delete(name);
    }
    return pending || null;
  };

  const encodeLessonContent = (lesson) =>
    JSON.stringify({ lessonId: lesson.id, parts: lesson.parts });

  return {
    fetchLessonByName: async (title) => {
      const lesson = findLessonByName(title);
      return lesson ? deepClone(cloneBasicLesson(lesson)) : null;
    },
    fetchLessonById: async (id) => {
      const lesson = getLessonById(id);
      return lesson ? deepClone(cloneBasicLesson(lesson)) : null;
    },
    fetchAllLessons: async () =>
      lessons.map((lesson) => deepClone(cloneBasicLesson(lesson))),
    fetchLessonParts: async (id) => {
      const lesson = getLessonById(id);
      return lesson ? deepClone(lesson.parts) : [];
    },
    generateLessonText: async (generationRequest = {}) => {
      const {
        userInput,
        length,
        language: requestedLanguage,
      } = generationRequest;
      const determinePartCount = (lengthPreset) => {
        switch (lengthPreset) {
          case "detailed":
            return 6;
          case "long":
            return 5;
          case "medium":
            return 4;
          default:
            return 3;
        }
      };
      const partCount = determinePartCount(length);
      const lesson = {
        ...createMockLesson(userInput, partCount),
        language: requestedLanguage || "english",
      };
      recordPendingLesson(lesson);
      return {
        lesson_name: lesson.name,
        content: encodeLessonContent(lesson),
        language: lesson.language,
      };
    },
    createLesson: async (name) => {
      const normalizedName = normalizeTitle(name);
      const pending = pendingLessonsByName.get(normalizedName);
      const lessonRecord = pending
        ? { id: pending.id, name: pending.name, parts: [] }
        : { id: randomId("lesson"), name: normalizedName, parts: [] };

      const existingIndex = findLessonIndex(lessonRecord.id);
      if (existingIndex === -1) {
        lessons = [...lessons, lessonRecord];
      } else {
        lessons[existingIndex] = {
          ...lessons[existingIndex],
          name: lessonRecord.name,
        };
      }

      return deepClone(cloneBasicLesson(lessonRecord));
    },
    splitLessonText: async (content) => {
      if (!content) {
        return [];
      }
      try {
        const parsed = JSON.parse(content);
        if (parsed && Array.isArray(parsed.parts)) {
          return deepClone(parsed.parts);
        }
      } catch (error) {
        return [];
      }
      return [];
    },
    postSplitLesson: async (splitLessonsData) => {
      if (!Array.isArray(splitLessonsData) || splitLessonsData.length === 0) {
        return [];
      }

      const lessonId = splitLessonsData[0].lesson_id;
      const lessonIndex = findLessonIndex(lessonId);
      if (lessonIndex === -1) {
        return [];
      }

      const normalized = normalizeParts(lessonId, splitLessonsData);
      lessons[lessonIndex] = {
        ...lessons[lessonIndex],
        parts: normalized,
      };

      takePendingLesson(lessons[lessonIndex].name);
      return deepClone(normalized);
    },
    postLessonText: async () => ({ ok: true }),
    fetchLessonPart: async (partId) => {
      const location = findPartLocation(partId);
      if (!location) {
        return {
          id: partId,
          lesson_id: null,
          number: 1,
          name: "Unknown Part",
          lesson_part_content: "",
        };
      }
      return deepClone(lessons[location.lessonIndex].parts[location.partIndex]);
    },
    updateLessonPart: async (newPart) => {
      const location = findPartLocation(newPart.id);
      if (!location) {
        return deepClone(newPart);
      }
      const lesson = lessons[location.lessonIndex];
      const updatedPart = {
        ...lesson.parts[location.partIndex],
        ...newPart,
      };
      lesson.parts[location.partIndex] = updatedPart;
      return deepClone(updatedPart);
    },
    regeneratePart: async (title, part) => {
      const baseContent = part?.lesson_part_content || "";
      return `${baseContent}\n\n[Regenerated based on ${title || "lesson"}]`;
    },
    extendPart: async (title, part) => {
      const baseContent = part?.lesson_part_content || "";
      return `${baseContent}\n\n[Extended with additional detail about ${
        title || "lesson"
      }]`;
    },
    deletePart: async (partId) => {
      const location = findPartLocation(partId);
      if (!location) {
        return { success: false };
      }
      const lesson = lessons[location.lessonIndex];
      lesson.parts.splice(location.partIndex, 1);
      lesson.parts = normalizeParts(lesson.id, lesson.parts);
      return { success: true };
    },
    deleteLesson: async (lessonId) => {
      lessons = lessons.filter((lesson) => lesson.id !== lessonId);
      return { success: true };
    },
  };
})();

const api = useStaticLessons ? mockApi : realApi;

export const fetchLessonByName = api.fetchLessonByName;
export const fetchLessonById = api.fetchLessonById;
export const fetchAllLessons = api.fetchAllLessons;
export const fetchLessonParts = api.fetchLessonParts;
export const generateLessonText = api.generateLessonText;
export const createLesson = api.createLesson;
export const splitLessonText = api.splitLessonText;
export const postSplitLesson = api.postSplitLesson;
export const postLessonText = api.postLessonText;
export const regeneratePart = api.regeneratePart;
export const fetchLessonPart = api.fetchLessonPart;
export const updateLessonPart = api.updateLessonPart;
export const extendPart = api.extendPart;
export const deletePart = api.deletePart;
export const deleteLesson = api.deleteLesson;
