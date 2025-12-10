import * as crudService from "../services/lessonCrudService";

export const fetchAllLessons = async (setLessons) => {
  const lessonData = await crudService.fetchAllLessons();
  const titles = Array.isArray(lessonData) ? lessonData : [];

  const normalized = titles.map((lesson, index) => {
    const displayTitle = lesson.title || lesson.name || `Lesson ${index + 1}`;
    return {
      id: lesson.id,
      title: displayTitle,
      name: displayTitle,
      language: lesson.language || null,
    };
  });

  setLessons(normalized);
  return normalized;
};

export const fetchLessonSectionsById = async (lessonId) => {
  try {
    const lessonRecord = await crudService.fetchLessonById(lessonId);
    const sections = lessonRecord?.sections || [];
    return sections
      .map((section, index) => ({
        id:
          section.section_id ||
          section.id ||
          `lesson-${lessonId}-section-${index + 1}`,
        number:
          typeof section.position === "number" ? section.position : index + 1,
        name: section.title?.trim() || `Section ${index + 1}`,
        lesson_section_content: section.text || "",
      }))
      .sort((a, b) => a.number - b.number);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const fetchSingleLesson = async (lesson, setSections) => {
  if (!lesson?.id) {
    return;
  }

  try {
    const sections = await fetchLessonSectionsById(lesson.id);
    setSections(sections);
    return sections;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const handleLessonData = async (lessonData) =>
  lessonData.sort((a, b) => a.number - b.number);

export const deleteLessonById = async (lessonId) => {
  if (!lessonId) {
    return null;
  }

  try {
    return await crudService.deleteLesson(lessonId);
  } catch (err) {
    console.error("Failed to delete lesson", err);
    throw err;
  }
};

export const updateLessonSectionContent = async (
  lessonId,
  sectionId,
  payload
) => {
  if (!lessonId || !sectionId) {
    throw new Error("lessonId and sectionId are required");
  }
  const normalizedPayload =
    typeof payload === "string" ? { text: payload } : { ...(payload || {}) };
  const textToSend =
    typeof normalizedPayload.text === "string" ? normalizedPayload.text : "";
  const titleToSend =
    typeof normalizedPayload.title === "string"
      ? normalizedPayload.title
      : undefined;
  await crudService.updateLessonSection({
    lessonId,
    sectionId,
    text: textToSend,
    title: titleToSend,
  });
  return fetchLessonSectionsById(lessonId);
};

export const addLessonSection = async (lessonId, payload) => {
  if (!lessonId) {
    throw new Error("lessonId is required");
  }
  const { text, title } = payload || {};
  await crudService.createLessonSection({
    lessonId,
    text: text || "",
    title: title || "",
  });
  return fetchLessonSectionsById(lessonId);
};

export const removeLessonSection = async (lessonId, sectionId) => {
  if (!lessonId || !sectionId) {
    throw new Error("lessonId and sectionId are required");
  }
  await crudService.deleteLessonSection({ lessonId, sectionId });
  return fetchLessonSectionsById(lessonId);
};

export const moveLessonSection = async (lessonId, sectionId, newPosition) => {
  if (!lessonId || !sectionId) {
    throw new Error("lessonId and sectionId are required");
  }
  await crudService.updateSectionPosition({
    lessonId,
    sectionId,
    position: newPosition,
  });
  return fetchLessonSectionsById(lessonId);
};
