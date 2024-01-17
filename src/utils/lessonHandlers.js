import * as crudService from "../api/lessonCrudService";

export const handleDeleteLesson = async (title, setSubmitLoading, setParts) => {
  setSubmitLoading(true);

  let lessonData = await crudService.fetchLessonByName(title);
  await crudService.deleteLesson(lessonData.id);
  setParts([]);
  setSubmitLoading(false);
};
