import * as crudService from "../services/lessonCrudService";

export const handleDeleteLesson = async (
  lessonId,
  setSubmitLoading,
  setSections
) => {
  setSubmitLoading(true);
  try {
    if (!lessonId) {
      throw new Error("lessonId is required to delete a lesson");
    }
    await crudService.deleteLesson(lessonId);
    setSections([]);
  } finally {
    setSubmitLoading(false);
  }
};
