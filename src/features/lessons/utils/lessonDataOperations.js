import * as crudService from "../services/lessonCrudService";

export const handleGenerate = async (title, setSubmitLoading, setParts) => {
  setSubmitLoading(true);

  try {
    const lessonData = await fetchLessonData(title);
    if (!lessonData) return;

    const parts = await handleLessonData(lessonData);
    setParts(parts);
  } catch (err) {
    console.error(err);
  } finally {
    setSubmitLoading(false);
  }
};

export const fetchAllLessons = async (setLessons) => {
  const lessonData = await crudService.fetchAllLessons();
  setLessons(lessonData);
};

export const fetchSingleLesson = async (lesson, setParts) => {
  try {
    const lessonData = await crudService.fetchLessonParts(lesson.id);
    const parts = await handleLessonData(lessonData);
    setParts(parts);
  } catch (err) {
    console.error(err);
  }
};

export const fetchLessonData = async (title, selectedNumber) => {
  const lessonData = await crudService.fetchLessonByName(title);
  return lessonData != null
    ? crudService.fetchLessonParts(lessonData.id)
    : await generateLessonData(title, selectedNumber);
};

export const generateLessonData = async (title, selectedNumber) => {
  const generatorData = await crudService.generateLessonText(
    title,
    selectedNumber
  );
  await crudService.postLessonText(generatorData.content);
  await crudService.createLesson(generatorData.lesson_name);
  const createdLessonData = await crudService.fetchLessonByName(
    generatorData.lesson_name
  );
  await handleSplitLesson(generatorData.content, createdLessonData.id);
  return crudService.fetchLessonParts(createdLessonData.id);
};

export const handleLessonData = async (lessonData) => {
  const sortedParts = lessonData.sort((a, b) => a.number - b.number);
  return sortedParts;
};

export const handleSplitLesson = async (content, lessonId) => {
  const generatorSplitData = await crudService.splitLessonText(content);
  const splitLessonsData = generatorSplitData.map((lesson) => ({
    ...lesson,
    lesson_id: lessonId,
  }));
  await crudService.postSplitLesson(splitLessonsData);
};
