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

export const fetchLessonPartsById = async (lessonId) => {
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
        lesson_part_content: section.text || "",
      }))
      .sort((a, b) => a.number - b.number);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const fetchSingleLesson = async (lesson, setParts) => {
  if (!lesson?.id) {
    return;
  }

  try {
    const parts = await fetchLessonPartsById(lesson.id);
    setParts(parts);
    return parts;
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
