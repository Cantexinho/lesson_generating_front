import * as crudService from "../api/lessonCrudService";

export const handleDeleteLesson = async (
  title,
  lessonId,
  setSubmitLoading,
  setParts
) => {
  setSubmitLoading(true);

  let lessonData = await crudService.fetchLessonByName(title);
  if (lessonData) {
    await crudService.deleteLesson(lessonData.id);
  } else {
    await crudService.deleteLesson(lessonId);
  }
  setParts([]);
  setSubmitLoading(false);
};
