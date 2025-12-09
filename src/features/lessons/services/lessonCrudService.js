import { MOCK_LESSONS } from "../data/mockLessons";

const LESSON_API_BASE = "http://localhost:8000";

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
  fetchLessonById: (id) =>
    fetchJson(`${LESSON_API_BASE}/lessons/${encodeURIComponent(id || "")}`),
  fetchAllLessons: () => fetchJson(`${LESSON_API_BASE}/lessons/titles`),
  createLessonSection: async ({ lessonId, text, title }) => {
    if (!lessonId) {
      throw new Error("lessonId is required");
    }
    return fetchJson(
      `${LESSON_API_BASE}/lessons/${encodeURIComponent(lessonId)}/sections`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, title, name: title }),
      }
    );
  },
  updateLessonSection: async ({ lessonId, sectionId, text, title }) => {
    if (!lessonId || !sectionId) {
      throw new Error("lessonId and sectionId are required");
    }
    const normalizedTitle =
      typeof title === "string" && title.trim().length
        ? title.trim()
        : undefined;
    const body = {
      text,
      lesson_section_content: text,
    };
    if (normalizedTitle) {
      body.title = normalizedTitle;
      body.name = normalizedTitle;
    }
    return fetchJson(
      `${LESSON_API_BASE}/lessons/${encodeURIComponent(
        lessonId || ""
      )}/sections/${encodeURIComponent(sectionId || "")}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );
  },
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

  let lessons = deepClone(MOCK_LESSONS);

  const cloneBasicLesson = (lesson) => {
    const displayTitle = lesson.title || lesson.name || "Untitled lesson";
    return {
      id: lesson.id,
      title: displayTitle,
      name: displayTitle,
      language: lesson.language || "english",
    };
  };

  const cloneLessonWithSections = (lesson) => ({
    ...cloneBasicLesson(lesson),
    sections: (lesson.sections || []).map((section, index) => ({
      section_id: section.id,
      id: section.id,
      position: section.number ?? index + 1,
      title: section.name,
      text: section.lesson_section_content,
    })),
  });

  const findLessonIndex = (lessonId) =>
    lessons.findIndex((lesson) => lesson.id === lessonId);

  const getLessonById = (lessonId) => {
    const index = findLessonIndex(lessonId);
    return index === -1 ? null : lessons[index];
  };

  return {
    fetchLessonById: async (id) => {
      const lesson = getLessonById(id);
      return lesson ? deepClone(cloneLessonWithSections(lesson)) : null;
    },
    fetchAllLessons: async () =>
      lessons.map((lesson) => deepClone(cloneBasicLesson(lesson))),
    createLessonSection: async ({ lessonId, text, title }) => {
      if (!lessonId) {
        throw new Error("lessonId is required");
      }
      const lessonIndex = findLessonIndex(lessonId);
      if (lessonIndex === -1) {
        throw new Error("Lesson not found");
      }
      const lesson = lessons[lessonIndex];
      const newId = `section-${Date.now()}`;
      const newSection = {
        id: newId,
        number: (lesson.sections?.length || 0) + 1,
        name: title || "",
        lesson_section_content: text || "",
      };
      lesson.sections = [...(lesson.sections || []), newSection];
      lessons[lessonIndex] = lesson;
      return { section_id: newId };
    },
    updateLessonSection: async ({ lessonId, sectionId, text, title }) => {
      if (!lessonId || !sectionId) {
        throw new Error("lessonId and sectionId are required");
      }
      const lessonIndex = findLessonIndex(lessonId);
      if (lessonIndex === -1) {
        throw new Error("Lesson not found");
      }
      const lesson = lessons[lessonIndex];
      const sectionIndex = lesson.sections.findIndex(
        (section) => String(section.id) === String(sectionId)
      );
      if (sectionIndex === -1) {
        throw new Error("Section not found");
      }
      const normalizedTitle =
        typeof title === "string" && title.trim().length
          ? title.trim()
          : lesson.sections[sectionIndex].name;
      lesson.sections[sectionIndex] = {
        ...lesson.sections[sectionIndex],
        lesson_section_content: text,
        name: normalizedTitle,
      };
      lessons[lessonIndex] = lesson;
      return null;
    },
    deleteLesson: async (lessonId) => {
      lessons = lessons.filter((lesson) => lesson.id !== lessonId);
      return { success: true };
    },
  };
})();

const api = useStaticLessons ? mockApi : realApi;

export const fetchLessonById = api.fetchLessonById;
export const fetchAllLessons = api.fetchAllLessons;
export const deleteLesson = api.deleteLesson;
export const createLessonSection = api.createLessonSection;
export const updateLessonSection = api.updateLessonSection;
